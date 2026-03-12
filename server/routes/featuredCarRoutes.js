const express = require('express');
const FeaturedCar = require('../models/FeaturedCar');
const router = express.Router();

// GET all featured cars
router.get('/', async (req, res) => {
    try {
        const cars = await FeaturedCar.find().sort({ createdAt: -1 });
        res.json(cars);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// POST a new featured car
router.post('/', async (req, res) => {
    const car = new FeaturedCar({
        carName: req.body.carName,
        builtBy: req.body.builtBy,
        image: req.body.image
    });

    try {
        const newCar = await car.save();
        res.status(201).json(newCar);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// DELETE a featured car
router.delete('/:id', async (req, res) => {
    try {
        await FeaturedCar.findByIdAndDelete(req.params.id);
        res.json({ message: 'Featured car deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// PUT to update a featured car
router.put('/:id', async (req, res) => {
    try {
        const updatedCar = await FeaturedCar.findByIdAndUpdate(
            req.params.id, 
            req.body, 
            { new: true }
        );
        res.json(updatedCar);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

module.exports = router;