import Product from '../models/Product.js';
import Order from '../models/Order.js';
import User from '../models/User.js';
import Category from '../models/Category.js';
import { ApiError } from '../utils/ApiError.js';

// @desc    Get dashboard stats
// @route   GET /api/dashboard/stats
// @access  Private/Admin
export const getDashboardStats = async (req, res, next) => {
    try {
        const [products, orders, users, categories] = await Promise.all([
            Product.find().populate('category'),
            Order.find().sort('-createdAt'),
            User.countDocuments({ role: 'user' }),
            Category.find()
        ]);

        // Calculate order stats
        const orderStats = orders.reduce((acc, order) => {
            acc[order.status] = (acc[order.status] || 0) + 1;
            acc.totalRevenue += order.totalAmount;
            return acc;
        }, { pending: 0, confirmed: 0, shipped: 0, delivered: 0, cancelled: 0, totalRevenue: 0 });

        // Calculate month-over-month growth
        const now = new Date();
        const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1);
        const twoMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 2);

        const currentMonthOrders = orders.filter(order =>
            new Date(order.createdAt) >= lastMonth && new Date(order.createdAt) <= now
        );
        const lastMonthOrders = orders.filter(order =>
            new Date(order.createdAt) >= twoMonthsAgo && new Date(order.createdAt) < lastMonth
        );

        const currentMonthRevenue = currentMonthOrders.reduce((sum, order) => sum + order.totalAmount, 0);
        const lastMonthRevenue = lastMonthOrders.reduce((sum, order) => sum + order.totalAmount, 0);
        const revenueGrowth = lastMonthRevenue === 0 ? 100 :
            ((currentMonthRevenue - lastMonthRevenue) / lastMonthRevenue) * 100;

        // Calculate product stats growth
        const currentMonthProducts = products.filter(product =>
            new Date(product.createdAt) >= lastMonth && new Date(product.createdAt) <= now
        ).length;
        const lastMonthProducts = products.filter(product =>
            new Date(product.createdAt) >= twoMonthsAgo && new Date(product.createdAt) < lastMonth
        ).length;
        const productGrowth = lastMonthProducts === 0 ? 100 :
            ((currentMonthProducts - lastMonthProducts) / lastMonthProducts) * 100;

        // Calculate low stock items growth
        const lowStockItems = products.filter(p => p.stock < 10).length;
        const lastMonthLowStock = products.filter(p => p.stock < 20).length;
        const lowStockGrowth = lastMonthLowStock === 0 ? 0 :
            ((lowStockItems - lastMonthLowStock) / lastMonthLowStock) * 100;

        // Calculate category growth
        const currentMonthCategories = categories.filter(cat =>
            new Date(cat.createdAt) >= lastMonth && new Date(cat.createdAt) <= now
        ).length;
        const lastMonthCategories = categories.filter(cat =>
            new Date(cat.createdAt) >= twoMonthsAgo && new Date(cat.createdAt) < lastMonth
        ).length;
        const categoryGrowth = lastMonthCategories === 0 ? 100 :
            ((currentMonthCategories - lastMonthCategories) / lastMonthCategories) * 100;

        const stats = {
            products: {
                total: products.length,
                growth: productGrowth.toFixed(1)
            },
            lowStock: {
                total: lowStockItems,
                growth: lowStockGrowth.toFixed(1)
            },
            categories: {
                total: categories.length,
                growth: categoryGrowth.toFixed(1)
            },
            revenue: {
                total: orderStats.totalRevenue,
                growth: revenueGrowth.toFixed(1)
            },
            orders: orderStats,
            totalCustomers: users,
            recentProducts: products.slice(-5).reverse()
        };

        res.json(stats);
    } catch (error) {
        next(new ApiError(500, 'Error fetching dashboard stats'));
    }
}; 