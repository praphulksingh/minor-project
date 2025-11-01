// server/config/db.js

const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        // Attempt to connect to the database
        const conn = await mongoose.connect(process.env.MONGO_URI, {
            // REMOVED: useNewUrlParser: true,
            // REMOVED: useUnifiedTopology: true,
            // These options are now the default behavior and are removed to fix the warnings.
        });

        // If connection is successful, log it to the console
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        // If there's an error, log it and exit the process
        console.error(`Error: ${error.message}`);
        process.exit(1); // Exit with failure
    }
};

module.exports = connectDB;