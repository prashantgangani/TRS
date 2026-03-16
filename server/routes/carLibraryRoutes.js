const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const CarLibrary = require('../models/CarLibrary');
const ValidCar = require('../models/ValidCar');

// JWT Secret
const JWT_SECRET = process.env.JWT_SECRET || 'trs_underground_secret_key_999!';

// Middleware to verify JWT token
const verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader) return res.status(403).json({ message: 'No token provided' });
    
    const token = authHeader.split(' ')[1];
    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) return res.status(401).json({ message: 'Unauthorized' });
        req.user = decoded;
        next();
    });
};

// Middleware to check Admin or SuperAdmin role
const requireAdmin = (req, res, next) => {
    if (req.user.role !== 'admin' && req.user.role !== 'superadmin') {
        return res.status(403).json({ message: 'Require Admin or Superadmin Role' });
    }
    next();
};

const middlewares = [verifyToken, requireAdmin];

// 1. GET /api/car-library (List all master cars)
router.get('/', middlewares, async (req, res) => {
    try {
        const cars = await CarLibrary.find().sort({ createdAt: -1 }).lean();
        res.json(cars);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// 1.5 POST /api/car-library/import-from-valid
router.post('/import-from-valid', middlewares, async (req, res) => {
    try {
        const validCars = await ValidCar.find();
        let importedCount = 0;

        for (const vCar of validCars) {
            // Check if car already exists by name
            const exists = await CarLibrary.findOne({ name: vCar.carName });
            if (!exists) {
                const newLibraryCar = new CarLibrary({
                    name: vCar.carName,
                    imageUrl: vCar.imageUrl || '',
                    description: vCar.description || ''
                });
                await newLibraryCar.save();

                // Optionally, update the ValidCar with the new sourceLibraryId
                vCar.sourceLibraryId = newLibraryCar._id;
                await vCar.save();
                
                importedCount++;
            } else if (!vCar.sourceLibraryId) {
                // If it already exists but isn't linked, link it now
                vCar.sourceLibraryId = exists._id;
                await vCar.save();
            }
        }

        res.json({ message: `Successfully imported ${importedCount} cars to the library.` });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// 2. GET /api/car-library/:id
router.get('/:id', middlewares, async (req, res) => {
    try {
        const car = await CarLibrary.findById(req.params.id);
        if (!car) return res.status(404).json({ message: 'Library car not found' });
        res.json(car);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// 3. POST /api/car-library (Create a new master car)
router.post('/', middlewares, async (req, res) => {
    try {
        const { name, imageUrl, description } = req.body;
        if (!name || name.trim() === '') return res.status(400).json({ message: 'Name is required' });

        if (imageUrl && imageUrl.trim() !== '') {
            try {
                new URL(imageUrl);
            } catch (err) {
                return res.status(400).json({ message: 'Invalid Image URL' });
            }
        }

        const newCar = new CarLibrary({
            name: name.trim().substring(0, 100),
            imageUrl: imageUrl ? imageUrl.trim() : '',
            description: description ? description.trim().substring(0, 1000) : ''
        });
        
        await newCar.save();
        res.status(201).json(newCar);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// 4. PATCH /api/car-library/:id (Update a master car)
router.patch('/:id', middlewares, async (req, res) => {
    try {
        const { name, imageUrl, description } = req.body;
        const updatable = {};
        if (name !== undefined) {
            if (name.trim() === '') return res.status(400).json({ message: 'Name is required' });
            updatable.name = name.trim().substring(0, 100);
        }
        if (imageUrl !== undefined) {
            if (imageUrl.trim() !== '') {
                try {
                    new URL(imageUrl);
                } catch (err) {
                    return res.status(400).json({ message: 'Invalid Image URL' });
                }
            }
            updatable.imageUrl = imageUrl.trim();
        }
        if (description !== undefined) {
             updatable.description = description.trim().substring(0, 1000);
        }

        const updatedCar = await CarLibrary.findByIdAndUpdate(
            req.params.id,
            updatable,
            { new: true }
        );
        if (!updatedCar) return res.status(404).json({ message: 'Library car not found' });
        
        res.json(updatedCar);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// 5. DELETE /api/car-library/:id (Delete a master car)
router.delete('/:id', middlewares, async (req, res) => {
    try {
        const car = await CarLibrary.findByIdAndDelete(req.params.id);
        if (!car) return res.status(404).json({ message: 'Library car not found' });
        // NOTE: Deliberately not cascading deletion to ValidCars
        res.json({ message: 'Library car deleted Successfully. This action does not affect previously published valid/invalid records.' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// 6. POST /api/car-library/:id/add-to-valid
router.post('/:id/add-to-valid', middlewares, async (req, res) => {
    try {
        const libraryCar = await CarLibrary.findById(req.params.id);
        if (!libraryCar) return res.status(404).json({ message: 'Library car not found' });

        const newValidCar = new ValidCar({
            carName: libraryCar.name,
            imageUrl: libraryCar.imageUrl || '',
            description: libraryCar.description || '',
            isValid: true,
            sourceLibraryId: libraryCar._id
        });
        await newValidCar.save();
        res.status(201).json(newValidCar);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// 7. POST /api/car-library/:id/add-to-invalid
router.post('/:id/add-to-invalid', middlewares, async (req, res) => {
    try {
        const libraryCar = await CarLibrary.findById(req.params.id);
        if (!libraryCar) return res.status(404).json({ message: 'Library car not found' });

        const newInvalidCar = new ValidCar({
            carName: libraryCar.name,
            imageUrl: libraryCar.imageUrl || '',
            description: libraryCar.description || '',
            isValid: false,
            sourceLibraryId: libraryCar._id
        });
        await newInvalidCar.save();
        res.status(201).json(newInvalidCar);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

module.exports = router;
