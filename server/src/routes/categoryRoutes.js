import express from 'express';
import { protect, admin } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { createCategoryValidation, updateCategoryValidation } from '../validations/category.validation.js';
import {
    getCategories,
    getCategoryById,
    createCategory,
    updateCategory,
    deleteCategory
} from '../controllers/categoryController.js';

const router = express.Router();

// Public routes
router.get('/', getCategories);
router.get('/:id', getCategoryById);

// Protected admin routes
router.post('/',
    protect,
    admin,
    validate(createCategoryValidation),
    createCategory
);

router.put('/:id',
    protect,
    admin,
    validate(updateCategoryValidation),
    updateCategory
);

router.delete('/:id', protect, admin, deleteCategory);

export default router; 