import express from 'express';
import { protect, admin } from '../middleware/auth.js';
import { getUsers, deleteUser, getUserStats } from '../controllers/userController.js';

const router = express.Router();

// Admin routes
router.get('/', protect, admin, getUsers);
router.get('/stats', protect, admin, getUserStats);
router.delete('/:id', protect, admin, deleteUser);

export default router; 