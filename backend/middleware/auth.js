const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Authentication middleware
const auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '') || req.cookies.token;
        
        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'No token provided, authorization denied'
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.userId).select('-password');
        
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Token is not valid'
            });
        }

        req.user = decoded;
        req.userDoc = user;
        next();
    } catch (error) {
        console.error('Auth middleware error:', error);
        res.status(401).json({
            success: false,
            message: 'Token is not valid'
        });
    }
};

// Admin authorization middleware
const adminAuth = async (req, res, next) => {
    try {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: 'Authentication required'
            });
        }

        if (req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Admin access required'
            });
        }

        next();
    } catch (error) {
        console.error('Admin auth error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

// Pastor authorization middleware
const pastorAuth = async (req, res, next) => {
    try {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: 'Authentication required'
            });
        }

        if (!['admin', 'pastor'].includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: 'Pastor or admin access required'
            });
        }

        next();
    } catch (error) {
        console.error('Pastor auth error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

// Leader authorization middleware
const leaderAuth = async (req, res, next) => {
    try {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: 'Authentication required'
            });
        }

        if (!['admin', 'pastor', 'leader'].includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: 'Leadership access required'
            });
        }

        next();
    } catch (error) {
        console.error('Leader auth error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

module.exports = { auth, adminAuth, pastorAuth, leaderAuth };
