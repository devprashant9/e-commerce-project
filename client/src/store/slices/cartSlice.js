import { createSlice } from '@reduxjs/toolkit';

const cartSlice = createSlice({
    name: 'cart',
    initialState: {
        items: JSON.parse(localStorage.getItem('cartItems')) || [],
        totalQuantity: 0,
        totalAmount: 0
    },
    reducers: {
        addToCart: (state, action) => {
            const newItem = action.payload;
            const existingItem = state.items.find(item => item._id === newItem._id);

            if (existingItem) {
                existingItem.quantity += newItem.quantity;
            } else {
                state.items.push(newItem);
            }

            // Update totals
            state.totalQuantity = state.items.reduce((total, item) => total + item.quantity, 0);
            state.totalAmount = state.items.reduce((total, item) => total + (item.price * item.quantity), 0);

            // Save to localStorage
            localStorage.setItem('cartItems', JSON.stringify(state.items));
        },
        removeFromCart: (state, action) => {
            const id = action.payload;
            state.items = state.items.filter(item => item._id !== id);

            // Update totals
            state.totalQuantity = state.items.reduce((total, item) => total + item.quantity, 0);
            state.totalAmount = state.items.reduce((total, item) => total + (item.price * item.quantity), 0);

            // Save to localStorage
            localStorage.setItem('cartItems', JSON.stringify(state.items));
        },
        updateItems: (state, action) => {
            state.items = action.payload;

            // Update totals
            state.totalQuantity = state.items.reduce((total, item) => total + item.quantity, 0);
            state.totalAmount = state.items.reduce((total, item) => total + (item.price * item.quantity), 0);

            // Save to localStorage
            localStorage.setItem('cartItems', JSON.stringify(state.items));
        },
        clearCart: (state) => {
            state.items = [];
            state.totalQuantity = 0;
            state.totalAmount = 0;
            localStorage.removeItem('cartItems');
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase('auth/logout', (state) => {
                state.items = [];
                state.totalQuantity = 0;
                state.totalAmount = 0;
                localStorage.removeItem('cartItems');
                localStorage.removeItem('cart');
            });
    }
});

export const { addToCart, removeFromCart, updateItems, clearCart } = cartSlice.actions;
export default cartSlice.reducer; 