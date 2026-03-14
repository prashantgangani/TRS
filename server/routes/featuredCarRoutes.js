const express = require('express');
const FeaturedCar = require('../models/FeaturedCar');
const router = express.Router();

// GET all featured cars
router.get('/', async (req, res) => {
    try {
        const cars = await FeaturedCar.find().sort({ order: 1, createdAt: -1 });
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
        
        await FeaturedCar.bulkWrite(bulkOps);
        res.json({ message: 'Order updated successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// PUT to shuffle cars 
router.put('/shuffle', async (req, res) => {
    try {
        const cars = await FeaturedCar.find({}, '_id');
        
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
        
        await FeaturedCar.bulkWrite(bulkOps);
        res.json({ message: 'Cars shuffled successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
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