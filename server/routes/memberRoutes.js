const express = require('express');
const router = express.Router();
const Member = require('../models/Member');

// GET all members, sorted by order ascending
router.get('/', async (req, res) => {
    try {
        const members = await Member.find().sort({ order: 1, createdAt: 1 }).lean();
        res.json(members);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// POST a new member
router.post('/', async (req, res) => {
    try {
        // Find highest order to place new member at the end
        const highestMember = await Member.findOne().sort({ order: -1 });
        const nextOrder = highestMember ? highestMember.order + 1 : 0;

        const member = new Member({
            name: req.body.name,
            role: req.body.role,
            quote: req.body.quote || 'No quote provided.',
            image: req.body.image || 'https://images.unsplash.com/photo-1542362567-b07e54358753?w=800&auto=format&fit=crop',
            color: req.body.color || 'from-neon-purple to-purple-900',
            order: req.body.order !== undefined ? req.body.order : nextOrder
        });

        const newMember = await member.save();
        res.status(201).json(newMember);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// DELETE a member
router.delete('/:id', async (req, res) => {
    try {
        await Member.findByIdAndDelete(req.params.id);
        res.json({ message: 'Member deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// PUT to update a member (for reordering or editing details)
router.put('/:id', async (req, res) => {
    try {
        const updatedMember = await Member.findByIdAndUpdate(
            req.params.id, 
            req.body, 
            { new: true }
        );
        res.json(updatedMember);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

module.exports = router;
