require('dotenv').config();
const mongoose = require('mongoose');

async function testConnection() {
    try {
        console.log("Connecting to MongoDB...");
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("✅ Successfully connected to MongoDB!");
        process.exit(0);
    } catch (err) {
        console.error("❌ MongoDB connection failed:", err.message);
        process.exit(1);
    }
}

testConnection();
