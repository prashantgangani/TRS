const express = require('express');
const router = express.Router();
const Hero = require('../models/Hero');

// @route   GET /api/hero
// @desc    Get the Hero content document (creates default if it doesn't exist)
router.get('/', async (req, res) => {
    try {
        let hero = await Hero.findOne();
        
        // If no document exists yet, create the default one
        if (!hero) {
            hero = await Hero.create({});
        }

        res.json(hero);
    } catch (error) {
        console.error("Error fetching Hero data:", error);
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   PUT /api/hero
// @desc    Update the Hero content document (creates if doesn't exist)
router.put('/', async (req, res) => {
    try {
        const updateData = {
            tonightsMeetTitle: req.body.tonightsMeetTitle,
            tonightsMeetLocation: req.body.tonightsMeetLocation,
            tonightsMeetTime: req.body.tonightsMeetTime,
            atmosphereImage: req.body.atmosphereImage,
            meetImage: req.body.meetImage,
            featuredBuildImage: req.body.featuredBuildImage,
            featuredBuildName: req.body.featuredBuildName,
            featuredBuildOwner: req.body.featuredBuildOwner
        };

        // Remove undefined fields to avoid overwriting with null/undefined
        Object.keys(updateData).forEach(key => updateData[key] === undefined && delete updateData[key]);

        const hero = await Hero.findOneAndUpdate(
            {}, // Find first document
            updateData,
            { new: true, upsert: true, setDefaultsOnInsert: true }
        );

        res.json(hero);
    } catch (error) {
        console.error("Error updating Hero data:", error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
