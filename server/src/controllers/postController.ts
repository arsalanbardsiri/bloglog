import { Request, Response } from 'express';
import prisma from '../config/prisma';
import redis from '../config/redis';

const CACHE_TTL = 60 * 5; // 5 minutes

export const getPosts = async (req: Request, res: Response) => {
    try {
        // @ts-ignore
        const userId = req.user?.userId;
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 9;
        const sort = req.query.sort as string || 'new';
        const skip = (page - 1) * limit;

        const cacheKey = `posts:all:${sort}:${page}:${limit}`;

        // Try cache first
        const cachedPosts = await redis.get(cacheKey);
        if (cachedPosts) {
            return res.json(JSON.parse(cachedPosts));
        }

        const orderBy = sort === 'top' ? { score: 'desc' } : { createdAt: 'desc' };

        const posts = await prisma.post.findMany({
            where: { published: true },
            include: {
                author: { select: { username: true } },
                votes: true,
                _count: { select: { comments: true } }
            },
            orderBy: orderBy as any,
            skip,
            take: limit
        });

        const postsWithScore = posts.map((post: any) => {
            const userVote = userId ? post.votes.find((v: any) => v.userId === userId)?.value : undefined;
            const { votes, _count, ...postData } = post;
            return { ...postData, userVote, commentCount: _count?.comments || post.commentCount };
        });

        // Cache for 60 seconds
        await redis.setex(cacheKey, 60, JSON.stringify(postsWithScore));

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

        const existingVote = await prisma.vote.findUnique({
            where: {
                userId_postId: {
                    userId,
                    postId: id
                }
            }
        });

        if (existingVote && existingVote.value === value) {
            // Toggle off (delete vote)
            await prisma.$transaction([
                prisma.vote.delete({
                    where: {
                        userId_postId: { userId, postId: id }
                    }
                }),
                prisma.post.update({
                    where: { id },
                    data: { score: { decrement: value } }
                })
            ]);
        } else {
            // Upsert new vote
            const scoreChange = existingVote ? value - existingVote.value : value;

            await prisma.$transaction([
                prisma.vote.upsert({
                    where: {
                        userId_postId: { userId, postId: id }
                    },
                    update: { value },
                    create: {
                        userId,
                        postId: id,
                        value
                    }
                }),
                prisma.post.update({
                    where: { id },
                    data: { score: { increment: scoreChange } }
                })
            ]);
        }

        // Invalidate Cache (wildcard deletion would be better, but for now just clear common keys)
        // Since keys are dynamic, we might need a pattern match or just rely on TTL.
        // For simplicity, we won't manually invalidate all paginated keys here as it requires SCAN.
        // But we can try to invalidate the main ones if we knew them.
        // Let's just rely on short TTL (60s) for now, or use a Redis pattern delete if available.
        // Actually, let's just clear 'posts:all*' if we can.
        const keys = await redis.keys('posts:all*');
        if (keys.length > 0) {
            await redis.del(keys);
        }

        res.json({ success: true });
    } catch (error) {
        console.error('Error voting:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

export const createPost = async (req: Request, res: Response) => {
    try {
        const { title, content, tags } = req.body;
        // @ts-ignore
        const authorId = req.user?.userId;

        if (!authorId) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const post = await prisma.post.create({
            data: {
                title,
                content,
                tags: tags || [], // Default to empty array if not provided
                slug: title.toLowerCase().replace(/ /g, '-') + '-' + Date.now(),
                authorId
            }
        });

        // Invalidate cache
        const keys = await redis.keys('posts:*');
        if (keys.length > 0) {
            await redis.del(keys);
        }

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
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 6;
        const skip = (page - 1) * limit;

        if (!userId) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const posts = await prisma.post.findMany({
            where: { authorId: userId },
            include: { votes: true },
            orderBy: { createdAt: 'desc' },
            skip,
            take: limit
        });

        const postsWithScore = posts.map(post => {
            const score = post.score; // Use DB score
            const { votes, ...postData } = post;
            return { ...postData, score };
        });

        res.json(postsWithScore);
    } catch (error) {
        console.error('Error fetching my posts:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
