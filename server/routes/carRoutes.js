const express = require('express');
const Car = require('../models/Car');
const router = express.Router();

// GET all showroom cars
router.get('/', async (req, res) => {
    try {
        // Sort by order first, then by newest addition
        const cars = await Car.find().sort({ order: 1, createdAt: -1 });
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

// PUT to update cars order
router.put('/reorder', async (req, res) => {
    try {
        const { orderedIds } = req.body;
        if (!orderedIds || !Array.isArray(orderedIds)) {
            return res.status(400).json({ message: 'orderedIds array is required' });
        }
        
        const bulkOps = orderedIds.map((id, index) => ({
            updateOne: {
                filter: { _id: id },
                update: { order: index }
            }
        }));
        
        await Car.bulkWrite(bulkOps);
        res.json({ message: 'Order updated successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// PUT to shuffle cars (Super Admin only - role check should be in frontend/middleware, simple implementation here)
router.put('/shuffle', async (req, res) => {
    try {
        const cars = await Car.find({}, '_id');
        
        // Fisher-Yates shuffle
        for (let i = cars.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [cars[i], cars[j]] = [cars[j], cars[i]];
        }
        
        const bulkOps = cars.map((car, index) => ({
            updateOne: {
                filter: { _id: car._id },
                update: { order: index }
            }
        }));
        
        await Car.bulkWrite(bulkOps);
        res.json({ message: 'Cars shuffled successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
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
