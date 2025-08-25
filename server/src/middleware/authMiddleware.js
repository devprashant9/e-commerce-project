import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { ApiError } from '../utils/ApiError.js';

// Protect routes - Verify token and attach user to req object
export const protect = async (req, res, next) => {
    try {
        let token;

        // Get token from Authorization header
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }

        if (!token) {
            throw new ApiError(401, 'Not authorized, no token');
        }

        try {
            // Verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Get user from token
            const user = await User.findById(decoded.userId).select('-password');

            if (!user) {
                throw new ApiError(401, 'User not found');
            }

            req.user = user;
            next();
        } catch (error) {
            console.error('Token verification error:', error);
            throw new ApiError(401, 'Not authorized, token failed');
        }
    } catch (error) {
        next(error);
    }
};

// Admin middleware - Check if user is admin
export const admin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        next(new ApiError(403, 'Not authorized as an admin'));
    }
}; 