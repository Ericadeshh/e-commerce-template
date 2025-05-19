import { useState, useEffect } from "react";
import { Button, Card, Col, Row, Alert, Offcanvas } from "react-bootstrap";
import { motion, AnimatePresence } from "framer-motion";
import styles from "./Cart.module.css";

interface CartItem {
  product_id: number;
  quantity: number;
  name: string;
  price: string | number;
  image: string;
}

interface CartProps {
  show: boolean;
  onHide: () => void;
}

export default function Cart({ show, onHide }: CartProps) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const userId = 1;

  useEffect(() => {
    fetch(`http://localhost:5000/api/products/cart?user_id=${userId}`)
      .then(async (res) => {
        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(
            `Failed to load cart: ${res.status} - ${
              errorData.error || "Unknown error"
            }`
          );
        }
        return res.json();
      })
      .then((data: CartItem[]) => {
        const parsedData = data.map((item) => ({
          ...item,
          price: parseFloat(item.price as string).toFixed(2),
          image: item.image || "https://placehold.co/150x150",
        }));
        setCartItems(parsedData);
      })
      .catch((err: Error) => {
        console.error("Fetch error:", err);
        setError(err.message);
      });
  }, []);

  const removeFromCart = (productId: number) => {
    fetch("http://localhost:5000/api/products/cart", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId, userId }),
    })
      .then(async (res) => {
        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(
            `Failed to remove from cart: ${res.status} - ${
              errorData.error || "Unknown error"
            }`
          );
        }
        setCartItems(cartItems.filter((item) => item.product_id !== productId));
      })
      .catch((err: Error) => {
        console.error("Remove from cart error:", err);
        setError(err.message);
      });
  };

  const totalPrice = cartItems.reduce((total, item) => {
    const price =
      typeof item.price === "string" ? parseFloat(item.price) : item.price;
    return total + price * item.quantity;
  }, 0);

  const cartContent = (
    <div className={styles.cart}>
      <motion.h2
        className={styles.cartTitle}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{ color: "#9400D3" }}
      >
        Your Cart
      </motion.h2>
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Alert variant="danger">{error}</Alert>
        </motion.div>
      )}
      {cartItems.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Alert variant="info">Your cart is empty</Alert>
        </motion.div>
      ) : (
        <>
          <Row xs={1} md={2} lg={3} className="g-4">
            {cartItems.map((item, index) => (
              <Col key={item.product_id}>
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.2 }}
                >
                  <Card className={styles.cartItem}>
                    <Card.Img
                      variant="top"
                      src={item.image}
                      alt={item.name}
                      className={styles.cartImage}
                      onError={(e) => {
                        e.currentTarget.src = "https://placehold.co/150x150";
                      }}
                    />
                    <Card.Body>
                      <Card.Title style={{ color: "#9400D3" }}>
                        {item.name}
                      </Card.Title>
                      <Card.Text>
                        Price: $
                        {(typeof item.price === "string"
                          ? parseFloat(item.price)
                          : item.price
                        ).toFixed(2)}
                      </Card.Text>
                      <Card.Text>Quantity: {item.quantity}</Card.Text>
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 0.3 }}
                      >
                        <Button
                          variant="danger"
                          onClick={() => removeFromCart(item.product_id)}
                          style={{
                            backgroundColor: "#FF1493",
                            borderColor: "#FF1493",
                          }}
                        >
                          Remove
                        </Button>
                      </motion.div>
                    </Card.Body>
                  </Card>
                </motion.div>
              </Col>
            ))}
          </Row>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <h3 className={styles.total} style={{ color: "#DDA0DD" }}>
              Total: ${totalPrice.toFixed(2)}
            </h3>
            <motion.div
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
            >
              <Button
                href="/checkout"
                style={{
                  backgroundColor: "#9400D3",
                  borderColor: "#9400D3",
                }}
              >
                Proceed to Checkout
              </Button>
            </motion.div>
          </motion.div>
        </>
      )}
    </div>
  );

  return show ? (
    <AnimatePresence>
      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
      >
        <Offcanvas
          show={show}
          onHide={onHide}
          placement="end"
          style={{ backgroundColor: "#E6E6FA" }}
          className={styles.cartOffcanvas}
        >
          <Offcanvas.Header closeButton>
            <Offcanvas.Title style={{ color: "#9400D3" }}>
              Your Cart
            </Offcanvas.Title>
          </Offcanvas.Header>
          <Offcanvas.Body>{cartContent}</Offcanvas.Body>
        </Offcanvas>
      </motion.div>
    </AnimatePresence>
  ) : (
    cartContent
  );
}
