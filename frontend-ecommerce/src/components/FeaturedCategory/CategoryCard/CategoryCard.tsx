import { Card } from "react-bootstrap";
import { motion } from "framer-motion";
import { FaShoppingCart } from "react-icons/fa";
import styles from "./CategoryCard.module.css";

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
  brand?: string;
}

interface CategoryCardProps {
  product: Product;
  id?: string; // Added optional id prop
}

const CategoryCard: React.FC<CategoryCardProps> = ({ product, id }) => {
  return (
    <motion.div
      id={id} // Apply id to root element for hash navigation
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={styles.cardWrapper}
    >
      <Card className={styles.productCard}>
        <div className={styles.imageWrapper}>
          <Card.Img
            variant="top"
            src={product.image}
            alt={product.name}
            className={styles.productImage}
            onError={(e) => {
              e.currentTarget.src = "https://placehold.co/300x300";
            }}
          />
          {product.discount_percentage && (
            <div className={styles.discountBadge}>
              {product.discount_percentage}% Off
            </div>
          )}
          {product.is_new && <div className={styles.newBadge}>New</div>}
        </div>
        <Card.Body className={styles.cardBody}>
          <div className={styles.categoryTag}>{product.category}</div>
          <h4 className={styles.productName}>{product.name}</h4>
          <div className={styles.priceContainer}>
            <span className={styles.productPrice}>
              ${product.price.toFixed(2)}
            </span>
            {product.original_price && (
              <span className={styles.originalPrice}>
                ${product.original_price.toFixed(2)}
              </span>
            )}
          </div>
          <div className={styles.stockStatus}>
            {product.stock <= 0
              ? "Out of Stock"
              : product.stock <= 5
              ? `Only ${product.stock} Left!`
              : "In Stock"}
          </div>
          <div className={styles.linkGroup}>
            <a href={`/products/${product.id}`} className={styles.detailLink}>
              Details
            </a>
            <a
              href="#"
              className={styles.shopLink}
              onClick={(e) => {
                e.preventDefault();
                if (product.stock > 0) alert("Add to cart functionality TBD");
              }}
            >
              Shop <FaShoppingCart className={styles.cartIcon} />
            </a>
          </div>
        </Card.Body>
      </Card>
    </motion.div>
  );
};

export default CategoryCard;
