import { configureStore } from '@reduxjs/toolkit';
import { persistReducer, persistStore } from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import cartReducer from './cartSlice';
import authReducer from './authSlice';
import { api } from './api';
import { checkoutApi } from './checkoutApi';
import { authApi } from './authApi';
import { ordersApi } from './ordersApi';

/* -------------------------------- */
/* PERSIST CONFIG */
/* -------------------------------- */

const authPersistConfig = {
  key: 'auth',
  storage: AsyncStorage,
};

const cartPersistConfig = {
  key: 'cart',
  storage: AsyncStorage,
};

/* -------------------------------- */
/* PERSISTED REDUCERS */
/* -------------------------------- */

const persistedAuthReducer = persistReducer(authPersistConfig, authReducer);

const persistedCartReducer = persistReducer(cartPersistConfig, cartReducer);

/* -------------------------------- */
/* STORE */
/* -------------------------------- */

export const store = configureStore({
  reducer: {
    [api.reducerPath]: api.reducer,
    [checkoutApi.reducerPath]: checkoutApi.reducer,
    [authApi.reducerPath]: authApi.reducer,
    [ordersApi.reducerPath]: ordersApi.reducer,

    cart: persistedCartReducer,
    auth: persistedAuthReducer,
  },

  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [
          'persist/PERSIST',
          'persist/REHYDRATE',
          'persist/REGISTER',
          'persist/FLUSH',
          'persist/PAUSE',
          'persist/PURGE',
          'persist/SET',
        ],
      },
    })
      .concat(api.middleware)
      .concat(authApi.middleware)
      .concat(ordersApi.middleware)
      .concat(checkoutApi.middleware),
});

/* -------------------------------- */
/* PERSISTOR */
/* -------------------------------- */

export const persistor = persistStore(store);

/* -------------------------------- */
/* TYPES */
/* -------------------------------- */

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
