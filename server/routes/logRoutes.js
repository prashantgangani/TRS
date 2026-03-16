const express = require('express');
const router = express.Router();
const Log = require('../models/Log');

// POST a new log (Can be called by frontend when an admin does something)
router.post('/', async (req, res) => {
    try {
        const log = new Log({
            adminName: req.body.adminName || 'Unknown Admin',
            action: req.body.action,
            details: req.body.details
        });
        await log.save();
        res.status(201).json(log);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// GET all logs
router.get('/', async (req, res) => {
    try {
        const logs = await Log.find().sort({ createdAt: -1 }).limit(100).lean();
        res.json(logs);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// DELETE a specific log
router.delete('/:id', async (req, res) => {
    try {
        const log = await Log.findByIdAndDelete(req.params.id);
        if (!log) return res.status(404).json({ message: 'Log not found' });
        res.json({ message: 'Log deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// DELETE all logs (Clear logs)
router.delete('/', async (req, res) => {
    try {
        await Log.deleteMany({});
        res.json({ message: 'All logs cleared' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
