require('dotenv').config();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User'); // Adjust the path as necessary
const JWT_SECRET = process.env.JWT_SECRET;

// Middleware for verifying JWT tokens in HTTP requests
const authMiddleware = async (req) => {
  try {
    const authHeader = req.headers.authorization || '';
    if (!authHeader.startsWith('Bearer ')) {
      return { user: null }; // No token provided
    }

    const token = authHeader.substring(7);
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');
    return { user };
  } catch (error) {
    return { user: null }; // Invalid or expired token
  }
};

// Function for comparing input password with stored hashed password
const comparePassword = async (inputPassword, storedPassword) => {
  return await bcrypt.compare(inputPassword, storedPassword);
};

// Function for generating JWT token for a user
const generateToken = user => {
  return jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '1h' });
};

// Exporting the utility functions
module.exports = {
  authMiddleware,
  comparePassword,
  generateToken
};
