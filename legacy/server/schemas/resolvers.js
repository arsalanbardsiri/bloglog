require("dotenv").config();
const User = require("../models/User");
const Post = require("../models/Post");
const Comment = require("../models/Comment");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const resolvers = {
  Query: {
    users: async () => await User.find({}),
    user: async (_, { id }) => await User.findById(id),
    posts: async () =>
      await Post.find({}).populate("author").populate("comments"),
    post: async (_, { id }) =>
      await Post.findById(id).populate("author").populate("comments"),
  },
  Mutation: {
    createUser: async (_, { username, email, password }) => {
      try {
        const newUser = new User({ username, email, password });
        const savedUser = await newUser.save();
    
        const token = jwt.sign({ userId: savedUser._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
        return { user: savedUser, token };
      } catch (error) {
        console.error("Error creating user:", error);
        throw new Error("Error creating user");
      }
    },
    createPost: async (_, { title, content, authorId }) => {
      const newPost = new Post({ title, content, author: authorId });
      await newPost.save();
      newPost.author = newPost.author.toString(); // Convert to string
      return newPost;
    },
    updatePost: async (_, { postId, title, content }, context) => {
      // Extracting user from context
      const { user } = context;

      // Check if user is present in the context
      if (!user || !user.userId) {
        throw new Error("Unauthorized");
      }

      // Find the post by ID
      const post = await Post.findById(postId);
      // Check if post exists and if the user is the author
      if (!post || post.author.toString() !== user.userId) {
        throw new Error("Not authorized to edit this post or post not found");
      }

      // Update the post
      post.title = title;
      post.content = content;
      await post.save();
      post.author = post.author.toString();
      return post;
    },

    deletePost: async (_, { postId }, { user }) => {
      if (!user) {
        throw new Error("Unauthorized");
      }

      const post = await Post.findById(postId);
      if (!post || post.author.toString() !== user.userId) {
        throw new Error("Not authorized to delete this post");
      }

      await Post.findByIdAndDelete(postId);
      return true;
    },
    createComment: async (_, { content, postId, authorId }) => {
      const newComment = new Comment({
        content,
        post: postId,
        author: authorId,
      });
      await newComment.save();
      return newComment;
    },
    loginUser: async (_, { email, password }) => {
      const user = await User.findOne({ email });
      if (!user || !await bcrypt.compare(password, user.password)) {
        throw new Error("Invalid credentials");
      }
    
      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
      return { token, user };
    },
  },
};

module.exports = resolvers;
