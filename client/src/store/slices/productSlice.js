import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Ensure we have a valid API URL
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const fetchProducts = createAsyncThunk(
    'products/fetchProducts',
    async ({ page = 1, limit = 10, sort = '-createdAt', search = '', category = '' }) => {
        const url = `${API_URL}/products?page=${page}&limit=${limit}&sort=${sort}&search=${search}&category=${category}`;
        const response = await axios.get(url);
        return response.data;
    }
);

const initialState = {
    items: [],
    filteredItems: [],
    status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null,
    lastFetched: null,
    pagination: {
        page: 1,
        pages: 1,
        total: 0
    },
    filters: {
        category: 'all',
        search: '',
        priceRange: {
            min: 0,
            max: Infinity
        },
        sort: '-createdAt'
    }
};

const productSlice = createSlice({
    name: 'products',
    initialState,
    reducers: {
        setFilter: (state, action) => {
            state.filters = { ...state.filters, ...action.payload };

            // If the filter is category, we don't apply client-side filtering
            // as it will be handled by the API call
            if (!action.payload.category) {
                // Apply other filters (search and price) client-side
                state.filteredItems = state.items.filter(product => {
                    const matchesSearch =
                        product.name.toLowerCase().includes(state.filters.search.toLowerCase()) ||
                        (product.category &&
                            product.category.name.toLowerCase().includes(state.filters.search.toLowerCase()));

                    const matchesPrice =
                        product.price >= state.filters.priceRange.min &&
                        product.price <= (state.filters.priceRange.max === Infinity ? Number.MAX_SAFE_INTEGER : state.filters.priceRange.max);

                    return matchesSearch && matchesPrice;
                });
            }
        },
        clearFilters: (state) => {
            state.filters = initialState.filters;
            state.filteredItems = state.items;
        },
        resetError: (state) => {
            state.error = null;
            state.status = 'idle';
        },
        setPage: (state, action) => {
            state.pagination.page = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchProducts.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(fetchProducts.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.items = action.payload.products;
                state.filteredItems = action.payload.products;
                state.pagination = {
                    page: action.payload.page,
                    pages: action.payload.pages,
                    total: action.payload.total
                };
                state.lastFetched = Date.now();
                state.error = null;
            })
            .addCase(fetchProducts.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload || 'Something went wrong';
                state.items = [];
                state.filteredItems = [];
            });
    }
});

export const { setFilter, clearFilters, resetError, setPage } = productSlice.actions;
export default productSlice.reducer; 