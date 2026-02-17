const express = require('express');
const router = express.Router();
const { db } = require('../config/firebase');

// @route   POST /api/admin/login
// @desc    Check admin credentials or create if none exist
router.post('/login', async (req, res) => {
    try {
        if (!db) return res.status(500).json({ message: "DB not connected" });

        const { username, password, createNew } = req.body;
        const adminsRef = db.collection('admins');

        const snapshot = await adminsRef.get();

        // SCENARIO 1: No admins exist -> Create this one
        if (snapshot.empty || createNew) {
            // If createNew is true, we force creation (logic can be refined)
            // But for this "startup" flow, if empty, we create.
            if (snapshot.empty) {
                await adminsRef.add({ username, password, createdAt: new Date().toISOString() });
                return res.json({ success: true, message: "Admin Account Created", token: "valid-session" });
            } else {
                return res.json({ success: false, message: "Admin already exists. Please login." });
            }
        }

        // SCENARIO 2: Admins exist -> Verify credentials
        let isValid = false;
        snapshot.forEach(doc => {
            const admin = doc.data();
            if (admin.username === username && admin.password === password) {
                isValid = true;
            }
        });

        if (isValid) {
            res.json({ success: true, token: "valid-session" });
        } else {
            res.status(401).json({ success: false, message: "Invalid Credentials" });
        }

    } catch (error) {
        console.error("Admin Auth Error:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
});

// @route   GET /api/admin/check
// @desc    Check if any admin exists (to decide whether to show Login or Create)
router.get('/check', async (req, res) => {
    try {
        if (!db) return res.json({ exists: false, message: "DB not connected" }); // Fallback

        const snapshot = await db.collection('admins').limit(1).get();
        res.json({ exists: !snapshot.empty });
    } catch (error) {
        res.status(500).json({ exists: false });
    }
});

module.exports = router;
