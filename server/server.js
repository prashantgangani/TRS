require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const meetRoutes = require('./routes/meetRoutes');
const carRoutes = require('./routes/carRoutes');
const memberRoutes = require('./routes/memberRoutes');
const lawRoutes = require('./routes/lawRoutes');
const timezoneRoutes = require('./routes/timezoneRoutes');
const authRoutes = require('./routes/authRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors()); // Allow frontend to communicate
app.use(express.json()); // Parse JSON bodies

// Database Connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('Successfully connected to MongoDB Atlas!'))
    .catch((error) => console.error('MongoDB connection error:', error));

// Routes
app.use('/api/meets', meetRoutes);
app.use('/api/cars', carRoutes);
app.use('/api/members', memberRoutes);
app.use('/api/laws', lawRoutes);
app.use('/api/timezones', timezoneRoutes);
app.use('/api/auth', authRoutes);

// Base route for server testing
app.get('/', (req, res) => {
    res.send('TRS Underground API is running.');
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`);
});
