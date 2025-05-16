import { useEffect, useState } from "react";
import { Offcanvas, Stack, Button, Image } from "react-bootstrap";
import type { CartItem } from "../../types/types";
import styles from "./Cart.module.css";

interface CartProps {
  show: boolean;
  onHide: () => void;
}

export default function Cart({ show, onHide }: CartProps) {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    fetch("/products/cart?user_id=1")
      .then((res) => res.json())
      .then((data: CartItem[]) => setItems(data));
  }, []);

  const total = items.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  return (
    <Offcanvas show={show} onHide={onHide} placement="end">
      <Offcanvas.Header closeButton>
        <Offcanvas.Title>Your Cart</Offcanvas.Title>
      </Offcanvas.Header>
      <Offcanvas.Body>
        <Stack gap={3}>
          {items.map((item) => (
            <div key={item.product_id} className={styles.cartItem}>
              <Image src={item.image} alt={item.name} thumbnail width={80} />
              <div>
                <h5>{item.name}</h5>
                <div className="text-muted">
                  {item.quantity} x ${item.price}
                </div>
              </div>
            </div>
          ))}
          <div className={styles.total}>Total: ${total.toFixed(2)}</div>
          <Button variant="success">Checkout</Button>
        </Stack>
      </Offcanvas.Body>
    </Offcanvas>
  );
}
