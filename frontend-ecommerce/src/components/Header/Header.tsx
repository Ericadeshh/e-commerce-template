import { useState, useRef, useEffect } from "react";
import {
  FaBars,
  FaTimes,
  FaUser,
  FaQuestionCircle,
  FaShoppingCart,
  FaAngleRight,
} from "react-icons/fa";
import styles from "./Header.module.css";
import logo from "../../assets/e-commerceLogo.jpeg";
interface HeaderProps {
  onCartClick: () => void;
}

export default function Header({ onCartClick }: HeaderProps) {
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<
    "account" | "help" | null
  >(null);
  const [hoverDropdown, setHoverDropdown] = useState<"account" | "help" | null>(
    null
  );
  const accountRef = useRef<HTMLDivElement>(null);
  const helpRef = useRef<HTMLDivElement>(null);

  const toggleMobileMenu = () => {
    setShowMobileMenu(!showMobileMenu);
    setActiveDropdown(null);
    setHoverDropdown(null);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (
      accountRef.current &&
      !accountRef.current.contains(event.target as Node) &&
      helpRef.current &&
      !helpRef.current.contains(event.target as Node)
    ) {
      setActiveDropdown(null);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const isDropdownVisible = (type: "account" | "help") => {
    return activeDropdown === type || hoverDropdown === type;
  };

  return (
    <>
      <header className={styles.header}>
        <div className={styles.container}>
          {/* Logo and Brand */}
          <a href="/" className={styles.brand}>
            <img src={logo} alt="E-commerce Logo" className={styles.logo} />
            E-commerce
          </a>

          {/* Search Bar */}
          <form className={styles.searchForm}>
            <input
              type="search"
              placeholder="Search products, brands, categories..."
              className={styles.searchInput}
            />
            <button type="submit" className={styles.searchButton}>
              Search
            </button>
          </form>

          {/* Hamburger for Mobile */}
          <button className={styles.hamburger} onClick={toggleMobileMenu}>
            <FaBars />
          </button>

          {/* Desktop Navigation */}
          <nav className={styles.desktopNav}>
            <div
              className={`${styles.navLink} ${
                activeDropdown === "account" ? styles.active : ""
              }`}
              ref={accountRef}
              onMouseEnter={() => setHoverDropdown("account")}
              onMouseLeave={() => setHoverDropdown(null)}
              onClick={() =>
                setActiveDropdown(
                  activeDropdown === "account" ? null : "account"
                )
              }
            >
              <FaUser /> Account
              {isDropdownVisible("account") && (
                <div className={styles.dropdown}>
                  <a href="/login" className={styles.dropdownItem}>
                    Login/Signup
                  </a>
                  <a href="/account" className={styles.dropdownItem}>
                    My Account
                  </a>
                  <a href="/orders" className={styles.dropdownItem}>
                    Orders
                  </a>
                  <a href="/wishlist" className={styles.dropdownItem}>
                    Wishlist
                  </a>
                </div>
              )}
            </div>
            <div
              className={`${styles.navLink} ${
                activeDropdown === "help" ? styles.active : ""
              }`}
              ref={helpRef}
              onMouseEnter={() => setHoverDropdown("help")}
              onMouseLeave={() => setHoverDropdown(null)}
              onClick={() =>
                setActiveDropdown(activeDropdown === "help" ? null : "help")
              }
            >
              <FaQuestionCircle /> Help
              {isDropdownVisible("help") && (
                <div className={styles.dropdown}>
                  <a href="/help-center" className={styles.dropdownItem}>
                    Help Center
                  </a>
                  <a href="/place-order" className={styles.dropdownItem}>
                    Place Your Order
                  </a>
                  <a href="/payment-options" className={styles.dropdownItem}>
                    Payment Options
                  </a>
                  <a href="/delivery" className={styles.dropdownItem}>
                    Delivery Timelines & Track Your Order
                  </a>
                  <a href="/returns" className={styles.dropdownItem}>
                    Returns & Refunds
                  </a>
                  <a href="/warranty" className={styles.dropdownItem}>
                    Warranty
                  </a>
                </div>
              )}
            </div>
            <button className={styles.navLink} onClick={onCartClick}>
              <FaShoppingCart /> Cart
            </button>
          </nav>
        </div>
      </header>

      {/* Mobile Menu */}
      <div
        className={`${styles.mobileMenu} ${showMobileMenu ? styles.show : ""}`}
      >
        <div className={styles.mobileMenuHeader}>
          <span>E-commerce</span>
          <button className={styles.closeButton} onClick={toggleMobileMenu}>
            <FaTimes />
          </button>
        </div>
        <nav className={styles.mobileNav}>
          <button
            className={styles.mobileNavLink}
            onClick={() =>
              setActiveDropdown(activeDropdown === "account" ? null : "account")
            }
          >
            <span>
              <FaUser /> Account
            </span>
            <FaAngleRight className={styles.openIcon} />
          </button>
          {activeDropdown === "account" && (
            <div className={styles.mobileDropdown}>
              <a href="/login" className={styles.dropdownItem}>
                Login/Signup
              </a>
              <a href="/account" className={styles.dropdownItem}>
                My Account
              </a>
              <a href="/orders" className={styles.dropdownItem}>
                Orders
              </a>
              <a href="/wishlist" className={styles.dropdownItem}>
                Wishlist
              </a>
            </div>
          )}
          <button
            className={styles.mobileNavLink}
            onClick={() =>
              setActiveDropdown(activeDropdown === "help" ? null : "help")
            }
          >
            <span>
              <FaQuestionCircle /> Help
            </span>
            <FaAngleRight className={styles.openIcon} />
          </button>
          {activeDropdown === "help" && (
            <div className={styles.mobileDropdown}>
              <a href="/help-center" className={styles.dropdownItem}>
                Help Center
              </a>
              <a href="/place-order" className={styles.dropdownItem}>
                Place Your Order
              </a>
              <a href="/payment-options" className={styles.dropdownItem}>
                Payment Options
              </a>
              <a href="/delivery" className={styles.dropdownItem}>
                Delivery Timelines & Track Your Order
              </a>
              <a href="/returns" className={styles.dropdownItem}>
                Returns & Refunds
              </a>
              <a href="/warranty" className={styles.dropdownItem}>
                Warranty
              </a>
            </div>
          )}
          <button className={styles.mobileNavLink} onClick={onCartClick}>
            <span>
              <FaShoppingCart /> Cart
            </span>
            <FaAngleRight className={styles.openIcon} />
          </button>
        </nav>
      </div>
      {showMobileMenu && (
        <div className={styles.backdrop} onClick={toggleMobileMenu}></div>
      )}
    </>
  );
}
