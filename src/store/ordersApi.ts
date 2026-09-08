import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { RootState } from './store';

export const ordersApi = createApi({
  reducerPath: 'ordersApi',

  baseQuery: fetchBaseQuery({
    baseUrl: 'https://api.mysabala.com',

    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.token;

      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }

      headers.set('Content-Type', 'application/json');

      return headers;
    },
  }),

  refetchOnReconnect: true,
  endpoints: builder => ({
    getOrdersByUser: builder.query<any[], number>({
      query: userId => `/orders/${userId}`,
      keepUnusedDataFor: 60,
    }),
  }),
});

export const { useGetOrdersByUserQuery } = ordersApi;
