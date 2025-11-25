// Comment controller code
const Comment = require('../models/Comment');

exports.addComment = async (req, res) => {
    try {
        const { content, postId } = req.body;
        const userId = req.user.id;  // Assuming user ID is available in the request after authentication

        const comment = new Comment({
            content,
            author: userId,
            post: postId
        });

        await comment.save();
        res.status(201).json({ message: 'Comment added successfully', comment });
    } catch (err) {
        res.status(500).json({ message: 'Error adding comment', err });
    }
};
exports.getCommentsByPost = async (req, res) => {
    try {
        const postId = req.params.postId;
        const comments = await Comment.find({ post: postId }).populate('author');
        res.status(200).json(comments);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching comments', err });
    }
};
exports.deleteComment = async (req, res) => {
    try {
        const commentId = req.params.commentId;
        const comment = await Comment.findById(commentId);

        if (!comment) {
            return res.status(404).json({ message: 'Comment not found' });
        }

        // Optional: Check if the user requesting the delete is the author of the comment

        await comment.remove();
        res.status(200).json({ message: 'Comment deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Error deleting comment', err });
    }
};
