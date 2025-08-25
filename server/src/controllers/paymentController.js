import axios from 'axios';
import dotenv from 'dotenv';
import Order from '../models/Order.js';
import Product from '../models/Product.js';

dotenv.config();

const PAYPAL_API_URL = process.env.PAYPAL_API_URL || 'https://api-m.sandbox.paypal.com';

// Create PayPal order
export const createPayPalOrder = async (req, res) => {
    try {
        const { items, totalAmount } = req.body;



        if (!items || !Array.isArray(items) || items.length === 0) {
            console.error('Invalid items data received');
            return res.status(400).json({
                message: 'Invalid items data',
                details: 'Items array is required and must not be empty'
            });
        }

        if (!totalAmount || isNaN(totalAmount) || totalAmount <= 0) {
            console.error('Invalid total amount received:', totalAmount);
            return res.status(400).json({
                message: 'Invalid total amount',
                details: 'Total amount must be a positive number'
            });
        }

        // Get access token from PayPal
       
        const authResponse = await axios.post(
            `${PAYPAL_API_URL}/v1/oauth2/token`,
            'grant_type=client_credentials',
            {
                auth: {
                    username: process.env.PAYPAL_CLIENT_ID,
                    password: process.env.PAYPAL_CLIENT_SECRET
                },
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }
        );

        if (!authResponse.data.access_token) {
            console.error('Failed to get PayPal access token:', authResponse.data);
            throw new Error('Failed to get PayPal access token');
        }

       

        // Convert INR to USD (approximate conversion)
        const usdAmount = (totalAmount / 83).toFixed(2);

        // Create PayPal order
        const orderData = {
            intent: 'CAPTURE',
            purchase_units: [
                {
                    amount: {
                        currency_code: 'USD',
                        value: usdAmount
                    }
                }
            ]
        };

       

        const orderResponse = await axios.post(
            `${PAYPAL_API_URL}/v2/checkout/orders`,
            orderData,
            {
                headers: {
                    'Authorization': `Bearer ${authResponse.data.access_token}`,
                    'Content-Type': 'application/json',
                    'Prefer': 'return=representation'
                }
            }
        );

       
        return res.json(orderResponse.data);
    } catch (error) {
        console.error('PayPal order creation error:', {
            message: error.message,
            response: error.response?.data,
            status: error.response?.status,
            config: error.config
        });
        return res.status(500).json({
            message: 'Failed to create PayPal order',
            error: error.response?.data?.message || error.message,
            details: error.response?.data
        });
    }
};

// Capture PayPal payment
export const capturePayPalPayment = async (req, res) => {
    try {
        const { orderID } = req.body;

        if (!orderID) {
            return res.status(400).json({ message: 'PayPal order ID is required' });
        }

        // Get access token from PayPal
        const authResponse = await axios.post(
            `${PAYPAL_API_URL}/v1/oauth2/token`,
            'grant_type=client_credentials',
            {
                auth: {
                    username: process.env.PAYPAL_CLIENT_ID,
                    password: process.env.PAYPAL_CLIENT_SECRET
                },
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }
        );

        if (!authResponse.data.access_token) {
            throw new Error('Failed to get PayPal access token');
        }

        // Capture payment
        const captureResponse = await axios.post(
            `${PAYPAL_API_URL}/v2/checkout/orders/${orderID}/capture`,
            {},
            {
                headers: {
                    'Authorization': `Bearer ${authResponse.data.access_token}`,
                    'Content-Type': 'application/json',
                    'PayPal-Request-Id': `capture_${orderID}`
                }
            }
        );

        return res.json(captureResponse.data);
    } catch (error) {
        console.error('PayPal payment capture error:', error.response?.data || error.message);
        return res.status(500).json({
            message: 'Failed to capture PayPal payment',
            error: error.response?.data || error.message
        });
    }
}; 