const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema({
    editHero: { type: Boolean, default: true },
    publishMeet: { type: Boolean, default: true },
    updateValidCars: { type: Boolean, default: true },
    manageGarage: { type: Boolean, default: true },
    manageShowroom: { type: Boolean, default: true },
    manageLaws: { type: Boolean, default: true },
    manageTimezones: { type: Boolean, default: true },
    managePreviousMeets: { type: Boolean, default: true },
    manageMasterLibrary: { type: Boolean, default: true },
    validCarsPdfUrl: { type: String, default: '' },
    memberLoginEnabled: { type: Boolean, default: false },
    allowAdminCarArrange: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Settings', settingsSchema);