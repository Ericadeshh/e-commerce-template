import CategoryCard from "../../FeaturedCategory/CategoryCard/CategoryCard";
import styles from "./ProductGrid.module.css";

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  category: string;
  stock: number;
  original_price?: number | null;
  discount_percentage?: number | null;
  is_new?: boolean;
}

interface ProductGridProps {
  products: Product[];
}

const ProductGrid: React.FC<ProductGridProps> = ({ products }) => {
  return (
    <div className={styles.grid}>
      {products.map((product) => (
        <CategoryCard key={product.id} product={product} />
      ))}
    </div>
  );
};

export default ProductGrid;
