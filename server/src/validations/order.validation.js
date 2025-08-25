import { body } from 'express-validator';

export const createOrderValidation = [
    body('items')
        .isArray({ min: 1 }).withMessage('Order must contain at least one item'),

    body('items.*.product')
        .if(body('paymentMethod').equals('cod')) // Only required for COD
        .notEmpty().withMessage('Product ID is required')
        .isMongoId().withMessage('Invalid product ID'),

    body('items.*.name')
        .notEmpty().withMessage('Product name is required'),

    body('items.*.quantity')
        .isInt({ min: 1 }).withMessage('Quantity must be at least 1'),

    body('items.*.price')
        .isFloat({ min: 0 }).withMessage('Price must be a positive number'),

    body('items.*.image')
        .notEmpty().withMessage('Product image is required'),

    body('shippingAddress')
        .if(body('paymentMethod').equals('cod')) // For COD only
        .isObject().withMessage('Shipping address is required'),

    body('shippingAddress.fullName')
        .if(body('paymentMethod').equals('cod'))
        .notEmpty().withMessage('Full name is required'),

    body('shippingAddress.addressLine1')
        .if(body('paymentMethod').equals('cod'))
        .notEmpty().withMessage('Address line 1 is required'),

    body('shippingAddress.city')
        .if(body('paymentMethod').equals('cod'))
        .notEmpty().withMessage('City is required'),

    body('shippingAddress.state')
        .if(body('paymentMethod').equals('cod'))
        .notEmpty().withMessage('State is required'),

    body('shippingAddress.pincode')
        .if(body('paymentMethod').equals('cod'))
        .matches(/^[0-9]{6}$/).withMessage('Invalid pincode'),

    body('shippingAddress.phone')
        .if(body('paymentMethod').equals('cod'))
        .matches(/^[0-9]{10}$/).withMessage('Invalid phone number'),

    body('paymentMethod')
        .trim()
        .toLowerCase()
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