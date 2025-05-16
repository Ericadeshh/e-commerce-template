import { useEffect, useState } from "react";
import { Navbar, Container, Nav, Badge } from "react-bootstrap";
import type { CartItem } from "../../types/types";
import styles from "./Header.module.css";

interface HeaderProps {
  onCartClick: () => void;
}

export default function Header({ onCartClick }: HeaderProps) {
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    fetch("/products/cart?user_id=1")
      .then((res) => res.json())
      .then((data: CartItem[]) => {
        const total = data.reduce(
          (acc: number, item) => acc + item.quantity,
          0
        );
        setCartCount(total);
      });
  }, []);

  return (
    <Navbar bg="dark" variant="dark" expand="lg" className={styles.navbar}>
      <Container>
        <Navbar.Brand href="/">E-Commerce</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            <Nav.Link
              onClick={onCartClick}
              className={styles.navLink}
              style={{ cursor: "pointer" }}
            >
              Cart <Badge bg="secondary">{cartCount}</Badge>
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
