export interface Product {
  id: number;
  name: string;
  price: string | number;
  image: string;
  stock: number;
  description?: string;
  featured?: boolean;
}

export interface CartItem {
  product_id: number;
  quantity: number;
  name: string;
  price: string | number;
  image: string;
}
