// server/routes/auth.js

const express = require('express');
const router = express.Router();

// Import the controller function for login
const { 
    // REMOVED: signupUser, 
    loginUser 
} = require('../controllers/authController');

// --- Define Public Authentication Routes ---

// @desc    Authenticate (log in) a user and get a token
// @route   POST /api/auth/login
// @access  Public
router.post('/login', loginUser);

// EXPLICITLY REMOVED THE PUBLIC SIGNUP ROUTE

// Export the router to be used in the main server.js file
module.exports = router;