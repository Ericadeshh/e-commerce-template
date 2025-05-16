import { useEffect, useState } from "react";
import { Navbar, Container, Nav, Badge, Spinner } from "react-bootstrap";
import { FaShoppingCart } from "react-icons/fa";
import type { CartItem } from "../../types/types";
import styles from "./Header.module.css";

interface HeaderProps {
  onCartClick: () => void;
}

export default function Header({ onCartClick }: HeaderProps) {
  const [cartCount, setCartCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    fetch("/products/cart?user_id=1")
      .then((res) => {
        if (!res.ok) throw new Error(`Failed to fetch cart: ${res.status}`);
        return res.json();
      })
      .then((data: CartItem[]) => {
        const total = data.reduce((acc, item) => acc + item.quantity, 0);
        setCartCount(total);
        setLoading(false);
      })
      .catch((err: Error) => {
        setError(`Error loading cart: ${err.message}`);
        setLoading(false);
        console.error("Fetch error:", err);
      });
  }, []);

  return (
    <Navbar
      bg="dark"
      variant="dark"
      expand="lg"
      className={styles.navbar}
      sticky="top"
    >
      <Container>
        <Navbar.Brand href="/" className={styles.brand}>
          E-Commerce
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            <Nav.Link
              onClick={onCartClick}
              className={styles.navLink}
              style={{ cursor: "pointer" }}
            >
              <FaShoppingCart size={20} />
              {loading ? (
                <Spinner animation="border" size="sm" className="ms-2" />
              ) : (
                <Badge bg="success" className={styles.badge}>
                  {cartCount}
                </Badge>
              )}
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
      {error && <div className={styles.error}>{error}</div>}
    </Navbar>
  );
}
