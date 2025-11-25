import { Request, Response } from 'express';
import prisma from '../config/prisma';

export const getComments = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const comments = await prisma.comment.findMany({
            where: { postId: id },
            include: {
                author: {
                    select: { username: true }
                }
            },
            orderBy: { createdAt: 'desc' }
        });
        res.json(comments);
    } catch (error) {
        console.error('Error fetching comments:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

export const createComment = async (req: Request, res: Response) => {
    try {
        // @ts-ignore
        const userId = req.user?.userId;
        const { id } = req.params;
        const { content } = req.body;

        if (!userId) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        if (!content || content.trim().length === 0) {
            return res.status(400).json({ error: 'Content is required' });
        }

        const comment = await prisma.comment.create({
            data: {
                content,
                postId: id,
                authorId: userId
            },
            include: {
                author: {
                    select: { username: true }
                }
            }
        });

        res.status(201).json(comment);
    } catch (error) {
        console.error('Error creating comment:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
