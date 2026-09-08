import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

interface CreateOrderResponse {
  success: boolean;
  data: {
    razorpay_order_id: string;
    amount: number;
    key: string;
  };
}

interface CreateOrderResult {
  razorpay_order_id: string;
  amount: number;
  key: string;
}

interface VerifyPaymentResponse {
  success: boolean;
  message?: string;
  data?: {
    order_id?: number;
  };
}

export const checkoutApi = createApi({
  reducerPath: 'checkoutApi',

  baseQuery: fetchBaseQuery({
    baseUrl: 'https://api.mysabala.com',
  }),

  endpoints: builder => ({
    // ---------------------------------
    // CREATE RAZORPAY ORDER
    // ---------------------------------
    createOrder: builder.mutation<
      CreateOrderResult,
      {
        cart_items: any[];
      }
    >({
      query: body => ({
        url: '/orders/create',
        method: 'POST',
        body,
      }),

      transformResponse: (response: CreateOrderResponse) => {
        return response.data;
      },
    }),

    // ---------------------------------
    // VERIFY PAYMENT
    // ---------------------------------
    verifyPayment: builder.mutation<
      VerifyPaymentResponse,
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
