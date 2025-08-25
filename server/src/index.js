import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import path from 'path';
import { fileURLToPath } from 'url';
import authRoutes from './routes/authRoutes.js';
import productRoutes from './routes/productRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import userRoutes from './routes/userRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';
import { errorHandler } from './middleware/errorHandler.js';
import app from './app.js';

// ES modules fix for __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

// Middleware
app.use(cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173"
}));
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static files
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Create uploads directory if it doesn't exist
import fs from 'fs';
const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/users', userRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/dashboard', dashboardRoutes);

// Basic route
app.get('/', (req, res) => {
    res.json({ message: 'Welcome to BlinkIt API' });
});

// Error handling
app.use(errorHandler);

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('MongoDB connection error:', err)); 