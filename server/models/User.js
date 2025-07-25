const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// --- Main User Schema ---
// This schema will hold all users, and the 'role' field will differentiate them.
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide a name'],
    },
    email: {
        type: String,
        required: [true, 'Please provide an email'],
        unique: true,
        match: [
            /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
            'Please provide a valid email',
        ],
    },
    password: {
        type: String,
        required: [true, 'Please provide a password'],
        minlength: 6,
        select: false, // The password will not be sent back in queries by default
    },
    role: {
        type: String,
        enum: ['student', 'faculty', 'hod'], // The role must be one of these values
        required: true,
    },
    // --- Role-Specific Fields ---
    // These fields will only be populated for specific roles.
    department: {
        type: String,
        // Only require 'department' if the role is 'faculty' or 'hod'
        required: function() { return this.role === 'faculty' || this.role === 'hod'; },
        trim: true,
    },
    studentId: {
        type: String,
        // Only require 'studentId' if the role is 'student'
        required: function() { return this.role === 'student'; },
        unique: true,
        // We can use a sparse index to enforce uniqueness only when the field exists
        sparse: true, 
        trim: true,
    }
}, {
    timestamps: true, // Automatically adds 'createdAt' and 'updatedAt' fields
});

// --- Middleware to Hash the Password ---
// This function runs automatically before a new user is saved ('save')
userSchema.pre('save', async function(next) {
    // If the password hasn't been modified, skip hashing
    if (!this.isModified('password')) {
        return next();
    }

    // Generate a salt and hash the password
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// --- Custom Method to Compare Passwords ---
// This method can be called on any user document to check their password
userSchema.methods.matchPassword = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

// --- Create and Export the User Model ---
// Mongoose will create a collection named 'users' based on this model
const User = mongoose.model('User', userSchema);

module.exports = User;
