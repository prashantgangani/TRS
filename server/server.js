require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');

const meetRoutes = require('./routes/meetRoutes');
const carRoutes = require('./routes/carRoutes');
const memberRoutes = require('./routes/memberRoutes');
const lawRoutes = require('./routes/lawRoutes');
const timezoneRoutes = require('./routes/timezoneRoutes');
const authRoutes = require('./routes/authRoutes');
const heroRoutes = require('./routes/heroRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(helmet()); // Security headers
app.use(cors({
    origin: [
        "http://localhost:5173",
        process.env.CLIENT_URL
    ],
    credentials: true
}));
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

// Database Connection
console.log("Server starting...");
console.log("Environment:", process.env.NODE_ENV || 'development');

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('Successfully connected to MongoDB Atlas!'))
    .catch((error) => {
        console.error('CRITICAL: MongoDB connection error:', error);
        process.exit(1); // Exit if DB connection fails in production
    });

// Routes
app.use('/api/meets', meetRoutes);
app.use('/api/cars', carRoutes);
app.use('/api/members', memberRoutes);
app.use('/api/laws', lawRoutes);
app.use('/api/timezones', timezoneRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/hero', heroRoutes);

// Health Check Routes
app.get('/', (req, res) => {
    res.send('TRS Underground API is running successfully.');
});

app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'ok', 
        timestamp: new Date().toISOString(),
        env: process.env.NODE_ENV || 'development'
    });
});

// Global Error Handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        message: "Internal Server Error",
        error: process.env.NODE_ENV === 'development' ? err.message : {}
    });
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`);
});
