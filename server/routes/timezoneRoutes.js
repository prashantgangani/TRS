const express = require('express');
const router = express.Router();
const Timezone = require('../models/Timezone');

// Get all timezones
router.get('/', async (req, res) => {
    try {
        const timezones = await Timezone.find();
        res.json(timezones);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Add a new timezone
router.post('/', async (req, res) => {
    const timezone = new Timezone(req.body);
    try {
        const newTimezone = await timezone.save();
        res.status(201).json(newTimezone);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Delete a timezone
router.delete('/:id', async (req, res) => {
    try {
        await Timezone.findByIdAndDelete(req.params.id);
        res.json({ message: 'Timezone deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
