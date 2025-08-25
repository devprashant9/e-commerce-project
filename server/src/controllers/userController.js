import User from '../models/User.js';
import { ApiError } from '../utils/ApiError.js';

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
export const getUsers = async (req, res, next) => {
    try {
        const users = await User.find({}).select('-password');
        res.json(users);
    } catch (error) {
        next(new ApiError(500, 'Error fetching users'));
    }
};

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private/Admin
export const deleteUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            throw new ApiError(404, 'User not found');
        }

        // Prevent deletion of admin users
        if (user.role === 'admin') {
            throw new ApiError(400, 'Cannot delete admin users');
        }

        await user.deleteOne();
        res.json({ message: 'User removed' });
    } catch (error) {
        next(error);
    }
};

// @desc    Get user stats
// @route   GET /api/users/stats
// @access  Private/Admin
export const getUserStats = async (req, res, next) => {
    try {
        const totalUsers = await User.countDocuments({ role: 'user' });
        res.json({ totalUsers });
    } catch (error) {
        next(new ApiError(500, 'Error fetching user stats'));
    }
}; 