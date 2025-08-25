import cloudinary from '../config/cloudinary.js';

export const uploadToCloudinary = async (file) => {
    try {
        if (!file) throw new Error('No file provided');

        // Upload the file to Cloudinary
        const result = await cloudinary.uploader.upload(file.path, {
            folder: 'blinkit', // This will create a folder in your Cloudinary account
            use_filename: true,
            unique_filename: true,
        });

        // Return the Cloudinary URL and public_id
        return {
            url: result.secure_url,
            public_id: result.public_id
        };
    } catch (error) {
        throw new Error(`Error uploading to Cloudinary: ${error.message}`);
    }
};

export const deleteFromCloudinary = async (public_id) => {
    try {
        if (!public_id) return;
        await cloudinary.uploader.destroy(public_id);
    } catch (error) {
        throw new Error(`Error deleting from Cloudinary: ${error.message}`);
    }
}; 