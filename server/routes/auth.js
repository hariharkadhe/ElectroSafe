const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const connectDB = require('../config/database');

const JWT_SECRET = process.env.JWT_SECRET || 'electrosafe_super_secret_2026';
const JWT_EXPIRES = '7d';

// Helper: generate JWT token
const generateToken = (userId) =>
    jwt.sign({ id: userId }, JWT_SECRET, { expiresIn: JWT_EXPIRES });

// Helper: send success response with token
const sendToken = (res, user, statusCode = 200, message = 'Success') => {
    const token = generateToken(user._id);
    res.status(statusCode).json({
        success: true,
        message,
        token,
        user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            avatar: user.avatar
        }
    });
};

// -----------------------------------------------
// @route   POST /api/auth/signup
// @desc    Register a new user
// -----------------------------------------------
router.post('/signup', async (req, res) => {
    try {
        await connectDB();

        const { name, email, password } = req.body;

        // Validation
        if (!name || !email || !password) {
            return res.status(400).json({ success: false, message: 'Please provide name, email, and password.' });
        }
        if (password.length < 8) {
            return res.status(400).json({ success: false, message: 'Password must be at least 8 characters.' });
        }

        // Check if email already used
        const existing = await User.findOne({ email: email.toLowerCase() });
        if (existing) {
            return res.status(409).json({ success: false, message: 'An account with this email already exists.' });
        }

        // Create user (password auto-hashed by pre-save hook)
        const user = await User.create({ name, email, password });

        sendToken(res, user, 201, 'Account created successfully!');
    } catch (err) {
        console.error('Signup error:', err.message);
        res.status(500).json({ success: false, message: 'Server error. Please try again.' });
    }
});

// -----------------------------------------------
// @route   POST /api/auth/login
// @desc    Sign in existing user
// -----------------------------------------------
router.post('/login', async (req, res) => {
    try {
        await connectDB();

        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ success: false, message: 'Please provide email and password.' });
        }

        // Find user and include password for comparison
        const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
        if (!user) {
            return res.status(401).json({ success: false, message: 'No account found with this email.' });
        }

        const isMatch = await user.matchPassword(password);
        if (!isMatch) {
            return res.status(401).json({ success: false, message: 'Incorrect password. Please try again.' });
        }

        sendToken(res, user, 200, 'Signed in successfully!');
    } catch (err) {
        console.error('Login error:', err.message);
        res.status(500).json({ success: false, message: 'Server error. Please try again.' });
    }
});

const { OAuth2Client } = require('google-auth-library');
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// -----------------------------------------------
// @route   POST /api/auth/google
// @desc    Sign in or Register user via Google
// -----------------------------------------------
router.post('/google', async (req, res) => {
    try {
        await connectDB();

        const { credential } = req.body;

        if (!credential) {
            return res.status(400).json({ success: false, message: 'Google authentication failed. No token provided.' });
        }

        // Verify the Google ID token
        const ticket = await googleClient.verifyIdToken({
            idToken: credential,
            // audience: process.env.GOOGLE_CLIENT_ID,  // Specify the CLIENT_ID of the app that accesses the backend
        });
        const payload = ticket.getPayload();
        const { name, email, picture } = payload;

        // Check if user already exists
        let user = await User.findOne({ email: email.toLowerCase() });

        if (!user) {
            // Create a new user with a random secure password since they use Google
            const randomPassword = Math.random().toString(36).slice(-10) + Math.random().toString(36).slice(-10);
            user = await User.create({ 
                name: name || 'Google User', 
                email: email.toLowerCase(), 
                password: randomPassword,
                avatar: picture || ''
            });
        }

        sendToken(res, user, 200, 'Signed in with Google successfully!');
    } catch (err) {
        console.error('Google Auth error:', err.message);
        res.status(500).json({ success: false, message: 'Invalid Google token or Server error. Please try again.' });
    }
});

// -----------------------------------------------
// @route   GET /api/auth/me
// @desc    Get current logged-in user (via JWT)
// -----------------------------------------------
router.get('/me', async (req, res) => {
    try {
        await connectDB();

        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ success: false, message: 'Not authenticated.' });
        }

        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, JWT_SECRET);

        const user = await User.findById(decoded.id);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found.' });
        }

        res.json({
            success: true,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                avatar: user.avatar
            }
        });
    } catch (err) {
        res.status(401).json({ success: false, message: 'Invalid or expired token.' });
    }
});

module.exports = router;
