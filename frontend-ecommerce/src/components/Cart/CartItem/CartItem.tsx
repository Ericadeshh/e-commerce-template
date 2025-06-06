import { motion } from "framer-motion";
import { FaTag, FaMinus, FaPlus, FaTrash, FaBookmark } from "react-icons/fa";
import styles from "./CartItem.module.css";

interface CartItemProps {
  item: {
    product_id: number;
    quantity: number;
    name: string;
    price: string | number;
    image: string;
    size?: string;
    color?: string;
    original_price?: string | number;
    stock_status?: string;
    category?: string;
  };
  index: number;
  updateQuantity: (productId: number, newQuantity: number) => void;
  removeFromCart: (productId: number) => void;
  saveItem: (productId: number) => void;
}

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.1, ease: "easeOut" },
  }),
  hover: { scale: 1.03, transition: { duration: 0.2, ease: "easeOut" } },
};

const buttonVariants = {
  hover: { scale: 1.03, transition: { duration: 0.2, ease: "easeOut" } },
  tap: { scale: 0.97, transition: { duration: 0.2, ease: "easeOut" } },
};

const CartItem: React.FC<CartItemProps> = ({
  item,
  index,
  updateQuantity,
  removeFromCart,
  saveItem,
}) => {
  return (
    <motion.div
      key={item.product_id}
      custom={index}
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover="hover"
      className={styles.cartItem}
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
                <FaTag /> Sale
              </span>
            )}
            {item.name}
          </span>
          <div className={styles.itemOptions}>
            {item.category && (
              <span className={styles.itemOption}>
                <FaTag /> {item.category}
              </span>
            )}
            {item.size && (
              <span className={styles.itemOption}>
                <FaTag /> Size: {item.size}
              </span>
            )}
            {item.color && (
              <span className={styles.itemOption}>
                <FaTag /> Color: {item.color}
              </span>
            )}
            {item.stock_status === "out_of_stock" && (
              <span className={styles.stockStatus}>
                <FaTag /> Out of stock
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
              KSh {parseFloat(item.original_price as string).toFixed(0)}
            </span>
          )}
          <div className={styles.quantityControl}>
            <motion.button
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
              onClick={() => updateQuantity(item.product_id, item.quantity - 1)}
              className={styles.quantityButtonMinus}
              disabled={item.quantity <= 1}
            >
              <FaMinus className={styles.actionIcon} />
            </motion.button>
            <span className={styles.quantity}>{item.quantity}</span>
            <motion.button
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
              onClick={() => updateQuantity(item.product_id, item.quantity + 1)}
              className={styles.quantityButtonPlus}
            >
              <FaPlus className={styles.actionIcon} />
            </motion.button>
          </div>
        </div>
        <div className={styles.itemActions}>
          <motion.button
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
            onClick={() => removeFromCart(item.product_id)}
            className={styles.removeButton}
          >
            <FaTrash className={styles.actionIcon} /> Remove
          </motion.button>
          <motion.button
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
            onClick={() => saveItem(item.product_id)}
            className={styles.saveButton}
          >
            <FaBookmark className={styles.actionIcon} /> Save
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default CartItem;
