const mongoose = require('mongoose');

const featuredCarSchema = new mongoose.Schema({
    carName: { type: String, required: true },
    builtBy: { type: String, required: true },
    image: { type: String, required: true },
    imagePublicId: { type: String, default: null },
    ownerMemberId: { type: mongoose.Schema.Types.ObjectId, ref: 'Member', default: null },
    order: { type: Number, default: 0 }
}, { timestamps: true });

featuredCarSchema.index({ order: 1, createdAt: -1 });
module.exports = mongoose.model('FeaturedCar', featuredCarSchema);
