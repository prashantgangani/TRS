const express = require('express');
const PreviousMeet = require('../models/PreviousMeet');
const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const { limit } = req.query;
        let query = PreviousMeet.find().sort({ order: 1, createdAt: -1 }).lean();
        if (limit) {
            query = query.limit(parseInt(limit, 10));
        }
        const meets = await query;        
        res.json(meets);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.post('/', async (req, res) => {
    const urls = req.body.imageUrls || [];
    const mainUrl = req.body.imageUrl || (urls.length > 0 ? urls[0] : 'https://images.unsplash.com/photo-1542282088-fe8426682b8f?auto=format&fit=crop&q=80&w=1000');
    
    try {
        // Calculate max order to append at the bottom
        const count = await PreviousMeet.countDocuments();

        const meet = new PreviousMeet({
            themeName: req.body.themeName,
            imageUrl: mainUrl,
            imageUrls: urls,
            order: count
        });

        const newMeet = await meet.save();
        res.status(201).json(newMeet);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

router.put('/reorder', async (req, res) => {
    try {
        const { items } = req.body;
        if (Array.isArray(items)) {
            for (let item of items) {
                await PreviousMeet.findByIdAndUpdate(item.id, { order: item.order });
            }
        }
        res.json({ message: 'Reordered successfully' });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

router.put('/:id', async (req, res) => {
    try {
        const updates = { ...req.body };
        if (updates.imageUrls && updates.imageUrls.length > 0) {
            updates.imageUrl = updates.imageUrls[0];
        }
        const updatedMeet = await PreviousMeet.findByIdAndUpdate(req.params.id, updates, { new: true });
        res.json(updatedMeet);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        await PreviousMeet.findByIdAndDelete(req.params.id);
        res.json({ message: 'Deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;

