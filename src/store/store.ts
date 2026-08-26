import { configureStore } from '@reduxjs/toolkit';

import cartReducer from './cartSlice';
import authReducer from './authSlice';

import { api } from './api';
import { checkoutApi } from './checkoutApi';
import { authApi } from './authApi';
import { ordersApi } from './ordersApi';

export const store = configureStore({
  reducer: {
    [api.reducerPath]: api.reducer,
    [checkoutApi.reducerPath]: checkoutApi.reducer,
    [authApi.reducerPath]: authApi.reducer,
    [ordersApi.reducerPath]: ordersApi.reducer,
    cart: cartReducer,
    auth: authReducer,
  },

  middleware: getDefaultMiddleware =>
    getDefaultMiddleware()
      .concat(api.middleware)
      .concat(authApi.middleware)
      .concat(ordersApi.middleware)
      .concat(checkoutApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
