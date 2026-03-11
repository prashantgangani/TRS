const mongoose = require('mongoose');

const lawSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, default: 'General' },
    order: { type: Number, default: 0 }
});

module.exports = mongoose.model('Law', lawSchema);
