const mongoose = require('mongoose');

const timezoneSchema = new mongoose.Schema({
    region: { type: String, required: true },
    time: { type: String, required: true },
    day: { type: String, required: true },
    offset: { type: String, required: true }
});

module.exports = mongoose.model('Timezone', timezoneSchema);
