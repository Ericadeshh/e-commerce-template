import { useState, useEffect } from "react";
import { Offcanvas, Alert } from "react-bootstrap";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaHeart,
  FaCheck,
  FaBoxOpen,
  FaTrash,
  FaShoppingCart,
} from "react-icons/fa";
import styles from "./Wishlist.module.css";

// Static image imports for demo content
import MensJacket from "../../assets/mensjacket.jpg";
import WomensSummerDress from "../../assets/Women'sSummerDress.jpg";
import kidsTshirt from "../../assets/kidstshirt.jpg";

interface WishlistItemType {
  product_id: number;
  name: string;
  price: string | number;
  image: string;
  size?: string;
  color?: string;
  original_price?: string | number;
  stock_status?: string;
  category?: string;
}

interface WishlistProps {
  show: boolean;
  onHide: () => void;
}

const offcanvasVariants = {
  hidden: { x: "100%", opacity: 0 },
  visible: { x: 0, opacity: 1, transition: { duration: 0.4, ease: "easeOut" } },
  exit: {
    x: "100%",
    opacity: 0,
    transition: { duration: 0.4, ease: "easeOut" },
  },
};

const Wishlist: React.FC<WishlistProps> = ({ show, onHide }) => {
  const [wishlistItems, setWishlistItems] = useState<WishlistItemType[]>([
    {
      product_id: 1,
      name: "Men's Jacket",
      category: "Jackets",
      price: "4500.00",
      original_price: "6000.00",
      size: "M",
      color: "Blue",
      image: MensJacket,
      stock_status: "in_stock",
    },
    {
      product_id: 2,
      name: "Women's Summer Dress",
      category: "Dresses",
      price: "3200.00",
      size: "L",
      color: "Red",
      image: WomensSummerDress,
      stock_status: "in_stock",
    },
    {
      product_id: 3,
      name: "Kids T-Shirt",
      category: "T-Shirts",
      price: "800.00",
      color: "Green",
      image: kidsTshirt,
      stock_status: "out_of_stock",
    },
  ]);
  const [success, setSuccess] = useState<string | null>(null);
  const userId = 1;

  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const res = await fetch(
          `http://localhost:5000/api/products/wishlist?user_id=${userId}`
        );
        if (!res.ok) {
          throw new Error("Failed to load wishlist");
        }
        const data: WishlistItemType[] = await res.json();
        const parsedData = data.map((item) => ({
          ...item,
          price: parseFloat(item.price as string).toFixed(2),
          original_price: item.original_price
            ? parseFloat(item.original_price as string).toFixed(2)
            : undefined,
          image: item.image || MensJacket,
        }));
        setWishlistItems(parsedData);
        setSuccess("Wishlist loaded successfully!");
        setTimeout(() => setSuccess(null), 3000);
      } catch (err) {
        console.error("Fetch error:", err);
        // Fallback to static content
        setSuccess("Using static wishlist data (server offline)");
        setTimeout(() => setSuccess(null), 3000);
      }
    };
    fetchWishlist();
  }, []);

  const removeFromWishlist = (productId: number) => {
    try {
      fetch("http://localhost:5000/api/products/wishlist", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, userId }),
      })
        .then(async (res) => {
          if (!res.ok) {
            throw new Error("Failed to remove from wishlist");
          }
          setWishlistItems(
            wishlistItems.filter((item) => item.product_id !== productId)
          );
          setSuccess("Item removed from wishlist!");
          setTimeout(() => setSuccess(null), 3000);
        })
        .catch((err) => {
          console.error("Remove from wishlist error:", err);
          // Fallback to static remove
          setWishlistItems(
            wishlistItems.filter((item) => item.product_id !== productId)
          );
          setSuccess("Item removed (offline mode)");
          setTimeout(() => setSuccess(null), 3000);
        });
    } catch {
      setWishlistItems(
        wishlistItems.filter((item) => item.product_id !== productId)
      );
      setSuccess("Item removed (offline mode)");
      setTimeout(() => setSuccess(null), 3000);
    }
  };

  const addToCart = (productId: number) => {
    try {
      fetch("http://localhost:5000/api/products/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, userId, quantity: 1 }),
      })
        .then(async (res) => {
          if (!res.ok) {
            throw new Error("Failed to add to cart");
          }
          setSuccess("Item added to cart!");
          setTimeout(() => setSuccess(null), 3000);
        })
        .catch((err) => {
          console.error("Add to cart error:", err);
          // Fallback to static action
          setSuccess("Item added to cart (offline mode)");
          setTimeout(() => setSuccess(null), 3000);
        });
    } catch {
      setSuccess("Item added to cart (offline mode)");
      setTimeout(() => setSuccess(null), 3000);
    }
  };

  const wishlistContent = (
    <div className={styles.wishlistContainer}>
      <motion.h2
        className={styles.wishlistTitle}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <FaHeart /> Your Wishlist
      </motion.h2>
      <motion.p
        className={styles.wishlistSubtitle}
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        {wishlistItems.length} item{wishlistItems.length !== 1 ? "s" : ""} in
        your wishlist
      </motion.p>
      {success && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className={styles.alertContainer}
        >
          <Alert variant="success" className={styles.successAlert}>
            <FaCheck className={styles.alertIcon} /> {success}
          </Alert>
        </motion.div>
      )}
      {wishlistItems.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className={styles.emptyWishlist}
        >
          <FaBoxOpen className={styles.emptyIcon} />
          <p>Your wishlist is empty</p>
          <motion.a href="/products" className={styles.shopNowButton}>
            <FaShoppingCart className={styles.actionIcon} /> Shop Now
          </motion.a>
        </motion.div>
      ) : (
        <motion.div
          className={styles.wishlistItemsSection}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className={styles.wishlistItemsScroll}>
            {wishlistItems.map((item, index) => (
              <motion.div
                key={item.product_id}
                custom={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.03 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={styles.wishlistItem}
              >
                <span className={styles.itemNumber}>{index + 1}</span>
                <div className={styles.leftSection}>
                  <div className={styles.itemImageContainer}>
                    <img
                      src={item.image}
                      alt={item.name}
                      className={styles.itemImage}
                      onError={(e) => {
                        e.currentTarget.src = "https://placehold.co/150x150";
                      }}
                    />
                  </div>
                  <div className={styles.itemDetails}>
                    <span className={styles.itemName}>
                      {item.original_price && (
                        <span className={styles.saleTag}>
                          <FaHeart /> Sale
                        </span>
                      )}
                      {item.name}
                    </span>
                    <div className={styles.itemOptions}>
                      {item.category && (
                        <span className={styles.itemOption}>
                          <FaHeart /> {item.category}
                        </span>
                      )}
                      {item.size && (
                        <span className={styles.itemOption}>
                          <FaHeart /> Size: {item.size}
                        </span>
                      )}
                      {item.color && (
                        <span className={styles.itemOption}>
                          <FaHeart /> Color: {item.color}
                        </span>
                      )}
                      {item.stock_status === "out_of_stock" && (
                        <span className={styles.stockStatus}>
                          <FaHeart /> Out of stock
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className={styles.rightSection}>
                  <div className={styles.itemPricing}>
                    <span className={styles.itemPrice}>
                      KSh {parseFloat(item.price as string).toFixed(0)}
                    </span>
                    {item.original_price && (
                      <span className={styles.originalPrice}>
                        KSh{" "}
                        {parseFloat(item.original_price as string).toFixed(0)}
                      </span>
                    )}
                  </div>
                  <div className={styles.itemActions}>
                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => addToCart(item.product_id)}
                      className={styles.addToCartButton}
                      disabled={item.stock_status === "out_of_stock"}
                    >
                      <FaShoppingCart className={styles.actionIcon} /> Add to
                      Cart
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => removeFromWishlist(item.product_id)}
                      className={styles.removeButton}
                    >
                      <FaTrash className={styles.actionIcon} /> Remove
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );

  return (
    <AnimatePresence>
      {show ? (
        <motion.div
          variants={offcanvasVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          <Offcanvas
            show={show}
            onHide={onHide}
            placement="end"
            className={styles.wishlistOffcanvas}
          >
            <Offcanvas.Header closeButton className={styles.offcanvasHeader} />
            <Offcanvas.Body className={styles.offcanvasBody}>
              {wishlistContent}
            </Offcanvas.Body>
          </Offcanvas>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className={styles.fullPage}
        >
          {wishlistContent}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Wishlist;
