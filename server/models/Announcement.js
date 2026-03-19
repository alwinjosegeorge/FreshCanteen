const mongoose = require('mongoose');

const announcementSchema = new mongoose.Schema({
    title: { type: String, required: true },
    body: { type: String, required: true },
    emoji: { type: String, default: '📢' },
    pinned: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Announcement', announcementSchema);
