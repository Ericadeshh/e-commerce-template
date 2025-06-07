import { useState, useRef, useEffect } from "react";
import { FaHome, FaList, FaRegUser, FaRegHeart } from "react-icons/fa";
import { MdOutlineShoppingCart } from "react-icons/md";
import { Link, useNavigate } from "react-router-dom";
import styles from "./BottomFloatingButton.module.css";

export default function FloatingButtons() {
  const [showAccountDropdown, setShowAccountDropdown] = useState(false);
  const accountRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem("token");
  const role = localStorage.getItem("role");

  const toggleAccountDropdown = () => {
    setShowAccountDropdown((prev) => !prev);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/");
    setShowAccountDropdown(false);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (
      accountRef.current &&
      !accountRef.current.contains(event.target as Node)
    ) {
      setShowAccountDropdown(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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
      <div
        className={styles.floatingButton}
        ref={accountRef}
        onClick={toggleAccountDropdown}
      >
        <FaRegUser />
        <span>Account</span>
        {showAccountDropdown && (
          <div className={styles.dropdown}>
            {isLoggedIn ? (
              <>
                <Link
                  to={role === "admin" ? "/admin/dashboard" : "/user/dashboard"}
                  className={styles.dropdownItem}
                  onClick={() => setShowAccountDropdown(false)}
                >
                  Dashboard
                </Link>
                <Link
                  to="/track-order"
                  className={styles.dropdownItem}
                  onClick={() => setShowAccountDropdown(false)}
                >
                  Track Order
                </Link>
                <Link
                  to="/wishlist"
                  className={styles.dropdownItem}
                  onClick={() => setShowAccountDropdown(false)}
                >
                  Wishlist
                </Link>
                <button
                  onClick={handleLogout}
                  className={`${styles.dropdownItem} ${styles.logoutButton}`}
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className={styles.dropdownItem}
                  onClick={() => setShowAccountDropdown(false)}
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className={styles.dropdownItem}
                  onClick={() => setShowAccountDropdown(false)}
                >
                  Signup
                </Link>
                <Link
                  to="/track-order"
                  className={styles.dropdownItem}
                  onClick={() => setShowAccountDropdown(false)}
                >
                  Track Order
                </Link>
                <Link
                  to="/wishlist"
                  className={styles.dropdownItem}
                  onClick={() => setShowAccountDropdown(false)}
                >
                  Wishlist
                </Link>
              </>
            )}
          </div>
        )}
      </div>
      <Link to="/wishlist" className={styles.floatingButton}>
        <FaRegHeart />
        <span>Wishlist</span>
      </Link>
    </div>
  );
}
