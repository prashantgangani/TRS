const express = require('express');
const Car = require('../models/Car');
const router = express.Router();

// GET all showroom cars
router.get('/', async (req, res) => {
    try {
        // Sort by newest addition first
        const cars = await Car.find().sort({ createdAt: -1 });
        res.json(cars);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// POST a new showroom car
router.post('/', async (req, res) => {
    const car = new Car({
        meetTheme: req.body.meetTheme,
        carName: req.body.carName,
        carOwner: req.body.carOwner,
        description: req.body.description,
        image: req.body.image
    });

    try {
        const newCar = await car.save();
        res.status(201).json(newCar);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// DELETE a showroom car
router.delete('/:id', async (req, res) => {
    try {
        await Car.findByIdAndDelete(req.params.id);
        res.json({ message: 'Car deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// PUT to update a showroom car
router.put('/:id', async (req, res) => {
    try {
        const updatedCar = await Car.findByIdAndUpdate(
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
