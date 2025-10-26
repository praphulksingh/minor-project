// server/routes/auth.js

const express = require('express');
const router = express.Router();

// Import controller functions and middleware
const { 
    loginUser,
    changePassword 
} = require('../controllers/authController');
// Assuming authMiddleware.js exists and exports 'protect'
const { protect } = require('../middleware/authMiddleware'); 

// --- Define Public Authentication Routes ---
// @desc    Authenticate (log in) a user and get a token
// @route   POST /api/auth/login
// @access  Public
router.post('/login', loginUser); // FIX: Ensure this line correctly maps loginUser

// --- Define Protected User Routes ---
// @desc    Change user password
// @route   PUT /api/auth/change-password
// @access  Private
router.put('/change-password', protect, changePassword);

// Export the router to be used in the main server.js file
module.exports = router;