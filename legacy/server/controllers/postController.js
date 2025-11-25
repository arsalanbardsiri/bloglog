// Post controller code
const Post = require('../models/Post');

exports.getAllPosts  = async (req, res) => {
    try {
        const posts = await Post.find().populate('author');
        res.status(200).json(posts);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching posts', err });
    }
};

exports.createPost = async (req, res) => {
    try {
        const { title, content } = req.body;
        const userId = req.user.id;  // Assuming user ID is available in the request after authentication

        const newPost = new Post({
            title,
            content,
            author: userId
        });

        await newPost.save();
        res.status(201).json({ message: 'Post created successfully', newPost });
    } catch (err) {
        res.status(500).json({ message: 'Error creating post', err });
    }
};
exports.getPostById = async (req, res) => {
    try {
        const postId = req.params.postId;
        const post = await Post.findById(postId).populate('author');
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }
        res.status(200).json(post);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching post', err });
    }
};
exports.updatePost = async (req, res) => {
    try {
        const postId = req.params.postId;
        const { title, content } = req.body;
        const post = await Post.findByIdAndUpdate(postId, { title, content }, { new: true });
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }
        res.status(200).json({ message: 'Post updated successfully', post });
    } catch (err) {
        res.status(500).json({ message: 'Error updating post', err });
    }
};
exports.deletePost = async (req, res) => {
    try {
        const postId = req.params.postId;
        const post = await Post.findByIdAndDelete(postId);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }
        res.status(200).json({ message: 'Post deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Error deleting post', err });
    }
};
