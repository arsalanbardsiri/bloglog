import { Request, Response } from 'express';
import prisma from '../config/prisma';
import redis from '../config/redis';

const CACHE_TTL = 60 * 5; // 5 minutes

export const getPosts = async (req: Request, res: Response) => {
    try {
        const cacheKey = 'posts:all';

        // 1. Check Cache
        const cachedPosts = await redis.get(cacheKey);
        if (cachedPosts) {
            console.log('Serving posts from CACHE');
            return res.json(JSON.parse(cachedPosts));
        }

        // 2. Fetch from DB
        console.log('Serving posts from DB');
        const posts = await prisma.post.findMany({
            where: { published: true },
            include: { author: { select: { username: true } } },
            orderBy: { createdAt: 'desc' }
        });

        // 3. Set Cache
        await redis.setex(cacheKey, CACHE_TTL, JSON.stringify(posts));

        res.json(posts);
    } catch (error) {
        console.error('Error fetching posts:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

export const createPost = async (req: Request, res: Response) => {
    try {
        const { title, content, authorId, slug } = req.body;

        const post = await prisma.post.create({
            data: {
                title,
                content,
                slug,
                authorId,
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
