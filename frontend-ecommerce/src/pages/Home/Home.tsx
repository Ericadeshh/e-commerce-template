import { useState, useEffect } from "react";
import { Button, Card, Col, Row } from "react-bootstrap";
import HeroSection from "../../components/HeroSection/HeroSection";
import FeaturedProducts from "../../components/FeaturedProducts/FeaturedProducts";
import styles from "./Home.module.css";
import { motion } from "framer-motion";

interface Product {
  id: number;
  name: string;
  price: number;
  original_price?: number | null;
  discount_percentage?: number | null;
  stock: number;
  category: string;
  image: string;
  is_new?: boolean;
}

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("http://localhost:5000/api/products?featured=true")
      .then(async (res) => {
        if (!res.ok) throw new Error(`Failed to fetch products: ${res.status}`);
        return res.json();
      })
      .then((data: Product[]) => {
        setFeaturedProducts(
          data.map((product) => ({
            ...product,
            image: product.image || "https://placehold.co/300x300",
            price: parseFloat(String(product.price)),
            original_price: product.original_price
              ? parseFloat(String(product.original_price))
              : null,
            stock: Number(product.stock),
            discount_percentage: product.discount_percentage
              ? Number(product.discount_percentage)
              : null,
          }))
        );
        setError(null);
      })
      .catch((err) => {
        console.error("Error fetching products:", err);
        setError("Failed to load products. Showing static content.");
      });
  }, []);

  return (
    <div className={styles.home}>
      <HeroSection />
      {error && <div className={styles.error}>{error}</div>}

      {/* Featured Products */}
      <FeaturedProducts />

      {/* Featured Categories */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Featured Categories</h2>
        <Row xs={1} md={3} className="g-4">
          {["Women's", "Men's", "Children's", "Beddings", "Shoes"].map(
            (category) => (
              <Col key={category}>
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <Card className={styles.categoryCard}>
                    <Card.Body>
                      <Card.Title className={styles.categoryTitle}>
                        {category}
                      </Card.Title>
                      <Button
                        className={styles.categoryCta}
                        href={`/products?category=${category.toLowerCase()}`}
                        style={{
                          backgroundColor: "#FF1493",
                          borderColor: "#FF1493",
                        }}
                      >
                        Shop Now
                      </Button>
                    </Card.Body>
                  </Card>
                </motion.div>
              </Col>
            )
          )}
        </Row>
      </section>

      {/* New Arrivals */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>New Arrivals</h2>
        <Row xs={1} md={3} className="g-4">
          {featuredProducts
            .filter((product: Product) => product.id % 2 === 0)
            .slice(0, 3)
            .map((product: Product) => (
              <Col key={product.id}>
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <Card className={styles.productCard}>
                    <div className={styles.imageWrapper}>
                      <Card.Img
                        variant="top"
                        src={product.image}
                        alt={product.name}
                        className={styles.productImage}
                        onError={(e) => {
                          e.currentTarget.src = "https://placehold.co/300x300";
                        }}
                      />
                      {product.discount_percentage && (
                        <div className={styles.discountBadge}>
                          {product.discount_percentage}% Off
                        </div>
                      )}
                      {product.is_new && (
                        <div className={styles.newBadge}>New</div>
                      )}
                    </div>
                    <Card.Body>
                      <div className={styles.categoryTag}>
                        {product.category.charAt(0).toUpperCase() +
                          product.category.slice(1)}
                      </div>
                      <Card.Title className={styles.productName}>
                        {product.name}
                      </Card.Title>
                      <div className={styles.priceContainer}>
                        <span className={styles.productPrice}>
                          ${product.price.toFixed(2)}
                        </span>
                        {product.original_price && (
                          <span className={styles.originalPrice}>
                            ${product.original_price.toFixed(2)}
                          </span>
                        )}
                      </div>
                      <Card.Text className={styles.stockStatus}>
                        {product.stock <= 0
                          ? "Out of Stock"
                          : product.stock <= 5
                          ? `Only ${product.stock} Left!`
                          : "In Stock"}
                      </Card.Text>
                      <div className={styles.buttonGroup}>
                        <Button
                          className={styles.productCta}
                          href={`/products/${product.id}`}
                          style={{
                            backgroundColor: "#9400D3",
                            borderColor: "#9400D3",
                          }}
                        >
                          View Details
                        </Button>
                        <Button
                          className={styles.cartCta}
                          disabled={product.stock <= 0}
                          onClick={() => alert("Add to cart functionality TBD")}
                          style={{
                            backgroundColor: "#FF1493",
                            borderColor: "#FF1493",
                          }}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="white"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            style={{ marginRight: "0.5rem" }}
                          >
                            <circle cx="9" cy="21" r="1" />
                            <circle cx="20" cy="21" r="1" />
                            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                          </svg>
                          Add to Cart
                        </Button>
                      </div>
                    </Card.Body>
                  </Card>
                </motion.div>
              </Col>
            ))}
        </Row>
      </section>
    </div>
  );
}
