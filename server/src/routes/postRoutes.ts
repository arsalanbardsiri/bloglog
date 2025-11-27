import { Router } from 'express';
import { createPost, getPosts, getMyPosts, votePost, deletePost } from '../controllers/postController';
import { getComments, createComment } from '../controllers/commentController';

import { authMiddleware } from '../middleware/authMiddleware';

const router = Router();

// Optional auth for getPosts to see "myVote"
router.get('/', (req, res, next) => {
    // Custom middleware to allow optional auth
    const authHeader = req.headers.authorization;
    if (authHeader) {
        authMiddleware(req, res, next);
    } else {
        next();
    }
}, getPosts);
router.get('/me', authMiddleware, getMyPosts);
router.post('/', authMiddleware, createPost);
router.post('/:id/vote', authMiddleware, votePost);
router.delete('/:id', authMiddleware, deletePost);

// Comments
router.get('/:id/comments', getComments);
router.post('/:id/comments', authMiddleware, createComment);

export default router;
