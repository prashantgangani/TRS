const mongoose = require('mongoose');

// Creating a single-document schema to store the dynamic content for the Hero section
const heroSchema = new mongoose.Schema({
    tonightsMeetTitle: {
        type: String,
        required: true,
        default: 'Weekly Showcase'
    },
    tonightsMeetLocation: {
        type: String,
        required: true,
        default: 'Los Santos Custom'
    },
    tonightsMeetTime: {
        type: String,
        required: true,
        default: '8:00 PM'
    },
    atmosphereImage: {
        type: String,
        required: true,
        default: 'https://images.unsplash.com/photo-1542282088-fe8426682b8f?auto=format&fit=crop&q=80&w=800'
    },
    meetImage: {
        type: String,
        required: true,
        default: 'https://images.unsplash.com/photo-1596489394602-0e427ed4caeb?auto=format&fit=crop&q=80&w=800'
    },
    featuredBuildImage: {
        type: String,
        required: true,
        default: 'https://images.unsplash.com/photo-1611821064430-0d40220e4b98?auto=format&fit=crop&q=80&w=1000'
    },
    featuredBuildName: {
        type: String,
        required: true,
        default: 'Midnight RX-7'
    },
    featuredBuildOwner: {
        type: String,
        required: true,
        default: 'GhostRider99'
    }
}, { timestamps: true });

module.exports = mongoose.model('Hero', heroSchema);
