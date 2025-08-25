import mongoose from 'mongoose';
import slugify from 'slugify';

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Category name is required'],
        unique: true,
        trim: true,
        lowercase: true,
        minlength: [2, 'Category name must be at least 2 characters long'],
        maxlength: [50, 'Category name cannot exceed 50 characters']
    },
    slug: {
        type: String,
        unique: true,
        lowercase: true,
        index: true
    },
    description: {
        type: String,
        required: [true, 'Category description is required'],
        trim: true,
        minlength: [10, 'Description must be at least 10 characters long'],
        maxlength: [500, 'Description cannot exceed 500 characters']
    },
    image: {
        type: String,
        default: 'https://res.cloudinary.com/demo/image/upload/v1/samples/default-category.png'
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Virtual for product count
categorySchema.virtual('productCount', {
    ref: 'Product',
    localField: '_id',
    foreignField: 'category',
    count: true
});

// Create slug from name before saving
categorySchema.pre('save', function (next) {
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
categorySchema.pre('save', async function (next) {
    if (!this.isModified('slug')) return next();

    try {
        const slugRegEx = new RegExp(`^${this.slug}(-[0-9]*)?$`, 'i');
        const categoriesWithSlug = await this.constructor.find({ slug: slugRegEx });

        if (categoriesWithSlug.length > 0) {
            this.slug = `${this.slug}-${categoriesWithSlug.length + 1}`;
        }
        next();
    } catch (error) {
        next(error);
    }
});

// Add indexes
categorySchema.index({ name: 1 });
categorySchema.index({ slug: 1 });

const Category = mongoose.model('Category', categorySchema);

export default Category; 