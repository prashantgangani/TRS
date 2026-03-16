const mongoose = require('mongoose');

const previousMeetSchema = new mongoose.Schema({
    themeName: { type: String, required: true },
    imageUrl: { type: String, default: 'https://images.unsplash.com/photo-1542282088-fe8426682b8f?auto=format&fit=crop&q=80&w=1000' },
    imageUrls: { type: [String], default: [] },
    order: { type: Number, default: 0 }
}, { timestamps: true });

previousMeetSchema.index({ order: 1, createdAt: -1 });
module.exports = mongoose.model('PreviousMeet', previousMeetSchema);
