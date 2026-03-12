const mongoose = require('mongoose');

const validCarSchema = new mongoose.Schema({
    carName: { type: String, required: true },
    description: { type: String, required: true },
    imageUrl: { type: String, required: false },
    isValid: { type: Boolean, required: true }
});

module.exports = mongoose.model('ValidCar', validCarSchema);
