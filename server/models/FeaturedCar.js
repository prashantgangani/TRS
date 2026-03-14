const mongoose = require('mongoose');

const featuredCarSchema = new mongoose.Schema({
    carName: { type: String, required: true },
    builtBy: { type: String, required: true },
    image: { type: String, required: true },
    ownerMemberId: { type: mongoose.Schema.Types.ObjectId, ref: 'Member', default: null },
    order: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('FeaturedCar', featuredCarSchema);