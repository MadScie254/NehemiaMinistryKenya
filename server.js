const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const cookieParser = require('cookie-parser');
const path = require('path');
require('dotenv').config();

const app = express();

// Security middleware
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com", "https://cdnjs.cloudflare.com"],
            fontSrc: ["'self'", "https://fonts.gstatic.com", "https://cdnjs.cloudflare.com"],
            scriptSrc: ["'self'", "'unsafe-inline'", "https://translate.google.com", "https://translate.googleapis.com", "https://generativelanguage.googleapis.com"],
            imgSrc: ["'self'", "data:", "https:", "blob:"],
            connectSrc: ["'self'", "https://generativelanguage.googleapis.com", "https://translate.googleapis.com"],
            frameSrc: ["'self'", "https://translate.google.com"],
        },
    },
}));

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again later.'
});
app.use('/api/', limiter);

// CORS configuration
app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:3001',
    credentials: true
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// Serve static files
app.use(express.static(path.join(__dirname)));
app.use('/assets', express.static(path.join(__dirname, 'assets')));

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/nehemia-ministry', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));

// Import routes
const authRoutes = require('./backend/routes/auth');
const userRoutes = require('./backend/routes/users');
const contentRoutes = require('./backend/routes/content');
const prayerRoutes = require('./backend/routes/prayers');
const eventRoutes = require('./backend/routes/events');
const sermonRoutes = require('./backend/routes/sermons');
const donationRoutes = require('./backend/routes/donations');
const blogRoutes = require('./backend/routes/blog');
const contactRoutes = require('./backend/routes/contact');
const dashboardRoutes = require('./backend/routes/dashboard');

// Use routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/content', contentRoutes);
app.use('/api/prayers', prayerRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/sermons', sermonRoutes);
app.use('/api/donations', donationRoutes);
app.use('/api/blog', blogRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/dashboard', dashboardRoutes);

// Serve HTML pages
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, 'admin', 'index.html'));
});

app.get('/dashboard', (req, res) => {
    res.sendFile(path.join(__dirname, 'dashboard', 'index.html'));
});

// Handle SPA routing for admin and dashboard
app.get('/admin/*', (req, res) => {
    res.sendFile(path.join(__dirname, 'admin', 'index.html'));
});

app.get('/dashboard/*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dashboard', 'index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ 
        success: false, 
        message: 'Something went wrong!',
        error: process.env.NODE_ENV === 'development' ? err.message : {}
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ 
        success: false, 
        message: 'Route not found' 
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Nehemia Ministry Server running on port ${PORT}`);
    console.log(`🌐 Website: http://localhost:${PORT}`);
    console.log(`📊 Admin: http://localhost:${PORT}/admin`);
    console.log(`👤 Dashboard: http://localhost:${PORT}/dashboard`);
});

module.exports = app;
