const mongoose = require('mongoose');

const connectDB = async () => {
    // Already connected - reuse connection (important for serverless)
    if (mongoose.connection.readyState >= 1) {
        console.log('✅ MongoDB already connected');
        return;
    }

    const uri = process.env.MONGODB_URI;

    if (!uri) {
        console.error('❌ MONGODB_URI environment variable is NOT set!');
        throw new Error('MONGODB_URI is not defined');
    }

    try {
        await mongoose.connect(uri);
        console.log('✅ MongoDB Connected successfully');
    } catch (error) {
        console.error('❌ MongoDB Connection Failed:', error.message);
        throw error; // Re-throw so the API returns a proper error
    }
};

module.exports = connectDB;
