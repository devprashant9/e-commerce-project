import express from 'express';
import { protect, admin } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { createOrderValidation, updateOrderStatusValidation } from '../validations/order.validation.js';
import {
    createOrder,
    getUserOrders,
    getAllOrders,
    updateOrderStatus
} from '../controllers/orderController.js';

const router = express.Router();

// User routes
router.post('/',
    protect,
    validate(createOrderValidation),
    createOrder
);

router.get('/myorders', protect, getUserOrders);

// Admin routes
router.get('/admin', protect, admin, getAllOrders);

router.put('/:id/status',
    protect,
    admin,
    validate(updateOrderStatusValidation),
    updateOrderStatus
);

export default router;

