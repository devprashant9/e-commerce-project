import Category from '../models/Category.js';
import { ApiError } from '../utils/ApiError.js';

// @desc    Get all categories
// @route   GET /api/categories
// @access  Public
export const getCategories = async (req, res, next) => {
    try {
        const categories = await Category.find()
            .populate('productCount')
            .sort({ createdAt: -1 });
        res.json(categories);
    } catch (error) {
        console.error('Error in getCategories:', error);
        next(new ApiError(500, 'Error fetching categories'));
    }
};

// @desc    Get single category
// @route   GET /api/categories/:id
// @access  Public
export const getCategoryById = async (req, res, next) => {
    try {
        const category = await Category.findById(req.params.id)
            .populate('productCount');

        if (!category) {
            throw new ApiError(404, 'Category not found');
        }

        res.json(category);
    } catch (error) {
        console.error('Error in getCategoryById:', error);
        next(error instanceof ApiError ? error : new ApiError(500, 'Error fetching category'));
    }
};

// @desc    Create a category
// @route   POST /api/categories
// @access  Private/Admin
export const createCategory = async (req, res, next) => {
    try {
        const { name, description } = req.body;

        if (!name || !description) {
            throw new ApiError(400, 'Please provide name and description');
        }

        const categoryExists = await Category.findOne({ name: name.toLowerCase() });
        if (categoryExists) {
            throw new ApiError(400, 'Category already exists');
        }

        const category = await Category.create({
            name: name.toLowerCase(),
            description,
            createdBy: req.user._id
        });

        res.status(201).json(category);
    } catch (error) {
        console.error('Error in createCategory:', error);
        next(error instanceof ApiError ? error : new ApiError(500, 'Error creating category'));
    }
};

// @desc    Update a category
// @route   PUT /api/categories/:id
// @access  Private/Admin
export const updateCategory = async (req, res, next) => {
    try {
        const { name, description } = req.body;
        const category = await Category.findById(req.params.id);

        if (!category) {
            throw new ApiError(404, 'Category not found');
        }

        // Check if new name already exists (excluding current category)
        if (name && name !== category.name) {
            const categoryExists = await Category.findOne({
                _id: { $ne: category._id },
                name: name.toLowerCase()
            });
            if (categoryExists) {
                throw new ApiError(400, 'Category name already exists');
            }
        }

        category.name = name ? name.toLowerCase() : category.name;
        category.description = description || category.description;

        const updatedCategory = await category.save();
        res.json(updatedCategory);
    } catch (error) {
        console.error('Error in updateCategory:', error);
        next(error instanceof ApiError ? error : new ApiError(500, 'Error updating category'));
    }
};

// @desc    Delete a category
// @route   DELETE /api/categories/:id
// @access  Private/Admin
export const deleteCategory = async (req, res, next) => {
    try {
        const category = await Category.findById(req.params.id);

        if (!category) {
            throw new ApiError(404, 'Category not found');
        }

        // Check if category has products
        await category.populate('productCount');
        if (category.productCount > 0) {
            throw new ApiError(400, 'Cannot delete category with associated products');
        }

        await category.deleteOne();
        res.json({ message: 'Category removed' });
    } catch (error) {
        console.error('Error in deleteCategory:', error);
        next(error instanceof ApiError ? error : new ApiError(500, 'Error deleting category'));
    }
}; 