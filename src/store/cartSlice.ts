import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Product } from '../types/types';

export interface CartItem extends Product {
  quantity: number;
}

interface CartState {
  items: CartItem[];
}

const initialState: CartState = {
  items: [],
};

const cartSlice = createSlice({
  name: 'cart',

  initialState,

  reducers: {
    // ==========================================
    // ADD TO CART
    // ==========================================

    addToCart: (state, action: PayloadAction<Product>) => {
      const existingItem = state.items.find(
        item => item.id === action.payload.id,
      );

      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        state.items.push({
          ...action.payload,
          quantity: 1,
        });
      }
    },

    // ==========================================
    // INCREASE QUANTITY
    // ==========================================

    increaseQuantity: (state, action: PayloadAction<number>) => {
      const item = state.items.find(item => item.id === action.payload);

      if (!item) return;

      item.quantity += 1;
    },

    // ==========================================
    // DECREASE QUANTITY
    // ==========================================

    decreaseQuantity: (state, action: PayloadAction<number>) => {
      const item = state.items.find(item => item.id === action.payload);

      if (!item) return;

      if (item.quantity > 1) {
        item.quantity -= 1;
      } else {
        state.items = state.items.filter(item => item.id !== action.payload);
      }
    },

    // ==========================================
    // REMOVE FROM CART
    // ==========================================
    // This behaves like decrease quantity.
    // Kept for compatibility with your existing code.

    removeFromCart: (state, action: PayloadAction<number>) => {
      const item = state.items.find(item => item.id === action.payload);

      if (!item) return;

      if (item.quantity > 1) {
        item.quantity -= 1;
      } else {
        state.items = state.items.filter(item => item.id !== action.payload);
      }
    },

    // ==========================================
    // DELETE ITEM COMPLETELY
    // ==========================================

    deleteFromCart: (state, action: PayloadAction<number>) => {
      state.items = state.items.filter(item => item.id !== action.payload);
    },

    // ==========================================
    // SET EXACT QUANTITY
    // ==========================================

    setQuantity: (
      state,
      action: PayloadAction<{
        id: number;
        quantity: number;
      }>,
    ) => {
      const { id, quantity } = action.payload;

      const item = state.items.find(item => item.id === id);

      if (!item) return;

      if (quantity <= 0) {
        state.items = state.items.filter(item => item.id !== id);

        return;
      }

      item.quantity = quantity;
    },

    // ==========================================
    // CLEAR CART
    // ==========================================

    clearCart: state => {
      state.items = [];
    },
  },
});

export const {
  addToCart,
  increaseQuantity,
  decreaseQuantity,
  removeFromCart,
  deleteFromCart,
  setQuantity,
  clearCart,
} = cartSlice.actions;

export default cartSlice.reducer;
