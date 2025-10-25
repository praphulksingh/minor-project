// server/server.js

// --- Load environment variables FIRST ---
require('dotenv').config();

// --- Import necessary packages ---
const express = require('express');
const cors = require('cors'); 
const connectDB = require('./config/db');
const authRoutes = require('./routes/auth');
const hodRoutes = require('./routes/hod'); // <--- 1. MUST BE IMPORTED

// --- Connect to MongoDB Database ---
connectDB();

// --- Initialize Express App ---
// 🔑 FIX: This line MUST come before any use of 'app'
const app = express();

// --- Middlewares ---
app.use(cors()); 
app.use(express.json()); 

// --- API Routes ---
app.get('/', (req, res) => {
    res.send('SPAV-SmartEvent API is running...');
});

// Mount the authentication routes
app.use('/api/auth', authRoutes);
// Mount the HOD-specific routes
app.use('/api/hod', hodRoutes); // <--- 2. MUST BE MOUNTED BEFORE app.listen

// --- Define the Port ---
const PORT = process.env.PORT || 5000;

// --- Start the Server ---
app.listen(PORT, () => {
    console.log(`Server is running successfully on port ${PORT}`);
});