import { Request, Response } from 'express';
import prisma from '../config/prisma';
import redis from '../config/redis';

const CACHE_TTL = 60 * 5; // 5 minutes

export const getPosts = async (req: Request, res: Response) => {
    try {
        // @ts-ignore
        const userId = req.user?.userId;
        const cacheKey = 'posts:all';

        let posts = [];
        const cachedPosts = await redis.get(cacheKey);

        if (cachedPosts) {
            posts = JSON.parse(cachedPosts);
        } else {
            posts = await prisma.post.findMany({
                where: { published: true },
                include: {
                    author: { select: { username: true } },
                    votes: true,
                    _count: { select: { comments: true } }
                },
                orderBy: { createdAt: 'desc' }
            });

            // Cache for 60 seconds
            await redis.setex(cacheKey, 60, JSON.stringify(posts));
        }

        const postsWithScore = posts.map((post: any) => {
            const score = post.votes.reduce((acc: any, vote: any) => acc + vote.value, 0);
            const userVote = userId ? post.votes.find((v: any) => v.userId === userId)?.value : undefined;
            const { votes, _count, ...postData } = post; // Remove raw votes array from response
            return { ...postData, score, userVote, commentCount: _count?.comments || post.commentCount };
        });

        res.json(postsWithScore);
    } catch (error) {
        console.error('Error fetching posts:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

export const votePost = async (req: Request, res: Response) => {
    try {
        // @ts-ignore
        const userId = req.user?.userId;
        const { id } = req.params;
        const { value } = req.body; // 1 or -1

        if (!userId) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        if (![1, -1].includes(value)) {
            return res.status(400).json({ error: 'Invalid vote value' });
        }

        await prisma.vote.upsert({
            where: {
                userId_postId: {
                    userId,
                    postId: id
                }
            },
            update: { value },
            create: {
                userId,
                postId: id,
                value
            }
        });

        // Invalidate Cache
        await redis.del('posts:all');

        res.json({ success: true });
    } catch (error) {
        console.error('Error voting:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

export const createPost = async (req: Request, res: Response) => {
    try {
        // @ts-ignore
        const userId = req.user?.userId;
        const { title, content } = req.body;

        if (!userId) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const slug = title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)+/g, '') + '-' + Date.now();

        const post = await prisma.post.create({
            data: {
                title,
                content,
                slug,
                authorId: userId,
                published: true
            }
        });

        // Invalidate Cache
        await redis.del('posts:all');

        res.status(201).json(post);
    } catch (error) {
        console.error('Error creating post:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

export const getMyPosts = async (req: Request, res: Response) => {
    try {
        // @ts-ignore
        const userId = req.user?.userId;

        if (!userId) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const posts = await prisma.post.findMany({
            where: { authorId: userId },
            include: { votes: true },
            orderBy: { createdAt: 'desc' }
        });

        const postsWithScore = posts.map(post => {
            const score = post.votes.reduce((acc, vote) => acc + vote.value, 0);
            const { votes, ...postData } = post;
            return { ...postData, score };
        });

        res.json(postsWithScore);
    } catch (error) {
        console.error('Error fetching my posts:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
