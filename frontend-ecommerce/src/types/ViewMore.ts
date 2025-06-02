export type Category =
  | "mens"
  | "womens"
  | "childrens"
  | "shoes"
  | "beddings"
  | "new-arrivals";

export interface FilterOptions {
  sizes: string[];
  colors: string[];
  materials: string[];
  styles: string[];
  brands: string[];
  priceRange: [number, number];
  inStock: boolean;
}

export interface SortOption {
  label: string;
  value: string;
}

export interface CategoryMetadata {
  name: string;
  description: string;
  heroImage: string;
  subcategories: string[];
}
