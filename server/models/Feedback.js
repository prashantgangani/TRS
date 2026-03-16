const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
    text: { type: String, required: true },
    reviewed: { type: Boolean, default: false },
    ipAddress: { type: String },
    createdAt: { type: Date, default: Date.now }
});

feedbackSchema.index({ createdAt: -1 });
module.exports = mongoose.model('Feedback', feedbackSchema);
