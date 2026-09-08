export interface Product {
  id: number;
  category_id: number;
  category_name: string;
  sub_category_id: number;
  sub_category_name: string;
  name: string;
  unit: string;
  price: number;
  image: string | null;
  created_at: string;
  updated_at: string;
  available_quantity: number;
}
export interface Category {
  id: number;
  name: string;
  description: string;
  is_active: number;
  created_at: string;
}
export interface ProductsResponse {
  data: Product[];
}
export interface CategoriesResponse {
  data: Category[];
}
export interface OrderItem {
  id: number;
  order_id: number;
  food_item_id: number;
  food_name: string;
  quantity: number;
  price: string;
  total: string;
  created_at: string;
}
export interface Order {
  id: number;
  user_id: number;
  customer_name: string;
  customer_phone: string;
  address: string;
  city: string;
  pincode: string;
  subtotal: string;
  delivery_fee: string;
  gst: string;
  grand_total: string;
  payment_method: string;
  payment_status: string;
  order_status: string;
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
  created_at: string;
  items: OrderItem[];
}
