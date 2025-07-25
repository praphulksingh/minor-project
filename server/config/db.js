const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        // Attempt to connect to the database
        const conn = await mongoose.connect(process.env.MONGO_URI, {
            // These are recommended options to avoid deprecation warnings
            useNewUrlParser: true,
            useUnifiedTopology: true,
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