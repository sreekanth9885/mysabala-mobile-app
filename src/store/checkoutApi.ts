import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const checkoutApi = createApi({
  reducerPath: 'checkoutApi',

  baseQuery: fetchBaseQuery({
    baseUrl: 'https://api.mysabala.com',
  }),

  endpoints: builder => ({
    createOrder: builder.mutation<
      {
        key: string;
        amount: number;
        razorpay_order_id: string;
      },
      {
        grand_total: number;
      }
    >({
      query: body => ({
        url: '/orders/create',
        method: 'POST',
        body,
      }),
    }),

    verifyPayment: builder.mutation<
      any,
      {
        user_id: number | undefined;
        customer_name: string;
        phone: string;
        address: string;
        city: string;
        pincode: string;
        subtotal: number;
        delivery_fee: number;
        gst: number;
        grand_total: number;
        cart_items: any[];
        razorpay_payment_id: string;
        razorpay_order_id: string;
        razorpay_signature: string;
      }
    >({
      query: body => ({
        url: '/orders/verify-payment',
        method: 'POST',
        body,
      }),
    }),
  }),
});

export const { useCreateOrderMutation, useVerifyPaymentMutation } = checkoutApi;
