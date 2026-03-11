const express = require('express');
const router = express.Router();
const Law = require('../models/Law');

// Get all laws
router.get('/', async (req, res) => {
    try {
        const laws = await Law.find().sort({ order: 1 });
        res.json(laws);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Add a new law
router.post('/', async (req, res) => {
    const law = new Law(req.body);
    try {
        const newLaw = await law.save();
        res.status(201).json(newLaw);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Delete a law
router.delete('/:id', async (req, res) => {
    try {
        await Law.findByIdAndDelete(req.params.id);
        res.json({ message: 'Law deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
