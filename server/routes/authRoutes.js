const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');

// JWT Secret (should be in .env in production, using fallback for dev)
const JWT_SECRET = process.env.JWT_SECRET || 'trs_underground_secret_key_999!';

// 2. Login
router.post('/login', async (req, res) => {
    try {
        const { name, password } = req.body;
        const admin = await Admin.findOne({ name });
        if (!admin) return res.status(404).json({ message: 'Admin not found' });

        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

        const token = jwt.sign({ id: admin._id, role: admin.role, name: admin.name }, JWT_SECRET, { expiresIn: '7d' });
        
        res.json({ token, admin: { id: admin._id, name: admin.name, role: admin.role } });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Middleware to verify JWT token
const verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader) return res.status(403).json({ message: 'No token provided' });
    
    const token = authHeader.split(' ')[1]; // "Bearer <token>"
    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) return res.status(401).json({ message: 'Unauthorized' });
        req.user = decoded;
        next();
    });
};

// Middleware to require SuperAdmin role
const requireSuperAdmin = (req, res, next) => {
    if (req.user.role !== 'superadmin') {
        return res.status(403).json({ message: 'Require SuperAdmin Role' });
    }
    next();
};

// 3. SuperAdmin: Get all standard Admins & Smart Admins
router.get('/admins', [verifyToken, requireSuperAdmin], async (req, res) => {
    try {
        const admins = await Admin.find({ role: { $in: ['admin', 'smartadmin', 'passwordmanager'] } }).select('-password');
        res.json(admins);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// 4. SuperAdmin: Create a normal Admin or Smart Admin
router.post('/register-admin', [verifyToken, requireSuperAdmin], async (req, res) => {
    try {
        const { name, password, role } = req.body;
        
        const existingAdmin = await Admin.findOne({ name });
        if (existingAdmin) return res.status(400).json({ message: 'Name already in use' });

        const hashedPassword = await bcrypt.hash(password, 10);
        let adminRole = 'admin';
        if (role === 'smartadmin') adminRole = 'smartadmin';
        if (role === 'passwordmanager') adminRole = 'passwordmanager';

        const newAdmin = new Admin({ name, password: hashedPassword, role: adminRole });
        await newAdmin.save();

        res.status(201).json({ message: 'Admin created successfully', admin: { id: newAdmin._id, name: newAdmin.name, role: newAdmin.role } });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// 5. SuperAdmin: Delete a normal Admin
router.delete('/admins/:id', [verifyToken, requireSuperAdmin], async (req, res) => {
    try {
        await Admin.findByIdAndDelete(req.params.id);
        res.json({ message: 'Admin deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


module.exports = router;
