const express = require('express');
const router = express.Router();
const { db } = require('../config/firebase');

// Generate Complaint ID
const generateId = () => `CMS-${Math.floor(1000 + Math.random() * 9000)}`;

const { sendComplaintNotification } = require('../utils/emailService');

// @route   POST /api/complaints
// @desc    Register a new complaint
router.post('/', async (req, res) => {
    try {
        const { name, mobile, email, district, village, category, description, photoURL, anonymous } = req.body;

        const complaintId = generateId();
        const newComplaint = {
            complaintId,
            name: anonymous ? "Anonymous" : name,
            mobile: anonymous ? "Hidden" : mobile,
            email: anonymous ? "Hidden" : (email || "Not Provided"),
            district,
            village,
            category,
            description,
            photoURL: photoURL || null,
            status: "Pending",
            createdAt: new Date().toISOString(), // User friendly string
            timestamp: new Date(), // Firestore Sortable
            history: []
        };

        if (db) {
            await db.collection('complaints').doc(complaintId).set(newComplaint);

            // Send Email Notification (Async - don't wait for it to block response)
            sendComplaintNotification(newComplaint);

            res.status(201).json({ success: true, data: newComplaint });
        } else {
            console.warn("DB not connected, using in-memory mock for now");
            // Fallback for demo if DB fails:
            res.status(201).json({ success: true, data: newComplaint });
        }
    } catch (error) {
        console.error("Error creating complaint:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
});

// @route   GET /api/complaints/:id
// @desc    Get complaint status by ID
router.get('/:id', async (req, res) => {
    try {
        if (!db) return res.status(500).json({ message: "DB not connected" });

        const doc = await db.collection('complaints').doc(req.params.id).get();

        if (!doc.exists) {
            return res.status(404).json({ success: false, message: 'Complaint not found' });
        }

        res.json({ success: true, data: doc.data() });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server Error" });
    }
});

// @route   GET /api/complaints
// @desc    Get all complaints (Admin)
router.get('/', async (req, res) => {
    try {
        if (!db) return res.status(500).json({ message: "DB not connected" });

        const snapshot = await db.collection('complaints').orderBy('timestamp', 'desc').get();
        const complaints = snapshot.docs.map(doc => doc.data());

        res.json({ success: true, count: complaints.length, data: complaints });
    } catch (error) {
        console.error("Error fetching complaints:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
});

// @route   PATCH /api/complaints/:id/status
// @desc    Update status (Admin)
router.patch('/:id/status', async (req, res) => {
    try {
        if (!db) return res.status(500).json({ message: "DB not connected" });

        const { status, remarks, technician } = req.body;
        const ref = db.collection('complaints').doc(req.params.id);

        const doc = await ref.get();
        if (!doc.exists) {
            return res.status(404).json({ success: false, message: 'Complaint not found' });
        }

        const currentData = doc.data();
        const history = currentData.history || [];

        const updateData = {};
        if (status) updateData.status = status;
        if (technician) updateData.assignedTo = technician;

        updateData.history = [
            ...history,
            {
                status: status || currentData.status,
                remarks: remarks || "",
                updatedAt: new Date().toISOString()
            }
        ];

        await ref.update(updateData);

        // Return updated data
        const updatedDoc = await ref.get();
        res.json({ success: true, data: updatedDoc.data() });

    } catch (error) {
        console.error("Error updating complaint:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
});

module.exports = router;
