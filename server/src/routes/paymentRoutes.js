import express from 'express';
import { protect } from '../middleware/auth.js';
import { createPayPalOrder, capturePayPalPayment } from '../controllers/paymentController.js';

const router = express.Router();

router.post('/create-paypal-order', protect, createPayPalOrder);
router.post('/capture-paypal-payment', protect, capturePayPalPayment);

export default router; 