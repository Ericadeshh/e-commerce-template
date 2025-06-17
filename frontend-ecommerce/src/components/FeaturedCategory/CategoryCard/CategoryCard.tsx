import { Card } from "react-bootstrap";
import { motion } from "framer-motion";
import { FaShoppingCart, FaQuestionCircle, FaHeart } from "react-icons/fa";
import styles from "./CategoryCard.module.css";
import { useState } from "react";

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
  id?: string;
}

const CategoryCard: React.FC<CategoryCardProps> = ({ product, id }) => {
  const [showRibbon, setShowRibbon] = useState(false);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    if (product.stock > 0) alert("Add to cart functionality TBD");
  };

  const handleAddToWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    alert("Add to wishlist functionality TBD");
  };

  return (
    <motion.div
      id={id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={styles.cardWrapper}
      onMouseEnter={() => setShowRibbon(true)}
      onMouseLeave={() => setShowRibbon(false)}
      onClick={() => setShowRibbon(!showRibbon)}
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
          {showRibbon && (
            <div className={styles.ribbon}>
              <a
                href={`/products/${product.category}/${product.id}`}
                className={styles.ribbonIcon}
              >
                <FaQuestionCircle />
              </a>
              <a
                href="/cart"
                className={styles.ribbonIcon}
                onClick={handleAddToCart}
              >
                <FaShoppingCart />
              </a>
              <a
                href="/wishlist"
                className={styles.ribbonIcon}
                onClick={handleAddToWishlist}
              >
                <FaHeart />
              </a>
            </div>
          )}
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
            <a
              href={`/products/${product.category}/${product.id}`}
              className={styles.detailLink}
            >
              Details
            </a>
            <a
              href="/cart"
              className={styles.shopLink}
              onClick={handleAddToCart}
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
