import { Router } from 'express';
import { protect, admin } from '../middleware/auth.js';
import upload from '../middleware/uploadMiddleware.js';
import { validate } from '../middleware/validate.js';
import { createProductValidation, updateProductValidation } from '../validations/product.validation.js';
import {
    getProducts,
    getProduct,
    createProduct,
    updateProduct,
    deleteProduct
} from '../controllers/productController.js';

const router = Router();

// Public routes
router.get('/', getProducts);
router.get('/:id', getProduct);

// Protected admin routes
router.post('/',
    protect,
    admin,
    upload.single('image'),
    validate(createProductValidation),
    createProduct
);

router.put('/:id',
    protect,
    admin,
    upload.single('image'),
    validate(updateProductValidation),
    updateProduct
);

router.delete('/:id', protect, admin, deleteProduct);

export default router; 