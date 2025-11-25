"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const postController_1 = require("../controllers/postController");
const commentController_1 = require("../controllers/commentController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = (0, express_1.Router)();
// Optional auth for getPosts to see "myVote"
router.get('/', (req, res, next) => {
    // Custom middleware to allow optional auth
    const authHeader = req.headers.authorization;
    if (authHeader) {
        (0, authMiddleware_1.authMiddleware)(req, res, next);
    }
    else {
        next();
    }
}, postController_1.getPosts);
router.get('/me', authMiddleware_1.authMiddleware, postController_1.getMyPosts);
router.post('/', authMiddleware_1.authMiddleware, postController_1.createPost);
router.post('/:id/vote', authMiddleware_1.authMiddleware, postController_1.votePost);
// Comments
router.get('/:id/comments', commentController_1.getComments);
router.post('/:id/comments', authMiddleware_1.authMiddleware, commentController_1.createComment);
exports.default = router;
