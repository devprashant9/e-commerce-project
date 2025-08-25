import Product from '../models/Product.js';
import Category from '../models/Category.js';
import { uploadToCloudinary, deleteFromCloudinary } from '../utils/cloudinaryUpload.js';
import fs from 'fs/promises';
import { ApiError } from '../utils/ApiError.js';
import path from 'path';

// Get all products with filtering
export const getProducts = async (req, res) => {
    try {
        const { page = 1, limit = 10, sort = '-createdAt', search = '', category = '' } = req.query;
        const query = {};

        if (search) {
            query.name = { $regex: search, $options: 'i' };
        }

        if (category) {
            const categoryDoc = await Category.findOne({
                name: { $regex: new RegExp(category, 'i') }
            });

            if (categoryDoc) {
                query.category = categoryDoc._id;
            }
        }

        const total = await Product.countDocuments(query);
        const products = await Product.find(query)
            .sort(sort)
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .populate('category');

        const response = {
            products,
            totalPages: Math.ceil(total / limit),
            currentPage: page,
            total
        };

        res.json(response);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get single product
export const getProduct = async (req, res, next) => {
    try {
        const product = await Product.findOne({
            $or: [
                { _id: req.params.id },
                { slug: req.params.id }
            ],
            isActive: true
        }).populate({
            path: 'category',
            select: 'name slug',
            options: { lean: true }
        }).lean();

        if (!product) {
            throw new ApiError(404, 'Product not found');
        }

        // Ensure consistent category handling
        product.category = product.category || { _id: null, name: 'Uncategorized', slug: 'uncategorized' };

        res.json(product);
    } catch (error) {
        if (error instanceof ApiError) {
            next(error);
        } else {
            next(new ApiError(500, 'Error fetching product'));
        }
    }
};

// Create product
export const createProduct = async (req, res, next) => {
    try {
        const { name, description, price, category, stock, unit } = req.body;

        // Validate category exists if provided
        if (category) {
            const categoryExists = await Category.findById(category);
            if (!categoryExists) {
                throw new ApiError(400, 'Invalid category');
            }
        }

        if (!req.file) {
            throw new ApiError(400, 'Please upload an image');
        }

    

        // Upload to Cloudinary
        const cloudinaryResult = await uploadToCloudinary(req.file);
        

        // Delete the local file after upload
        try {
           
            await fs.access(req.file.path);  // Check if file exists
            await fs.unlink(req.file.path);
            
        } catch (error) {
            console.error('Error deleting file:', {
                path: req.file.path,
                error: error.message
            });
        }

        const product = await Product.create({
            name,
            description,
            price,
            category,
            stock,
            unit,
            image: cloudinaryResult.url,
            cloudinaryId: cloudinaryResult.public_id,
            createdBy: req.user._id
        });

        // Populate category and convert to plain object
        await product.populate({
            path: 'category',
            select: 'name slug'
        });

        const plainProduct = product.toObject();
        plainProduct.category = plainProduct.category || {
            _id: null,
            name: 'Uncategorized',
            slug: 'uncategorized'
        };

        res.status(201).json(plainProduct);
    } catch (error) {
        // Clean up uploaded file if exists
        if (req.file) {
            await fs.unlink(req.file.path).catch(console.error);
        }

        if (error instanceof ApiError) {
            next(error);
        } else {
            next(new ApiError(500, 'Error creating product'));
        }
    }
};

// Update product
export const updateProduct = async (req, res, next) => {
    try {
        const { name, description, price, category, stock, unit } = req.body;

        let product = await Product.findById(req.params.id);
        if (!product) {
            throw new ApiError(404, 'Product not found');
        }

        // Validate category exists if being updated
        if (category) {
            const categoryExists = await Category.findById(category);
            if (!categoryExists) {
                throw new ApiError(400, 'Invalid category');
            }
        }

        let imageUrl = product.image;
        let cloudinaryId = product.cloudinaryId;

        // Handle image upload if new image is provided
        if (req.file) {
            // Delete old image from Cloudinary
            await deleteFromCloudinary(product.cloudinaryId);

            // Upload new image
            const cloudinaryResult = await uploadToCloudinary(req.file);
            imageUrl = cloudinaryResult.url;
            cloudinaryId = cloudinaryResult.public_id;

            // Delete the local file
            await fs.unlink(req.file.path);
        }

        product = await Product.findByIdAndUpdate(
            req.params.id,
            {
                name: name || product.name,
                description: description || product.description,
                price: price || product.price,
                category: category || product.category,
                stock: stock || product.stock,
                unit: unit || product.unit,
                image: imageUrl,
                cloudinaryId
            },
            {
                new: true,
                runValidators: true
            }
        ).populate({
            path: 'category',
            select: 'name slug'
        });

        const plainProduct = product.toObject();
        plainProduct.category = plainProduct.category || {
            _id: null,
            name: 'Uncategorized',
            slug: 'uncategorized'
        };

        res.json(plainProduct);
    } catch (error) {
        // Clean up uploaded file if exists
        if (req.file) {
            await fs.unlink(req.file.path).catch(console.error);
        }

        if (error instanceof ApiError) {
            next(error);
        } else {
            next(new ApiError(500, 'Error updating product'));
        }
    }
};

// Delete product
export const deleteProduct = async (req, res, next) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            throw new ApiError(404, 'Product not found');
        }

        // Delete image from Cloudinary
        if (product.cloudinaryId) {
            await deleteFromCloudinary(product.cloudinaryId);
        }

        await product.deleteOne();
        res.json({ message: 'Product removed successfully' });
    } catch (error) {
        if (error instanceof ApiError) {
            next(error);
        } else {
            next(new ApiError(500, 'Error deleting product'));
        }
    }
}; 