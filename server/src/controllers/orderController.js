import Order from '../models/Order.js';
import Product from '../models/Product.js';

// Create new order
export const createOrder = async (req, res) => {
    try {
        const { items, shippingAddress, totalAmount, paymentMethod, paymentId } = req.body;

        // Additional validation
        if (!items || !Array.isArray(items) || items.length === 0) {
            return res.status(400).json({
                status: 'fail',
                message: 'Order must contain at least one item',
                errors: [{ field: 'items', message: 'Order must contain at least one item' }]
            });
        }

        // Validate each item
        for (const item of items) {
            if (!item.product || !item.quantity || !item.price) {
                return res.status(400).json({
                    status: 'fail',
                    message: 'Invalid item data',
                    errors: [{ field: 'items', message: 'Each item must have product, quantity, and price' }]
                });
            }

            // Check if product exists and has enough stock
            const product = await Product.findById(item.product);
            if (!product) {
                return res.status(400).json({
                    status: 'fail',
                    message: 'Product not found',
                    errors: [{ field: 'items', message: `Product ${item.product} not found` }]
                });
            }

            if (product.stock < item.quantity) {
                return res.status(400).json({
                    status: 'fail',
                    message: 'Insufficient stock',
                    errors: [{ field: 'items', message: `Insufficient stock for product ${product.name}` }]
                });
            }
        }

        // Create order
        const order = await Order.create({
            user: req.user._id,
            items,
            shippingAddress,
            totalAmount,
            paymentMethod,
            paymentId
        });

        // Update product stock
        for (const item of items) {
            const product = await Product.findById(item.product);
            if (product) {
                product.stock -= item.quantity;
                await product.save();
            }
        }

        res.status(201).json(order);
    } catch (error) {
        console.error('Order creation error:', error);
        res.status(500).json({
            status: 'error',
            message: error.message || 'Error creating order',
            errors: error.errors || []
        });
    }
};

// Get user orders
export const getUserOrders = async (req, res) => {
    try {
        console.log('Fetching orders for user:', req.user._id);

        // First, count total orders for this user
        const totalOrders = await Order.countDocuments({ user: req.user._id });
        console.log('Total orders in database for user:', totalOrders);

        // Get all orders without population first
        const allOrders = await Order.find({ user: req.user._id }).lean();
        console.log('Raw orders found:', allOrders.length);
        console.log('Order IDs:', allOrders.map(o => o._id));

        // Now get populated orders
        const orders = await Order.find({ user: req.user._id })
            .populate('user', 'name email')
            .populate('items.product', 'name')
            .sort({ createdAt: -1 })
            .lean();

        console.log('Found populated orders:', orders.length);
        console.log('Order details:', orders.map(o => ({
            id: o._id,
            createdAt: o.createdAt,
            status: o.status,
            itemCount: o.items.length
        })));

        res.json(orders);
    } catch (error) {
        console.error('Get user orders error:', error);
        res.status(500).json({
            status: 'error',
            message: 'Error fetching orders',
            error: error.message
        });
    }
};

// Get all orders (admin)
export const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find()
            .populate('user', 'name email')
            .sort({ createdAt: -1 });
        res.json(orders);
    } catch (error) {
        console.error('Get all orders error:', error);
        res.status(500).json({ message: 'Error fetching orders' });
    }
};

// Update order status (admin)
export const updateOrderStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        order.status = status;
        await order.save();

        res.json(order);
    } catch (error) {
        console.error('Update order status error:', error);
        res.status(500).json({ message: 'Error updating order status' });
    }
}; 