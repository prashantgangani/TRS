const express = require('express');
const Meet = require('../models/Meet');
const router = express.Router();

// GET all upcoming meets
router.get('/', async (req, res) => {
    try {
        // Sort by date so upcoming are first
        const { limit } = req.query;
        let query = Meet.find().sort({ date: 1 }).lean();
        if (limit) {
            query = query.limit(parseInt(limit, 10));
        }
        const meets = await query;
        res.json(meets);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// POST a new meet
router.post('/', async (req, res) => {
    const meet = new Meet({
        theme: req.body.theme,
        date: req.body.date,
        time: req.body.time,
        location: req.body.location,
        dressCode: req.body.dressCode,
        car: req.body.car,
        cmlLead: req.body.cmlLead,
        host: req.body.host,
        description: req.body.description,
        rules: req.body.rules,
        image: req.body.image || 'https://images.unsplash.com/photo-1511407397940-d57f68e81203?w=800&auto=format&fit=crop'
    });

    try {
        const newMeet = await meet.save();
        res.status(201).json(newMeet);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// DELETE a meet
router.delete('/:id', async (req, res) => {
    try {
        await Meet.findByIdAndDelete(req.params.id);
        res.json({ message: 'Meet deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// PUT to update a meet
router.put('/:id', async (req, res) => {
    try {
        const updatedMeet = await Meet.findByIdAndUpdate(
            req.params.id, 
            req.body, 
            { new: true }
        );
        res.json(updatedMeet);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

module.exports = router;

