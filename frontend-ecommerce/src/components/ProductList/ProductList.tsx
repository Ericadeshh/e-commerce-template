import { useEffect, useState } from "react";
import { Card, Button, Row, Col, Spinner, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import type { Product } from "../../types/types";
import styles from "./ProductList.module.css";

export default function ProductList() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    fetch("http://localhost:5000/api/products")
      .then(async (res) => {
        if (!res.ok) {
          const errorData = await res.json();
          console.log("ProductList fetch error response:", errorData);
          throw new Error(`Failed to load products: ${res.status}`);
        }
        return res.json();
      })
      .then((data: Product[]) => {
        setProducts(data);
        setLoading(false);
      })
      .catch((err: Error) => {
        setError(`Error loading products: ${err.message}`);
        setLoading(false);
        console.error("Fetch error:", err);
      });
  }, []);

  const addToCart = (productId: number) => {
    fetch("http://localhost:5000/api/cart", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId, userId: 1 }),
    })
      .then((res) => {
        if (!res.ok) throw new Error(`Failed to add to cart: ${res.status}`);
        navigate("/cart");
      })
      .catch((err: Error) => {
        setError(`Error adding to cart: ${err.message}`);
        console.error("Add to cart error:", err);
      });
  };

  if (loading) {
    return <Spinner animation="border" className="d-block mx-auto mt-4" />;
  }

  if (error) {
    return (
      <Alert variant="danger" className="mt-4">
        {error}
      </Alert>
    );
  }

  if (products.length === 0) {
    return (
      <Alert variant="info" className="mt-4">
        No products available
      </Alert>
    );
  }

  return (
    <Row xs={1} md={2} lg={3} className="g-4">
      {products.map((product) => (
        <Col key={product.id}>
          <Card className={styles.productCard}>
            <Card.Img
              variant="top"
              src={product.image || "/placeholder-product.jpg"}
              alt={product.name}
              className={styles.productImage}
            />
            <Card.Body>
              <Card.Title className={styles.productTitle}>
                {product.name}
              </Card.Title>
              <Card.Text className={styles.productDescription}>
                {product.description || "No description available"}
              </Card.Text>
              <Card.Text className={styles.productPrice}>
                $
                {typeof product.price === "string"
                  ? parseFloat(product.price).toFixed(2)
                  : product.price.toFixed(2)}
              </Card.Text>
              <Button
                variant="primary"
                onClick={() => addToCart(product.id)}
                disabled={product.stock === 0}
                className={styles.addButton}
              >
                {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
              </Button>
            </Card.Body>
          </Card>
        </Col>
      ))}
    </Row>
  );
}
