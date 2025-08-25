import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { config } from '../../config/env';

// Async thunk for fetching user orders
export const fetchUserOrders = createAsyncThunk(
    'orders/fetchUserOrders',
    async (_, { getState, rejectWithValue }) => {
        try {
            const { token } = getState().auth;

            if (!token) {
                return rejectWithValue('Authentication required');
            }

            const response = await axios.get(
                `${config.API_URL}/orders/myorders`,
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );

            // ✅ With new backend format: response.data.data contains orders
            return response.data.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || 'Failed to fetch orders'
            );
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
            state.orders = [];
            state.loading = false;
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchUserOrders.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchUserOrders.fulfilled, (state, action) => {
                state.loading = false;
                state.orders = action.payload; // already array of orders
            })
            .addCase(fetchUserOrders.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase('auth/logout', (state) => {
                state.orders = [];
                state.loading = false;
                state.error = null;
            });
    }
});

export const { clearOrders } = orderSlice.actions;
export default orderSlice.reducer;
