const express = require('express');
const router = express.Router();
const Feedback = require('../models/Feedback');

// POST a new feedback
router.post('/', async (req, res) => {
    try {
        const ipAddress = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
        
        // Calculate the beginning of the current day
        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);

        // Count feedbacks submitted by this IP today
        const feedbackCount = await Feedback.countDocuments({
            ipAddress: ipAddress,
            createdAt: { $gte: startOfDay }
        });

        if (feedbackCount >= 3) {
            return res.status(429).json({ message: 'Rate limit exceeded: You can only submit 3 feedbacks per day.' });
        }

        const feedback = new Feedback({ 
            text: req.body.text,
            ipAddress: ipAddress
        });
        await feedback.save();
        res.status(201).json(feedback);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// GET all feedbacks
router.get('/', async (req, res) => {
    try {
        const feedbacks = await Feedback.find().sort({ createdAt: -1 });
        res.json(feedbacks);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// PUT (mark as reviewed)
router.put('/:id/review', async (req, res) => {
    try {
        const feedback = await Feedback.findByIdAndUpdate(
            req.params.id, 
            { reviewed: true },
            { new: true }
        );
        if (!feedback) return res.status(404).json({ message: 'Feedback not found' });
        res.json(feedback);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// DELETE a feedback
router.delete('/:id', async (req, res) => {
    try {
        const feedback = await Feedback.findByIdAndDelete(req.params.id);
        if (!feedback) return res.status(404).json({ message: 'Feedback not found' });
        res.json({ message: 'Feedback deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
