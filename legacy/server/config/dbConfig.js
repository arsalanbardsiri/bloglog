// Database configuration code
require('dotenv').config();

module.exports = {
    // MongoDB connection string
    db: process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/bloglog',
};

