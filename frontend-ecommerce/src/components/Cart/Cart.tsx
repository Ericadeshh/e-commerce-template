import { useEffect, useState } from "react";
import {
  Offcanvas,
  Stack,
  Button,
  Image,
  Spinner,
  Alert,
} from "react-bootstrap";
import { FaTrash } from "react-icons/fa";
import type { CartItem } from "../../types/types";
import styles from "./Cart.module.css";

interface CartProps {
  show: boolean;
  onHide: () => void;
}

export default function Cart({ show, onHide }: CartProps) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    fetch("http://localhost:5000/api/cart?user_id=1")
      .then((res) => {
        if (!res.ok) throw new Error(`Failed to load cart: ${res.status}`);
        return res.json();
      })
      .then((data: CartItem[]) => {
        setItems(data);
        setLoading(false);
      })
      .catch((err: Error) => {
        setError(`Error loading cart: ${err.message}`);
        setLoading(false);
        console.error("Fetch error:", err);
      });
  }, []);

  const removeFromCart = (productId: number) => {
    fetch("http://localhost:5000/api/cart", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId, userId: 1 }),
    })
      .then((res) => {
        if (!res.ok)
          throw new Error(`Failed to remove from cart: ${res.status}`);
        setItems(items.filter((item) => item.product_id !== productId));
      })
      .catch((err: Error) => {
        setError(`Error removing from cart: ${err.message}`);
        console.error("Remove error:", err);
      });
  };

  const total = items.reduce((acc, item) => {
    const price =
      typeof item.price === "string" ? parseFloat(item.price) : item.price;
    return acc + price * item.quantity;
  }, 0);

  return (
    <Offcanvas
      show={show}
      onHide={onHide}
      placement="end"
      className={styles.offcanvas}
    >
      <Offcanvas.Header closeButton>
        <Offcanvas.Title className={styles.title}>Your Cart</Offcanvas.Title>
      </Offcanvas.Header>
      <Offcanvas.Body>
        {loading ? (
          <Spinner animation="border" className="d-block mx-auto" />
        ) : error ? (
          <Alert variant="danger">{error}</Alert>
        ) : items.length === 0 ? (
          <Alert variant="info">Your cart is empty</Alert>
        ) : (
          <Stack gap={3}>
            {items.map((item) => (
              <div key={item.product_id} className={styles.cartItem}>
                <Image
                  src={item.image || "/placeholder-product.jpg"}
                  alt={item.name}
                  thumbnail
                  width={80}
                  height={80}
                  className={styles.cartImage}
                />
                <div className={styles.itemDetails}>
                  <h5>{item.name}</h5>
                  <div className="text-muted">
                    {item.quantity} x $
                    {typeof item.price === "string"
                      ? parseFloat(item.price).toFixed(2)
                      : item.price.toFixed(2)}
                  </div>
                </div>
                <Button
                  variant="outline-danger"
                  size="sm"
                  onClick={() => removeFromCart(item.product_id)}
                  className={styles.removeButton}
                >
                  <FaTrash />
                </Button>
              </div>
            ))}
            <div className={styles.total}>Total: ${total.toFixed(2)}</div>
            <Button variant="success" className={styles.checkoutButton}>
              Checkout
            </Button>
          </Stack>
        )}
      </Offcanvas.Body>
    </Offcanvas>
  );
}
