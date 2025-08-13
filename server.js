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

// Connect to MongoDB (optional for testing)
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/nehemia-ministry', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => {
    console.log('✅ Connected to MongoDB');
})
.catch(err => {
    console.warn('⚠️  MongoDB not available, using mock data for testing');
});

// Import mock routes for testing
const mockAuthRoutes = require('./backend/routes/mockAuth');
const mockPrayerRoutes = require('./backend/routes/mockPrayers');
const mockDashboardRoutes = require('./backend/routes/mockDashboard');

// Use mock routes for testing
app.use('/api/auth', mockAuthRoutes);
app.use('/api/prayers', mockPrayerRoutes);
app.use('/api/dashboard', mockDashboardRoutes);

// Simple contact route
app.post('/api/contact', (req, res) => {
    console.log('Contact form submission:', req.body);
    res.json({ success: true, message: 'Thank you for your message!' });
});

// Simple events route
app.get('/api/events', (req, res) => {
    const mockDB = require('./backend/mockDatabase');
    res.json({ success: true, events: mockDB.events });
});

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
    console.log('\n🚀 Nehemia Ministry Server Started Successfully!');
    console.log('═══════════════════════════════════════════════');
    console.log(`📡 Server Port: ${PORT}`);
    console.log(`🌐 Website: http://localhost:${PORT}`);
    console.log(`📊 Admin Panel: http://localhost:${PORT}/admin`);
    console.log(`👤 Member Dashboard: http://localhost:${PORT}/dashboard`);
    console.log('═══════════════════════════════════════════════');
    console.log('🎯 Test Accounts:');
    console.log('   👑 Admin: admin@nehemiaministry.org / admin123');
    console.log('   👤 Member: member@test.com / member123');
    console.log('═══════════════════════════════════════════════\n');
});

module.exports = app;
