import { configureStore } from '@reduxjs/toolkit';
import cartReducer from './cartSlice';
import { checkoutApi } from './checkoutApi';
import { api } from './api';
import authReducer from './authSlice';
export const store = configureStore({
  reducer: {
    [api.reducerPath]: api.reducer,
    cart: cartReducer,
    auth: authReducer,
    [checkoutApi.reducerPath]: checkoutApi.reducer,
  },

  middleware: getDefaultMiddleware =>
    getDefaultMiddleware().concat(api.middleware),
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
