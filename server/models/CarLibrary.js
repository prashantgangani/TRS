const mongoose = require('mongoose');

const carLibrarySchema = new mongoose.Schema({
    name: { type: String, required: true },
    imageUrl: { type: String, required: false },
    description: { type: String, required: false },
    isActive: { type: Boolean, default: true }
}, {
    timestamps: true
});

module.exports = mongoose.model('CarLibrary', carLibrarySchema);
