// --- Load environment variables FIRST ---
// This ensures all other files can access them
require('dotenv').config();

// --- Import necessary packages ---
const express = require('express');
const cors = require('cors'); // Import the cors package
const connectDB = require('./config/db');
const authRoutes = require('./routes/auth');

// --- Connect to MongoDB Database ---
// It's good practice to connect before starting the server
connectDB();

// --- Initialize Express App ---
const app = express();

// --- Middlewares ---
// These must be defined AFTER initializing 'app'
app.use(cors()); // Use CORS to allow cross-origin requests
app.use(express.json()); // Allow the server to accept JSON data

// --- API Routes ---
// Define a simple root route to confirm the server is running
app.get('/', (req, res) => {
    res.send('SPAV-SmartEvent API is running...');
});

// Mount the authentication routes
app.use('/api/auth', authRoutes);

// --- Define the Port ---
const PORT = process.env.PORT || 5000;

// --- Start the Server ---
app.listen(PORT, () => {
    console.log(`Server is running successfully on port ${PORT}`);
});
