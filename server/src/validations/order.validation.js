import { body } from 'express-validator';

export const createOrderValidation = [
    body('items')
        .isArray({ min: 1 }).withMessage('Order must contain at least one item')
        .custom((items) => {
            return items.every(item =>
                item.product &&
                item.quantity &&
                item.quantity > 0 &&
                item.price &&
                item.price >= 0
            );
        }).withMessage('Invalid items in order'),

    body('items.*.product')
        .notEmpty().withMessage('Product ID is required')
        .isMongoId().withMessage('Invalid product ID'),

    body('items.*.quantity')
        .isInt({ min: 1 }).withMessage('Quantity must be at least 1'),

    body('items.*.price')
        .isFloat({ min: 0 }).withMessage('Price must be a positive number'),

    body('shippingAddress')
        .isObject().withMessage('Shipping address is required'),

    body('shippingAddress.fullName')
        .trim()
        .notEmpty().withMessage('Full name is required')
        .isLength({ min: 2, max: 100 }).withMessage('Full name must be between 2 and 100 characters'),

    body('shippingAddress.addressLine1')
        .trim()
        .notEmpty().withMessage('Address line 1 is required'),

    body('shippingAddress.city')
        .trim()
        .notEmpty().withMessage('City is required'),

    body('shippingAddress.state')
        .trim()
        .notEmpty().withMessage('State is required'),

    body('shippingAddress.pincode')
        .trim()
        .notEmpty().withMessage('Pincode is required')
        .matches(/^[0-9]{6}$/).withMessage('Invalid pincode'),

    body('shippingAddress.phone')
        .trim()
        .notEmpty().withMessage('Phone number is required')
        .matches(/^[0-9]{10}$/).withMessage('Invalid phone number'),

    body('paymentMethod')
        .trim()
        .notEmpty().withMessage('Payment method is required')
        .isIn(['cod', 'paypal']).withMessage('Invalid payment method'),

    body('totalAmount')
        .isFloat({ min: 0 }).withMessage('Total amount must be a positive number')
];

export const updateOrderStatusValidation = [
    body('status')
        .trim()
        .notEmpty().withMessage('Status is required')
        .isIn(['pending', 'processing', 'shipped', 'delivered', 'cancelled'])
        .withMessage('Invalid order status')
]; 