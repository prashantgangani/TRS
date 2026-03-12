const express = require('express');
const router = express.Router();
const ValidCar = require('../models/ValidCar');

// Get all
router.get('/', async (req, res) => {
    try {
        const cars = await ValidCar.find();
        res.json(cars);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Add new
router.post('/', async (req, res) => {
    const { carName, description, imageUrl, isValid } = req.body;
    try {
        const newCar = new ValidCar({ carName, description, imageUrl, isValid });
        await newCar.save();
        res.status(201).json(newCar);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Update
router.put('/:id', async (req, res) => {
    try {
        const updatedCar = await ValidCar.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updatedCar);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Delete
router.delete('/:id', async (req, res) => {
    try {
        await ValidCar.findByIdAndDelete(req.params.id);
        res.json({ message: 'Deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
