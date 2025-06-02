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
        const effectiveCategory =
          category.toLowerCase() === "new-arrivals" ||
          category.toLowerCase() === "featured-products"
            ? ""
            : category;
        const apiUrl =
          category.toLowerCase() === "new-arrivals"
            ? `http://localhost:5000/api/products?new=true&limit=${limit}`
            : category.toLowerCase() === "featured-products"
            ? `http://localhost:5000/api/products?featured=true&limit=${limit}`
            : `http://localhost:5000/api/products?category=${effectiveCategory}&limit=${limit}`;
        const res = await fetch(apiUrl);
        if (!res.ok)
          throw new Error(`Failed to fetch related products: ${res.status}`);
        const data: Product[] = await res.json();
        const filteredData = data.filter((p) => !excludeIds.includes(p.id));
        if (isMounted) {
          setRelatedProducts(
            filteredData.slice(0, isMobile ? 2 : 3).map((p) => ({
              ...p,
              image: p.image || "https://placehold.co/300x300",
              price: parseFloat(p.price.toString()),
              stock: Number(p.stock),
              original_price: p.original_price
                ? parseFloat(p.original_price.toString())
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
        // Fallback to static data
        const effectiveCategoryName =
          category.toLowerCase() === "new-arrivals"
            ? "New Arrivals"
            : category.toLowerCase() === "featured-products"
            ? "Featured Products"
            : category;
        const staticData =
          staticCategories
            .find((c: StaticCategory) => c.name === effectiveCategoryName)
            ?.products.filter((p: Product) => !excludeIds.includes(p.id))
            .slice(0, isMobile ? 2 : 3) || [];
        if (isMounted) {
          setRelatedProducts(staticData);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchRelatedProducts();
    return () => {
      isMounted = false;
    };
  }, [category, excludeIds, isMobile]);

  if (relatedProducts.length === 0 && !loading) return null;

  return (
    <motion.section
      className={styles.section}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.h2
        className={styles.sectionTitle}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        You May Also Like
        <motion.span
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <FaStar className={styles.starIcon} />
        </motion.span>
      </motion.h2>
      {loading ? (
        <div className={styles.loading}>Loading...</div>
      ) : (
        <motion.div
          className={styles.grid}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {relatedProducts.map((product) => (
            <CategoryCard key={product.id} product={product} />
          ))}
        </motion.div>
      )}
    </motion.section>
  );
};

export default RelatedProducts;
