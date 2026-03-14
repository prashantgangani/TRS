const mongoose = require('mongoose');

const carSchema = new mongoose.Schema({
    meetTheme: { type: String, required: true },
    carName: { type: String, required: true },
    carOwner: { type: String, required: true },
    description: { type: String, required: true },
    image: { type: String, required: true },
    order: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Car', carSchema);
