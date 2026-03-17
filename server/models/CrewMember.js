const mongoose = require('mongoose');

const crewMemberSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true, trim: true },
    password: { type: String, required: true },
    isActive: { type: Boolean, default: true },
    usedPushUpdates: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('CrewMember', crewMemberSchema);