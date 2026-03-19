const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    student: { type: String, required: true },
    admissionNumber: { type: String, required: true },
    items: { type: String, required: true },
    token: { type: String, required: true },
    status: {
        type: String,
        enum: ['Pending', 'Preparing', 'Ready', 'Completed'],
        default: 'Pending'
    },
    total: { type: String, required: true },
    totalNum: { type: Number, required: true },
    timestamp: { type: String, required: true },
    date: { type: String, required: true },
    rating: { type: Number, min: 0, max: 5 }
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
