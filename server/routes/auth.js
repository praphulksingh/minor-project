const express = require('express');
const router = express.Router();

// Import the controller functions that contain the logic for each route
const { 
    signupUser, 
    loginUser 
} = require('../controllers/authController'); // We will create this file next

// --- Define Authentication Routes ---

// @desc    Register (sign up) a new user
// @route   POST /api/auth/signup
// @access  Public
router.post('/signup', signupUser);


// @desc    Authenticate (log in) a user and get a token
// @route   POST /api/auth/login
// @access  Public
router.post('/login', loginUser);


// Export the router to be used in the main server.js file
module.exports = router;
