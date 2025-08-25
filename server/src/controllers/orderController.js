import Product from "../models/Product.js";
import Order from "../models/Order.js";

export const createOrder = async (req, res) => {
    try {
        const { items, shippingAddress, totalAmount, paymentMethod, paymentId } = req.body;
        

        if (!items || !Array.isArray(items) || items.length === 0) {
            return res.status(400).json({
                status: "fail",
                message: "Order must contain at least one item",
                errors: [{ field: "items", message: "Order must contain at least one item" }],
            });
        }

        for (const item of items) {
            // Require at least quantity + price
            if (!item.quantity || !item.price) {
                return res.status(400).json({
                    status: "fail",
                    message: "Invalid item data",
                    errors: [{ field: "items", message: "Each item must have quantity and price" }],
                });
            }

            // If product ID is provided, validate and check stock
            if (item.product) {
                const product = await Product.findById(item.product);
                if (!product) {
                    return res.status(400).json({
                        status: "fail",
                        message: "Product not found",
                        errors: [{ field: "items", message: `Product ${item.product} not found` }],
                    });
                }

                if (product.stock < item.quantity) {
                    return res.status(400).json({
                        status: "fail",
                        message: "Insufficient stock",
                        errors: [{ field: "items", message: `Insufficient stock for product ${product.name}` }],
                    });
                }
            }
        }

        // Save order (even if no product IDs, it still works for PayPal sandbox)
        const order = await Order.create({
            user: req.user?._id || null, // allow guest orders
            items,
            shippingAddress,
            totalAmount,
            paymentMethod,
            paymentId,
        });

        // If product IDs exist, reduce stock
        for (const item of items) {
            if (item.product) {
                const product = await Product.findById(item.product);
                if (product) {
                    product.stock -= item.quantity;
                    await product.save();
                }
            }
        }

        res.status(201).json({
            status: "success",
            message: "Order created successfully",
            data: order,
        });
    } catch (error) {
        console.error("Order creation error:", error);
        res.status(500).json({
            status: "error",
            message: error.message || "Error creating order",
            errors: error.errors || [],
        });
    }
};


// Get user orders
export const getUserOrders = async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user._id })
            .populate('user', 'name email')
            .populate('items.product', 'name')
            .sort({ createdAt: -1 })
            .lean();

        res.status(200).json({
            status: 'success',
            results: orders.length,
            data: orders
        });
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

        res.status(200).json({
            status: 'success',
            results: orders.length,
            data: orders
        });
    } catch (error) {
        console.error('Get all orders error:', error);
        res.status(500).json({
            status: 'error',
            message: 'Error fetching orders',
            error: error.message
        });
    }
};

// Update order status (admin)
export const updateOrderStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({
                status: 'fail',
                message: 'Order not found'
            });
        }

        order.status = status;
        await order.save();

        res.status(200).json({
            status: 'success',
            message: 'Order status updated successfully',
            data: order
        });
    } catch (error) {
        console.error('Update order status error:', error);
        res.status(500).json({
            status: 'error',
            message: 'Error updating order status',
            error: error.message
        });
    }
};
