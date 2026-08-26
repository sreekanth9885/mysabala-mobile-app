export interface CheckoutAddress {
  fullName: string;
  phone: string;
  address: string;
  city: string;
  pincode: string;
}

export interface CheckoutCartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
}

export interface CheckoutTotals {
  subtotal: number;
  deliveryFee: number;
  gst: number;
  grandTotal: number;
}

export interface CreateOrderResponse {
  razorpay_order_id: string;
  amount: number;
  key: string;
}

export interface VerifyPaymentPayload {
  user_id?: number;
  customer_name: string;
  phone: string;
  address: string;
  city: string;
  pincode: string;

  subtotal: number;
  delivery_fee: number;
  gst: number;
  grand_total: number;

  cart_items: CheckoutCartItem[];

  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}
