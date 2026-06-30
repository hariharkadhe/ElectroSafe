const mongoose = require('mongoose');

let isConnected = false;

const connectDB = async () => {
    if (isConnected) return;

    const uri = process.env.MONGODB_URI;

    if (!uri) {
        console.warn('⚠️  MONGODB_URI not set. Database will not connect.');
        return;
    }

    try {
        await mongoose.connect(uri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        isConnected = true;
        console.log('✅ MongoDB Connected');
    } catch (error) {
        console.error('❌ MongoDB Connection Error:', error.message);
    }
};

module.exports = connectDB;
