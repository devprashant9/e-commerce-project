import { body } from 'express-validator';

export const createProductValidation = [
    body('name')
        .trim()
        .notEmpty().withMessage('Product name is required')
        .isLength({ min: 3, max: 100 }).withMessage('Product name must be between 3 and 100 characters'),

    body('description')
        .trim()
        .notEmpty().withMessage('Description is required')
        .isLength({ min: 10, max: 1000 }).withMessage('Description must be between 10 and 1000 characters'),

    body('price')
        .notEmpty().withMessage('Price is required')
        .isFloat({ min: 0 }).withMessage('Price must be a positive number'),

    body('category')
        .notEmpty().withMessage('Category is required')
        .isMongoId().withMessage('Invalid category ID'),

    body('stock')
        .notEmpty().withMessage('Stock quantity is required')
        .isInt({ min: 0 }).withMessage('Stock must be a non-negative integer'),

    body('unit')
        .notEmpty().withMessage('Unit is required')
        .isIn(['kg', 'g', 'l', 'ml', 'piece', 'pack']).withMessage('Invalid unit'),

    body('discount')
        .optional()
        .isFloat({ min: 0, max: 100 }).withMessage('Discount must be between 0 and 100')
];

export const updateProductValidation = [
    body('name')
        .optional()
        .trim()
        .isLength({ min: 3, max: 100 }).withMessage('Product name must be between 3 and 100 characters'),

    body('description')
        .optional()
        .trim()
        .isLength({ min: 10, max: 1000 }).withMessage('Description must be between 10 and 1000 characters'),

    body('price')
        .optional()
        .isFloat({ min: 0 }).withMessage('Price must be a positive number'),

    body('category')
        .optional()
        .isMongoId().withMessage('Invalid category ID'),

    body('stock')
        .optional()
        .isInt({ min: 0 }).withMessage('Stock must be a non-negative integer'),

    body('unit')
        .optional()
        .isIn(['kg', 'g', 'l', 'ml', 'piece', 'pack']).withMessage('Invalid unit'),

    body('discount')
        .optional()
        .isFloat({ min: 0, max: 100 }).withMessage('Discount must be between 0 and 100')
]; 