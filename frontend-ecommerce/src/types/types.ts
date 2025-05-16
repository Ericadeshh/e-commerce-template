export interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
  image: string;
  stock: number;
}

export interface CartItem {
  product_id: number;
  quantity: number;
  name: string;
  price: number;
  image?: string; // Optional for display purposes
}
