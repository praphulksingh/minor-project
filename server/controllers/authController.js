// server/controllers/authController.js
const User = require('../models/User');
const jwt = require('jsonwebtoken');

// --- Helper Function to Generate a Token (Updated payload) ---
const generateToken = (user) => {
    // JWT payload includes userId, role, and department
    return jwt.sign(
        { 
            id: user._id, 
            userId: user.userId, 
            role: user.role, 
            department: user.department 
        }, 
        process.env.JWT_SECRET, 
        {
            expiresIn: '30d',
        }
    );
};

// --- Controller for User Login ---
// @desc    Authenticate (log in) a user
// @route   POST /api/auth/login
exports.loginUser = async (req, res) => {
    // CHANGED: Authenticate using userId instead of email
    const { userId, password } = req.body;

    if (!userId || !password) {
        return res.status(400).json({ success: false, message: 'Please provide a User ID and password' });
    }

    try {
        // 1. Find user by userId, and explicitly select password
        const user = await User.findOne({ userId: userId.toUpperCase() }).select('+password');

        // 2. Check if user exists and password matches
        if (user && (await user.matchPassword(password))) {
            res.status(200).json({
                success: true,
                message: 'Logged in successfully',
                user: {
                    _id: user._id,
                    userId: user.userId,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    department: user.department // Include department in response
                },
                token: generateToken(user),
            });
        } else {
            res.status(401).json({ success: false, message: 'Invalid User ID or password' });
        }
    } catch (error) {
        console.error("LOGIN ERROR:", error);
        res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
};
// REMOVED: exports.signupUser