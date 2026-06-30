const mongoose = require('mongoose');

const ComplaintSchema = new mongoose.Schema({
    complaintId: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        default: 'Anonymous'
    },
    mobile: {
        type: String,
        default: 'Hidden'
    },
    email: {
        type: String,
        default: ''
    },
    district: {
        type: String,
        required: true
    },
    village: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    photoURL: {
        type: String,
        default: null
    },
    latitude: {
        type: String,
        default: null
    },
    longitude: {
        type: String,
        default: null
    },
    status: {
        type: String,
        enum: ['Pending', 'In Progress', 'Resolved', 'Rejected'],
        default: 'Pending'
    },
    technician: {
        type: String,
        default: null
    },
    remarks: {
        type: String,
        default: ''
    },
    anonymous: {
        type: Boolean,
        default: false
    },
    history: [
        {
            status: String,
            remarks: String,
            updatedAt: String
        }
    ]
}, {
    timestamps: true  // auto createdAt & updatedAt
});

module.exports = mongoose.model('Complaint', ComplaintSchema);
