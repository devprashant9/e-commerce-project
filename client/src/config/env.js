export const config = {
    API_URL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
    PAYPAL_CLIENT_ID: import.meta.env.VITE_PAYPAL_CLIENT_ID,
    NODE_ENV: import.meta.env.VITE_NODE_ENV || 'development'
}; 