const mongoose = require('mongoose');

const logSchema = new mongoose.Schema({
    adminName: { type: String, required: true },
    action: { type: String, required: true },
    details: { type: String },
    createdAt: { type: Date, default: Date.now }
});

logSchema.index({ createdAt: -1 });
module.exports = mongoose.model('Log', logSchema);
