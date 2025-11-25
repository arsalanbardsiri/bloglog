// Routes for Comments 
const express = require('express');
const commentController = require('../controllers/commentController');
const router = express.Router();

// Route to add a comment
router.post('/add', commentController.addComment);

// Route to get comments for a specific post
router.get('/post/:postId', commentController.getCommentsByPost);

// Route to delete a comment
router.delete('/:commentId', commentController.deleteComment);

module.exports = router;
