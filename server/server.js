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
const feedbackRoutes = require('./routes/feedbackRoutes');
const logRoutes = require('./routes/logRoutes');
const validCarRoutes = require('./routes/validCarRoutes');
const featuredCarRoutes = require('./routes/featuredCarRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
const allowedOrigins = [
    "http://localhost:5173",
    "http://localhost:5174",
    "http://localhost:3000",
    process.env.CLIENT_URL
].filter(Boolean); // Remove undefined/null values

app.use(cors({
    origin: (origin, callback) => {
        // Allow requests with no origin (like mobile apps or curl)
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) !== -1 || origin.includes('vercel.app') || origin.includes('onrender.com')) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true
}));
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

// Database Connection
console.log("Server starting...");
console.log("Environment:", process.env.NODE_ENV || 'development');

// Mongoose Config
mongoose.set('strictQuery', false);

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('Successfully connected to MongoDB Atlas!'))
    .catch((error) => {
        console.error('CRITICAL: MongoDB connection error:', error);
        // Don't exit process in development to allow for debugging
        if (process.env.NODE_ENV === 'production') process.exit(1);
    });

// Routes
app.use('/api/meets', meetRoutes);
app.use('/api/cars', carRoutes);
app.use('/api/members', memberRoutes);
app.use('/api/laws', lawRoutes);
app.use('/api/timezones', timezoneRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/hero', heroRoutes);
app.use('/api/feedbacks', feedbackRoutes);
app.use('/api/logs', logRoutes);
app.use('/api/valid-cars', validCarRoutes);
app.use('/api/featured-cars', featuredCarRoutes);

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
