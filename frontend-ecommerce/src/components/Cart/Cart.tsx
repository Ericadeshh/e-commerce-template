import { useState, useEffect } from "react";
import { Button, Card, Col, Row, Alert, Offcanvas } from "react-bootstrap";
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
  const userId = 1; // Sample user from ecommerce_db.js

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
          price: parseFloat(item.price as string),
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

  return (
    <Offcanvas
      show={show}
      onHide={onHide}
      placement="end"
      style={{ backgroundColor: "#E6E6FA" }}
    >
      {" "}
      {/* Lavender */}
      <Offcanvas.Header closeButton>
        <Offcanvas.Title style={{ color: "#A1DC17" }}>
          Your Cart
        </Offcanvas.Title>{" "}
        {/* Limelight */}
      </Offcanvas.Header>
      <Offcanvas.Body>
        <div className={styles.cart}>
          {error && <Alert variant="danger">{error}</Alert>}
          {cartItems.length === 0 ? (
            <Alert variant="info">Your cart is empty</Alert>
          ) : (
            <>
              <Row xs={1} md={2} lg={3} className="g-4">
                {cartItems.map((item) => (
                  <Col key={item.product_id}>
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
                        </Card.Title>{" "}
                        {/* Purple */}
                        <Card.Text>
                          Price: $
                          {(typeof item.price === "string"
                            ? parseFloat(item.price)
                            : item.price
                          ).toFixed(2)}
                        </Card.Text>
                        <Card.Text>Quantity: {item.quantity}</Card.Text>
                        <Button
                          variant="danger"
                          onClick={() => removeFromCart(item.product_id)}
                          style={{
                            backgroundColor: "#FF1493",
                            borderColor: "#FF1493",
                          }} // Fuchsia Pink
                        >
                          Remove
                        </Button>
                      </Card.Body>
                    </Card>
                  </Col>
                ))}
              </Row>
              <h3 className={styles.total} style={{ color: "#DDA0DD" }}>
                Total: ${totalPrice.toFixed(2)}
              </h3>{" "}
              {/* Plum */}
            </>
          )}
        </div>
      </Offcanvas.Body>
    </Offcanvas>
  );
}
