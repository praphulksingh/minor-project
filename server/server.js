// server/server.js

// --- Load environment variables FIRST ---
require('dotenv').config();

// --- Import necessary packages ---
const express = require('express');
const cors = require('cors'); 
const connectDB = require('./config/db');
const authRoutes = require('./routes/auth'); // Imports the auth router module
const hodRoutes = require('./routes/hod');   // Imports the hod router module

// --- Connect to MongoDB Database ---
connectDB();

// --- Initialize Express App ---
const app = express(); // MUST be here before using 'app.use' or 'app.get'

// --- Middlewares ---
app.use(cors()); 
app.use(express.json()); 

// --- API Routes ---
app.get('/', (req, res) => {
    res.send('SPAV-SmartEvent API is running...');
});

// Mount the authentication routes
app.use('/api/auth', authRoutes); // CORRECT: Mount the module
// Mount the HOD-specific routes
app.use('/api/hod', hodRoutes);   // CORRECT: Mount the module

// --- Define the Port ---
const PORT = process.env.PORT || 5000;

// --- Start the Server ---
app.listen(PORT, () => {
    console.log(`Server is running successfully on port ${PORT}`);
});