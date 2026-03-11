const mongoose = require('mongoose');

const meetSchema = new mongoose.Schema({
    theme: { type: String, required: true },
    date: { type: String, required: true },
    time: { type: String, required: true },
    location: { type: String, required: true },
    dressCode: { type: String, required: true },
    car: { type: String, required: true },
    cmlLead: { type: String, required: true },
    host: { type: String, required: true },
    description: { type: String, required: true },
    rules: { type: String, required: true },
    image: { type: String, required: false }
}, { timestamps: true });

module.exports = mongoose.model('Meet', meetSchema);
