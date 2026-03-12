const mongoose = require('mongoose');

const featuredCarSchema = new mongoose.Schema({
    carName: { type: String, required: true },
    builtBy: { type: String, required: true },
    image: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('FeaturedCar', featuredCarSchema);