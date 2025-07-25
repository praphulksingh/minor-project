const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Define the schema for the User model
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide a name'],
    },
    email: {
        type: String,
        required: [true, 'Please provide an email'],
        unique: true, // Each email must be unique in the database
        match: [ // Regular expression to validate email format
            /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
            'Please provide a valid email address',
        ],
    },
    password: {
        type: String,
        required: [true, 'Please provide a password'],
        minlength: 6, // Enforce a minimum password length
        select: false, // Do not send the password back in query results by default
    },
    role: {
        type: String,
        required: true,
        enum: ['student', 'faculty', 'hod'], // Role must be one of these values
    },
    // Optional but recommended fields
    collegeId: {
        type: String,
        unique: true,
        sparse: true, // Allows multiple null values for this unique field
    },
    department: {
        type: String,
    }
}, {
    // Automatically add 'createdAt' and 'updatedAt' fields
    timestamps: true, 
});

// --- Mongoose Middleware ---
// This function runs BEFORE a new user document is saved to the database
userSchema.pre('save', async function (next) {
    // If the password has not been modified (e.g., during a profile update), skip hashing
    if (!this.isModified('password')) {
        next();
    }

    // Generate a 'salt' to hash the password with
    const salt = await bcrypt.genSalt(10);
    // Hash the password and store it
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// --- Mongoose Model Method ---
// This method can be called on a user document to compare login passwords
userSchema.methods.matchPassword = async function (enteredPassword) {
    // Use bcrypt to compare the plain text password with the hashed one
    return await bcrypt.compare(enteredPassword, this.password);
};


// Create and export the User model
const User = mongoose.model('User', userSchema);
module.exports = User;
