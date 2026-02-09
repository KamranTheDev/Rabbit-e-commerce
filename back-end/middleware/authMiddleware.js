const jwt = require('jsonwebtoken');
const User = require('../models/User.js');

//middleware to protect routes
const protect = async (req, res, next) => {
    let token;
    if (
        req.headers.authorization &&
         req.headers.authorization.startsWith('Bearer')
    ) {
        try {
            // Get token from header
            token = req.headers.authorization.split(' ')[1];
            // Decode token and get user id
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = await User.findById(decoded.user.id).select('-password'); // Exclude password from user object
            next();
        } catch (error) {
            console.error("Token varification failed", error);
            return res.status(403).json({ message: 'Not authorized, token failed' });
        }
    }
    else {
        return res.status(401).json({ message: 'Not authorized, no token' });
    }
};
// Middleware to check if user is admin
const admin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(403).json({ message: 'Not authorized as an admin' });
    }
};

module.exports = { protect, admin };
// This middleware checks if the user is authenticated and has the admin role.

