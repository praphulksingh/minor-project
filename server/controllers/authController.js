const User = require('../models/User'); // Import the User model
const jwt = require('jsonwebtoken');   // Import jsonwebtoken for creating tokens

// --- Helper Function to Generate a Token ---
// This function creates a signed JWT so the user can stay logged in.
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d', // The token will be valid for 30 days
    });
};


// --- Controller for User Signup ---
// @desc    Register (sign up) a new user
// @route   POST /api/auth/signup
exports.signupUser = async (req, res) => {
    // 1. Get user data from the request body
    const { name, email, password, role } = req.body;

    try {
        // 2. Check if a user with this email already exists
        const userExists = await User.findOne({ email });

        if (userExists) {
            return res.status(400).json({ success: false, message: 'User with this email already exists' });
        }

        // 3. Create a new user in the database
        // The password will be automatically hashed by the middleware in User.js
        const user = await User.create({
            name,
            email,
            password,
            role,
        });

        // 4. If user was created successfully, send back a success response
        if (user) {
            res.status(201).json({
                success: true,
                message: 'User registered successfully',
                user: {
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                },
                token: generateToken(user._id), // Generate and send a token
            });
        } else {
            res.status(400).json({ success: false, message: 'Invalid user data received' });
        }
    } catch (error) {
        // Handle potential errors (e.g., validation errors from the model)
        res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
};


// --- Controller for User Login ---
// @desc    Authenticate (log in) a user
// @route   POST /api/auth/login
exports.loginUser = async (req, res) => {
    // 1. Get login credentials from the request body
    const { email, password } = req.body;

    // Check if email and password were provided
    if (!email || !password) {
        return res.status(400).json({ success: false, message: 'Please provide an email and password' });
    }

    try {
        // 2. Find the user by email in the database
        // We must explicitly select the password because it's hidden by default in the model
        const user = await User.findOne({ email }).select('+password');

        // 3. Check if user exists AND if the entered password is correct
        // The 'matchPassword' method is a custom method we defined in the User.js model
        if (user && (await user.matchPassword(password))) {
            // 4. If login is successful, send back user info and a new token
            res.status(200).json({
                success: true,
                message: 'Logged in successfully',
                user: {
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                },
                token: generateToken(user._id),
            });
        } else {
            // If user not found or password incorrect
            res.status(401).json({ success: false, message: 'Invalid email or password' });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
};
