const express = require('express');
const router = express.Router();
const Complaint = require('../models/Complaint');
const connectDB = require('../config/database');

// Generate unique Complaint ID
const generateId = () => `CMS-${Math.floor(1000 + Math.random() * 9000)}-${Date.now().toString().slice(-4)}`;

// -----------------------------------------------
// @route   POST /api/complaints
// @desc    Register a new complaint
// -----------------------------------------------
router.post('/', async (req, res) => {
    try {
        await connectDB(); // Ensure DB connected (critical for serverless)

        const {
            name, mobile, email, district, village,
            category, description, photoURL,
            anonymous, latitude, longitude
        } = req.body;

        const complaintId = generateId();

        const newComplaint = await Complaint.create({
            complaintId,
            name:   anonymous ? 'Anonymous' : (name || 'Anonymous'),
            mobile: anonymous ? 'Hidden'    : (mobile || 'Hidden'),
            email:  anonymous ? ''          : (email || ''),
            district:    district    || '',
            village:     village     || '',
            category:    category    || 'Other',
            description: description || '',
            photoURL:  photoURL  || null,
            latitude:  latitude  || null,
            longitude: longitude || null,
            anonymous: !!anonymous,
            status: 'Pending',
            history: []
        });

        res.status(201).json({ success: true, data: newComplaint });

    } catch (error) {
        console.error('Error creating complaint:', error);
        res.status(500).json({ success: false, message: error.message || 'Server Error' });
    }
});

// -----------------------------------------------
// @route   GET /api/complaints
// @desc    Get all complaints (Admin)
// -----------------------------------------------
router.get('/', async (req, res) => {
    try {
        const complaints = await Complaint.find().sort({ createdAt: -1 });
        res.json({ success: true, count: complaints.length, data: complaints });
    } catch (error) {
        console.error('Error fetching complaints:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
});

// -----------------------------------------------
// @route   GET /api/complaints/:id
// @desc    Get complaint by ID (Track)
// -----------------------------------------------
router.get('/:id', async (req, res) => {
    try {
        const complaint = await Complaint.findOne({ complaintId: req.params.id });

        if (!complaint) {
            return res.status(404).json({ success: false, message: 'Complaint not found. Please check the ID.' });
        }

        res.json({ success: true, data: complaint });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error' });
    }
});

// -----------------------------------------------
// @route   PATCH /api/complaints/:id/status
// @desc    Update complaint status (Admin)
// -----------------------------------------------
router.patch('/:id/status', async (req, res) => {
    try {
        const { status, remarks, technician } = req.body;

        const complaint = await Complaint.findOne({ complaintId: req.params.id });

        if (!complaint) {
            return res.status(404).json({ success: false, message: 'Complaint not found' });
        }

        // Update fields
        if (status)     complaint.status     = status;
        if (technician) complaint.technician = technician;
        if (remarks)    complaint.remarks    = remarks;

        // Add to history
        complaint.history.push({
            status: status || complaint.status,
            remarks: remarks || '',
            updatedAt: new Date().toISOString()
        });

        await complaint.save();

        res.json({ success: true, data: complaint });

    } catch (error) {
        console.error('Error updating complaint:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
});

module.exports = router;
