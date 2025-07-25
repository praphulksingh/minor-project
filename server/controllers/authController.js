const User = require('../models/User'); // Import the User model
const jwt = require('jsonwebtoken'); // Import jsonwebtoken for creating tokens

// --- Helper Function to Generate a Token ---
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};

// --- Controller for User Signup ---
// @desc    Register (sign up) a new user
// @route   POST /api/auth/signup
exports.signupUser = async (req, res) => {
    // 1. Get all possible user data from the request body
    const { name, email, password, role, studentId, department } = req.body;

    try {
        // 2. Check if a user with this email already exists
        const userExists = await User.findOne({ email });

        if (userExists) {
            return res.status(400).json({ success: false, message: 'User with this email already exists' });
        }

        // 3. Create a new user object with all the data
        // Mongoose is smart and will only use the fields that apply to the schema
        const newUserPayload = {
            name,
            email,
            password,
            role,
            studentId,  // Will be undefined if not a student, and that's okay
            department, // Will be undefined if not faculty/hod, and that's okay
        };
        
        const user = await User.create(newUserPayload);

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
        // Log the full error for debugging
        console.error("SIGNUP ERROR:", error);
        // Send back a helpful error message
        res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
};


// --- Controller for User Login ---
// @desc    Authenticate (log in) a user
// @route   POST /api/auth/login
exports.loginUser = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ success: false, message: 'Please provide an email and password' });
    }

    try {
        const user = await User.findOne({ email }).select('+password');

        if (user && (await user.matchPassword(password))) {
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
            res.status(401).json({ success: false, message: 'Invalid email or password' });
        }
    } catch (error) {
        console.error("LOGIN ERROR:", error);
        res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
};
