// Routes for User
const express = require('express');
const userController = require('../controllers/userController');
const router = express.Router();

// User registration
router.post('/register', userController.registerUser);

// User login
router.post('/login', userController.loginUser);

// Get user profile
router.get('/profile/:userId', userController.getUserProfile);

// Update user profile
router.put('/profile/update/:userId', userController.updateUserProfile);

module.exports = router;
