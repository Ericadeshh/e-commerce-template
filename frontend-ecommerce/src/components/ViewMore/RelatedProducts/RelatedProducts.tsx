import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaStar } from "react-icons/fa";
import CategoryCard from "../../FeaturedCategory/CategoryCard/CategoryCard";
import { staticCategories } from "../../../static/categories";
import styles from "./RelatedProducts.module.css";

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
  size?: string;
  color?: string;
  material?: string;
  style?: string;
  brand?: string;
}

interface StaticCategory {
  id: string;
  name: string;
  products: Product[];
}

interface RelatedProductsProps {
  category: string;
  excludeIds: number[];
}

const RelatedProducts: React.FC<RelatedProductsProps> = ({
  category,
  excludeIds,
}) => {
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const updateMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    updateMobile();
    window.addEventListener("resize", updateMobile);
    return () => window.removeEventListener("resize", updateMobile);
  }, []);

  useEffect(() => {
    let isMounted = true;
    const fetchRelatedProducts = async () => {
      setLoading(true);
      try {
        const limit = isMobile ? 2 : 6;
        const res = await fetch(
          `http://localhost:5000/api/products?category=${category}&limit=${limit}`
        );
        if (!res.ok)
          throw new Error(`Failed to fetch related products: ${res.status}`);
        const data: Product[] = await res.json();
        const filteredData = data.filter((p) => !excludeIds.includes(p.id));
        if (isMounted) {
          setRelatedProducts(
            filteredData.slice(0, isMobile ? 2 : 3).map((p) => ({
              ...p,
              image: p.image || "https://placehold.co/300x300",
              price: parseFloat(String(p.price)),
              stock: Number(p.stock),
              original_price: p.original_price
                ? parseFloat(String(p.original_price))
                : null,
              discount_percentage: p.discount_percentage
                ? Number(p.discount_percentage)
                : null,
              brand: p.brand || "",
            }))
          );
        }
      } catch (err) {
        console.error("Related products error:", err);
        const staticData =
          staticCategories.find(
            (c: StaticCategory) =>
              c.name.toLowerCase() === category.toLowerCase()
          )?.products || [];
        const filteredStaticData = staticData.filter(
          (p) => !excludeIds.includes(p.id)
        );
        if (isMounted) {
          setRelatedProducts(filteredStaticData.slice(0, isMobile ? 2 : 3));
        }
      } finally {
        setTimeout(() => {
          if (isMounted) setLoading(false);
        }, 125);
      }
    };
    fetchRelatedProducts();
    return () => {
      isMounted = false;
    };
  }, [category, isMobile, excludeIds]);

  if (relatedProducts.length === 0 && !loading) return null;

  return (
    <motion.div
      className={styles.container}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className={styles.title}>
        <FaStar className={styles.starIcon} /> Related Products{" "}
        <FaStar className={styles.starIcon} />
      </h2>
      {loading ? (
        <div className={styles.loading}>Loading related products...</div>
      ) : (
        <div className={styles.grid}>
          {relatedProducts.map((product) => (
            <CategoryCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default RelatedProducts;
