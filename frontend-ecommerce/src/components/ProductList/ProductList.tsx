import { useEffect, useState } from "react";
import { Row, Col, Card, Button } from "react-bootstrap";
import styles from "./ProductList.module.css";
import type { Product } from "../../types/types";

export default function ProductList() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/products")
      .then((res) => res.json())
      .then((data) => {
        setProducts(data);
        setLoading(false);
      });
  }, []);

  const addToCart = (productId: number) => {
    fetch("/products/cart", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId, userId: 1 }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to add to cart");
        // Update cart count globally (you might want to use context/state management)
      })
      .catch((err) => console.error(err));
  };

  if (loading) return <div>Loading...</div>;

  return (
    <Row className={styles.productGrid}>
      {products.map((product) => (
        <Col key={product.id} md={4} className="mb-4">
          <Card className={styles.productCard}>
            <Card.Img variant="top" src={product.image} />
            <Card.Body>
              <Card.Title>{product.name}</Card.Title>
              <Card.Text>${product.price}</Card.Text>
              <Button
                variant="primary"
                onClick={() => addToCart(product.id)}
                disabled={product.stock === 0}
              >
                {product.stock > 0 ? "Add to Cart" : "Out of Stock"}
              </Button>
            </Card.Body>
          </Card>
        </Col>
      ))}
    </Row>
  );
}
