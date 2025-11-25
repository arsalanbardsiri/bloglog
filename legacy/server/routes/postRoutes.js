const express = require('express');
const postController = require('../controllers/postController');
const router = express.Router();

// Get all posts
router.get('/', postController.getAllPosts);

// Get a single post by ID
router.get('/:postId', postController.getPostById);

// Create a new post
router.post('/create', postController.createPost);

// Update a post
router.put('/update/:postId', postController.updatePost);

// Delete a post
router.delete('/delete/:postId', postController.deletePost);

module.exports = router;
