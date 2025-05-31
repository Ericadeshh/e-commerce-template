import { FaHome, FaList, FaRegUser, FaRegHeart } from "react-icons/fa";
import { MdOutlineShoppingCart } from "react-icons/md";
import { Link } from "react-router-dom";
import styles from "./BottomFloatingButton.module.css";

export default function FloatingButtons() {
  return (
    <div className={styles.floatingContainer}>
      <Link to="/" className={styles.floatingButton}>
        <FaHome />
      </Link>
      <Link to="/categories" className={styles.floatingButton}>
        <FaList />
        <span>Categories</span>
      </Link>
      <Link to="/cart" className={styles.floatingButton}>
        <MdOutlineShoppingCart />
        <span>Cart</span>
      </Link>
      <Link to="/account" className={styles.floatingButton}>
        <FaRegUser />
        <span>Account</span>
      </Link>
      <Link to="/wishlist" className={styles.floatingButton}>
        <FaRegHeart />
        <span>Wishlist</span>
      </Link>
    </div>
  );
}
