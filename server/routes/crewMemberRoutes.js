const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const CrewMember = require('../models/CrewMember');
const FeaturedCar = require('../models/FeaturedCar');
const Settings = require('../models/Settings');

const JWT_SECRET = process.env.JWT_SECRET || 'trs_underground_secret_key_999!';

// --- MIDDLEWARES ---
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

const requireSuperAdmin = (req, res, next) => {
    if (req.user.role !== 'superadmin') {
        return res.status(403).json({ message: 'Require SuperAdmin Role' });
    }
    next();
};

const requireSuperAdminOrPasswordManager = (req, res, next) => {
    if (req.user.role !== 'superadmin' && req.user.role !== 'passwordmanager') {
        return res.status(403).json({ message: 'Require SuperAdmin or PasswordManager Role' });
    }
    next();
};

const requireMember = (req, res, next) => {
    if (req.user.role !== 'member') {
        return res.status(403).json({ message: 'Require Member Role' });
    }
    next();
};

const checkMemberLoginEnabled = async (req, res, next) => {
    try {
        const settings = await Settings.findOne();
        if (!settings || !settings.memberLoginEnabled) {
            return res.status(403).json({ message: 'Member garage updates are currently closed.' });
        }
        next();
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// --- MEMBER AUTH APIs ---
router.post('/login', checkMemberLoginEnabled, async (req, res) => {
    try {
        const { username, password } = req.body;
        const member = await CrewMember.findOne({ username });
        if (!member || !member.isActive) return res.status(404).json({ message: 'Member not found or inactive' });

        const isMatch = await bcrypt.compare(password, member.password);
        if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

        const token = jwt.sign({ id: member._id, role: 'member', username: member.username }, JWT_SECRET, { expiresIn: '7d' });
        res.json({ token, member: { id: member._id, username: member.username, role: 'member' } });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Member Self-Service APIs
router.get('/garage/me', [verifyToken, requireMember, checkMemberLoginEnabled], async (req, res) => {
    try {
        const garageCard = await FeaturedCar.findOne({ ownerMemberId: req.user.id });
        if (!garageCard) {
            return res.status(404).json({ message: 'Garage card not found' });
        }
        res.json(garageCard);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.patch('/garage/me', [verifyToken, requireMember, checkMemberLoginEnabled], async (req, res) => {
    try {
        const { carName, imageUrl } = req.body;
        
        // Find existing to verify ownership
        const garageCard = await FeaturedCar.findOne({ ownerMemberId: req.user.id });
        if (!garageCard) {
            return res.status(404).json({ message: 'Garage card not found' });
        }

        // Validate fields
        if (carName?.trim() === '') return res.status(400).json({ message: 'Car name is required' });
        if (imageUrl?.trim() === '') return res.status(400).json({ message: 'Image URL is required' });

        // Update allowed fields only
        if (carName) garageCard.carName = carName;
        if (imageUrl) garageCard.image = imageUrl;

        const updatedCard = await garageCard.save();
        res.json(updatedCard);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// --- SUPERADMIN APIs ---
router.post('/superadmin/members', [verifyToken, requireSuperAdmin], async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ message: 'Username and password are required' });
        }

        const existingMember = await CrewMember.findOne({ username });
        if (existingMember) return res.status(400).json({ message: 'Username already exists' });

        const hashedPassword = await bcrypt.hash(password, 10);
        
        const newMember = new CrewMember({
            username: username.trim(),
            password: hashedPassword
        });
        
        await newMember.save();

        // Auto-create garage card
        const defaultImage = 'https://images.unsplash.com/photo-1544829099-b9a0c07fad1a?w=1920&q=80&auto=format&fit=crop';
        const newGarageCard = new FeaturedCar({
            carName: newMember.username,
            builtBy: newMember.username,
            image: defaultImage,
            ownerMemberId: newMember._id
        });
        await newGarageCard.save();

        res.status(201).json({ 
            message: 'Member and Garage Card created successfully', 
            member: { id: newMember._id, username: newMember.username }
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.get('/superadmin/members', [verifyToken, requireSuperAdminOrPasswordManager], async (req, res) => {
    try {
        const members = await CrewMember.find().select('-password');
        res.json(members);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.delete('/superadmin/members/:id', [verifyToken, requireSuperAdmin], async (req, res) => {
    try {
        const memberId = req.params.id;
        await CrewMember.findByIdAndDelete(memberId);
        // By default, preserve the garage card as asked "preserve garage card unless explicitly deleted by superadmin"
        // But maybe clear the ownerMemberId so it becomes a standard card? 
        // We will leave ownerMemberId pointing to deleted member.
        res.json({ message: 'Member deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.patch('/superadmin/members/:id/reset-password', [verifyToken, requireSuperAdminOrPasswordManager], async (req, res) => {
    try {
        const { password } = req.body;
        if (!password) return res.status(400).json({ message: 'Password is required' });

        const hashedPassword = await bcrypt.hash(password, 10);
        await CrewMember.findByIdAndUpdate(req.params.id, { password: hashedPassword });
        
        res.json({ message: 'Password reset successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;