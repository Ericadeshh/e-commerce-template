import { useState, useRef, useEffect } from "react";
import {
  FaBars,
  FaTimes,
  FaUser,
  FaQuestionCircle,
  FaShoppingCart,
  FaAngleRight,
  FaShopify,
  FaHome,
} from "react-icons/fa";
import { Link, useNavigate, useLocation } from "react-router-dom";
import styles from "./Header.module.css";

export default function Header() {
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<
    "account" | "help" | null
  >(null);
  const [hoverDropdown, setHoverDropdown] = useState<"account" | "help" | null>(
    null
  );
  const [activeMobileSection, setActiveMobileSection] = useState<
    "account" | "help" | null
  >(null);
  const accountRef = useRef<HTMLDivElement>(null);
  const helpRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const isLoggedIn = !!localStorage.getItem("token");
  const role = localStorage.getItem("role");

  const toggleMobileMenu = () => {
    setShowMobileMenu(!showMobileMenu);
    setActiveDropdown(null);
    setHoverDropdown(null);
    setActiveMobileSection(null);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/");
    setShowMobileMenu(false);
    setActiveDropdown(null);
    setActiveMobileSection(null);
  };

  const handleMobileLinkClick = (destination: string) => {
    setShowMobileMenu(false);
    setActiveDropdown(null);
    setHoverDropdown(null);
    setActiveMobileSection(null);
    navigate(destination);
  };

  const toggleMobileSection = (section: "account" | "help") => {
    setActiveMobileSection(activeMobileSection === section ? null : section);
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
          <Link to="/" className={styles.brand}>
            <FaShopify className={styles.brandIcon} />
            MILLIWIN BOUTIQUE
          </Link>

          {/* Search Bar and Hamburger for Mobile */}
          <div className={styles.searchWrapper}>
            <form
              className={styles.searchForm}
              onSubmit={(e) => e.preventDefault()}
            >
              <input
                type="search"
                placeholder="Search products, brands, categories..."
                className={styles.searchInput}
              />
              <button type="submit" className={styles.searchButton}>
                Search
              </button>
            </form>
            <button className={styles.hamburger} onClick={toggleMobileMenu}>
              <FaBars />
            </button>
          </div>

          {/* Search Bar for Desktop */}
          <form
            className={`${styles.searchForm} ${styles.desktopSearch}`}
            onSubmit={(e) => e.preventDefault()}
          >
            <input
              type="search"
              placeholder="Search products, brands, categories..."
              className={styles.searchInput}
            />
            <button type="submit" className={styles.searchButton}>
              Search
            </button>
          </form>

          {/* Desktop Navigation */}
          <nav className={styles.desktopNav}>
            <Link
              to="/"
              className={`${styles.navLink} ${
                location.pathname === "/" ? styles.active : ""
              }`}
            >
              <FaHome />
            </Link>
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
              <FaUser />
              {isDropdownVisible("account") && (
                <div className={styles.dropdown}>
                  {isLoggedIn ? (
                    <>
                      <Link
                        to={
                          role === "admin"
                            ? "/admin/dashboard"
                            : "/user/dashboard"
                        }
                        className={styles.dropdownItem}
                      >
                        Dashboard
                      </Link>
                      <Link to="/orders" className={styles.dropdownItem}>
                        Orders
                      </Link>
                      <Link to="/wishlist" className={styles.dropdownItem}>
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
                      <Link to="/login" className={styles.dropdownItem}>
                        Login
                      </Link>
                      <Link to="/signup" className={styles.dropdownItem}>
                        Signup
                      </Link>
                      <Link to="/account" className={styles.dropdownItem}>
                        My Account
                      </Link>
                      <Link to="/orders" className={styles.dropdownItem}>
                        Orders
                      </Link>
                      <Link to="/wishlist" className={styles.dropdownItem}>
                        Wishlist
                      </Link>
                    </>
                  )}
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
              <FaQuestionCircle />
              {isDropdownVisible("help") && (
                <div className={styles.dropdown}>
                  <Link to="/help-center" className={styles.dropdownItem}>
                    Help Center
                  </Link>
                  <Link to="/place-order" className={styles.dropdownItem}>
                    Place Your Order
                  </Link>
                  <Link to="/payment-options" className={styles.dropdownItem}>
                    Payment Options
                  </Link>
                  <Link to="/delivery" className={styles.dropdownItem}>
                    Delivery Timelines & Track Your Order
                  </Link>
                  <Link to="/returns" className={styles.dropdownItem}>
                    Returns & Refunds
                  </Link>
                  <Link to="/warranty" className={styles.dropdownItem}>
                    Warranty
                  </Link>
                </div>
              )}
            </div>
            <Link
              to="/cart"
              className={`${styles.navLink} ${
                location.pathname === "/cart" ? styles.active : ""
              }`}
            >
              <FaShoppingCart />
            </Link>
          </nav>
        </div>
      </header>

      {/* Mobile Menu */}
      <div
        className={`${styles.mobileMenu} ${showMobileMenu ? styles.show : ""}`}
      >
        <div className={styles.mobileMenuHeader}>
          <span>MILLIWIN BOUTIQUE</span>
          <button className={styles.closeButton} onClick={toggleMobileMenu}>
            <FaTimes />
          </button>
        </div>
        <nav className={styles.mobileNav}>
          <div className={styles.mobileNavSection}>
            <Link
              to="/"
              className={styles.mobileNavTitle}
              onClick={() => handleMobileLinkClick("/")}
            >
              <span>
                <FaHome /> Home
              </span>
            </Link>
          </div>
          <div className={styles.mobileNavSection}>
            <button
              className={styles.mobileNavTitle}
              onClick={() => toggleMobileSection("account")}
            >
              <span>
                <FaUser /> Account
              </span>
              <FaAngleRight
                className={`${styles.openIcon} ${
                  activeMobileSection === "account" ? styles.open : ""
                }`}
              />
            </button>
            {activeMobileSection === "account" && (
              <div className={styles.mobileDropdown}>
                {isLoggedIn ? (
                  <>
                    <Link
                      to={
                        role === "admin"
                          ? "/admin/dashboard"
                          : "/user/dashboard"
                      }
                      className={styles.mobileNavLink}
                      onClick={() =>
                        handleMobileLinkClick(
                          role === "admin"
                            ? "/admin/dashboard"
                            : "/user/dashboard"
                        )
                      }
                    >
                      Dashboard
                    </Link>
                    <Link
                      to="/orders"
                      className={styles.mobileNavLink}
                      onClick={() => handleMobileLinkClick("/orders")}
                    >
                      Orders
                    </Link>
                    <Link
                      to="/wishlist"
                      className={styles.mobileNavLink}
                      onClick={() => handleMobileLinkClick("/wishlist")}
                    >
                      Wishlist
                    </Link>
                    <button
                      onClick={handleLogout}
                      className={`${styles.mobileNavLink} ${styles.logoutButton}`}
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      to="/login"
                      className={styles.mobileNavLink}
                      onClick={() => handleMobileLinkClick("/login")}
                    >
                      Login
                    </Link>
                    <Link
                      to="/signup"
                      className={styles.mobileNavLink}
                      onClick={() => handleMobileLinkClick("/signup")}
                    >
                      Signup
                    </Link>
                    <Link
                      to="/account"
                      className={styles.mobileNavLink}
                      onClick={() => handleMobileLinkClick("/account")}
                    >
                      My Account
                    </Link>
                    <Link
                      to="/orders"
                      className={styles.mobileNavLink}
                      onClick={() => handleMobileLinkClick("/orders")}
                    >
                      Orders
                    </Link>
                    <Link
                      to="/wishlist"
                      className={styles.mobileNavLink}
                      onClick={() => handleMobileLinkClick("/wishlist")}
                    >
                      Wishlist
                    </Link>
                  </>
                )}
              </div>
            )}
          </div>
          <div className={styles.mobileNavSection}>
            <button
              className={styles.mobileNavTitle}
              onClick={() => toggleMobileSection("help")}
            >
              <span>
                <FaQuestionCircle /> Help
              </span>
              <FaAngleRight
                className={`${styles.openIcon} ${
                  activeMobileSection === "help" ? styles.open : ""
                }`}
              />
            </button>
            {activeMobileSection === "help" && (
              <div className={styles.mobileDropdown}>
                <Link
                  to="/help-center"
                  className={styles.mobileNavLink}
                  onClick={() => handleMobileLinkClick("/help-center")}
                >
                  Help Center
                </Link>
                <Link
                  to="/place-order"
                  className={styles.mobileNavLink}
                  onClick={() => handleMobileLinkClick("/place-order")}
                >
                  Place Your Order
                </Link>
                <Link
                  to="/payment-options"
                  className={styles.mobileNavLink}
                  onClick={() => handleMobileLinkClick("/payment-options")}
                >
                  Payment Options
                </Link>
                <Link
                  to="/delivery"
                  className={styles.mobileNavLink}
                  onClick={() => handleMobileLinkClick("/delivery")}
                >
                  Delivery Timelines & Track Your Order
                </Link>
                <Link
                  to="/returns"
                  className={styles.mobileNavLink}
                  onClick={() => handleMobileLinkClick("/returns")}
                >
                  Returns & Refunds
                </Link>
                <Link
                  to="/warranty"
                  className={styles.mobileNavLink}
                  onClick={() => handleMobileLinkClick("/warranty")}
                >
                  Warranty
                </Link>
              </div>
            )}
          </div>
          <div className={styles.mobileNavSection}>
            <Link
              to="/cart"
              className={styles.mobileNavTitle}
              onClick={() => handleMobileLinkClick("/cart")}
            >
              <span>
                <FaShoppingCart /> Cart
              </span>
              <FaAngleRight className={styles.openIcon} />
            </Link>
          </div>
        </nav>
      </div>
      {showMobileMenu && (
        <div className={styles.backdrop} onClick={toggleMobileMenu}></div>
      )}
    </>
  );
}
