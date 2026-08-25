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
