const express = require('express');
const Settings = require('../models/Settings');
const router = express.Router();

router.get('/', async (req, res) => {
    try {
        let settings = await Settings.findOne();
        if (!settings) {
            settings = await Settings.create({});
        }
        res.json(settings);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.put('/', async (req, res) => {
    try {
        let settings = await Settings.findOne();
        if (!settings) {
            settings = new Settings(req.body);
            await settings.save();
        } else {
            settings = await Settings.findOneAndUpdate({}, req.body, { new: true });
        }
        res.json(settings);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

module.exports = router;