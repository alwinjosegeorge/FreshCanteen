const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    admissionNumber: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    password: { type: String, default: '123456' },
    role: { type: String, enum: ['student', 'admin'], default: 'student' },
    points: { type: Number, default: 0 },
    totalEarned: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
