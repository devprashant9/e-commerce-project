import express from 'express';
import { protect, admin } from '../middleware/authMiddleware.js';
import { getDashboardStats } from '../controllers/dashboardController.js';

const router = express.Router();

router.get('/stats', protect, admin, getDashboardStats);

export default router; 