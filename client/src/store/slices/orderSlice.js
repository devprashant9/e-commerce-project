import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { config } from '../../config/env';

// Async thunk for fetching user orders
export const fetchUserOrders = createAsyncThunk(
    'orders/fetchUserOrders',
    async (_, { getState, rejectWithValue }) => {
        try {
            const { token } = getState().auth;
            console.log('Fetching orders with token:', token ? 'Token exists' : 'No token');

            if (!token) {
                console.error('No auth token available');
                return rejectWithValue('Authentication required');
            }

            console.log('Making API request to:', `${config.API_URL}/orders/myorders`);
            const response = await axios.get(
                `${config.API_URL}/orders/myorders`,
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );

            console.log('Orders API response:', {
                status: response.status,
                orderCount: response.data.length,
                orders: response.data.map(order => ({
                    id: order._id,
                    status: order.status,
                    totalAmount: order.totalAmount,
                    createdAt: order.createdAt
                }))
            });

            return response.data;
        } catch (error) {
            console.error('Order fetch error:', {
                message: error.message,
                response: error.response?.data,
                status: error.response?.status
            });
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch orders');
        }
    }
);

const orderSlice = createSlice({
    name: 'orders',
    initialState: {
        orders: [],
        loading: false,
        error: null
    },
    reducers: {
        clearOrders: (state) => {
            console.log('Clearing orders from state');
            state.orders = [];
            state.loading = false;
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchUserOrders.pending, (state) => {
                console.log('Order fetch pending');
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchUserOrders.fulfilled, (state, action) => {
                console.log('Order fetch fulfilled:', {
                    orderCount: action.payload.length,
                    orders: action.payload.map(order => ({
                        id: order._id,
                        status: order.status,
                        items: order.items.length
                    }))
                });
                state.loading = false;
                state.orders = action.payload;
            })
            .addCase(fetchUserOrders.rejected, (state, action) => {
                console.error('Order fetch rejected:', action.payload);
                state.loading = false;
                state.error = action.payload;
            })
            .addCase('auth/logout', (state) => {
                console.log('Clearing orders due to logout');
                state.orders = [];
                state.loading = false;
                state.error = null;
            });
    }
});

export const { clearOrders } = orderSlice.actions;
export default orderSlice.reducer; 