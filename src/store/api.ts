import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import {
  CategoriesResponse,
  Category,
  Product,
  ProductsResponse,
} from '../types/types';
export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://api.mysabala.com',
  }),
  endpoints: builder => ({
    getProducts: builder.query<Product[], void>({
      query: () => '/products',
      transformResponse: (response: ProductsResponse) => {
        return response.data;
      },
    }),
    getCategories: builder.query<Category[], void>({
      query: () => '/categories',
      transformResponse: (response: CategoriesResponse) => {
        return response.data;
      },
    }),
  }),
});
export const { useGetProductsQuery, useGetCategoriesQuery } = api;
