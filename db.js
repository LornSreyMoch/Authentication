const mongoose = require('mongoose');

const conDB = async () => {
    try {
        const uri = process.env.MONGO_URI;
        if (!uri) {
            throw new Error("MONGO_URI is not defined in the environment variables");
        }
        await mongoose.connect(uri); // No additional options are needed
        console.log("Connected to MongoDB successfully");
    } catch (error) {
        console.error("Failed to connect to MongoDB:", error.message);
        process.exit(1); // Exit the process if connection fails
    }
};

module.exports = conDB;
