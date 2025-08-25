import { body } from 'express-validator';

export const createCategoryValidation = [
    body('name')
        .trim()
        .notEmpty().withMessage('Category name is required')
        .isLength({ min: 2, max: 50 }).withMessage('Category name must be between 2 and 50 characters'),

    body('description')
        .trim()
        .notEmpty().withMessage('Description is required')
        .isLength({ min: 10, max: 500 }).withMessage('Description must be between 10 and 500 characters')
];

export const updateCategoryValidation = [
    body('name')
        .optional()
        .trim()
        .isLength({ min: 2, max: 50 }).withMessage('Category name must be between 2 and 50 characters'),

    body('description')
        .optional()
        .trim()
        .isLength({ min: 10, max: 500 }).withMessage('Description must be between 10 and 500 characters')
]; 