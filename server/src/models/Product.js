import mongoose from 'mongoose';
import slugify from 'slugify';

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Product name is required'],
        trim: true,
        minlength: [3, 'Product name must be at least 3 characters long'],
        maxlength: [100, 'Product name cannot exceed 100 characters']
    },
    slug: {
        type: String,
        unique: true,
        lowercase: true,
        index: true
    },
    description: {
        type: String,
        required: [true, 'Product description is required'],
        trim: true,
        minlength: [10, 'Description must be at least 10 characters long'],
        maxlength: [1000, 'Description cannot exceed 1000 characters']
    },
    price: {
        type: Number,
        required: [true, 'Price is required'],
        min: [0, 'Price cannot be negative'],
        validate: {
            validator: Number.isFinite,
            message: '{VALUE} is not a valid price'
        }
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: [true, 'Category is required'],
        index: true
    },
    stock: {
        type: Number,
        required: [true, 'Stock quantity is required'],
        min: [0, 'Stock cannot be negative'],
        default: 0,
        validate: {
            validator: Number.isInteger,
            message: '{VALUE} is not a valid stock quantity'
        }
    },
    image: {
        type: String,
        required: [true, 'Product image is required']
    },
    cloudinaryId: {
        type: String,
        required: true
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    isActive: {
        type: Boolean,
        default: true,
        index: true
    },
    discount: {
        type: Number,
        min: [0, 'Discount cannot be negative'],
        max: [100, 'Discount cannot exceed 100%'],
        default: 0
    },
    unit: {
        type: String,
        required: [true, 'Unit is required'],
        enum: {
            values: ['kg', 'g', 'l', 'ml', 'piece', 'pack'],
            message: '{VALUE} is not a valid unit'
        }
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Virtual for discounted price
productSchema.virtual('discountedPrice').get(function () {
    if (!this.discount) return this.price;
    return this.price * (1 - this.discount / 100);
});

// Create slug from name before saving
productSchema.pre('save', function (next) {
    if (!this.isModified('name')) return next();

    try {
        this.slug = slugify(this.name, {
            lower: true,
            strict: true,
            trim: true
        });
        next();
    } catch (error) {
        next(error);
    }
});

// Ensure slug is unique
productSchema.pre('save', async function (next) {
    if (!this.isModified('slug')) return next();

    try {
        const slugRegEx = new RegExp(`^${this.slug}(-[0-9]*)?$`, 'i');
        const productsWithSlug = await this.constructor.find({ slug: slugRegEx });

        if (productsWithSlug.length > 0) {
            this.slug = `${this.slug}-${productsWithSlug.length + 1}`;
        }
        next();
    } catch (error) {
        next(error);
    }
});

// Add compound indexes
productSchema.index({ name: 'text', description: 'text' });
productSchema.index({ category: 1, isActive: 1 });
productSchema.index({ price: 1 });
productSchema.index({ createdAt: -1 });

const Product = mongoose.model('Product', productSchema);
export default Product; 