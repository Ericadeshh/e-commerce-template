import { useEffect, useState } from "react";
import { Carousel, Container, Alert, Spinner } from "react-bootstrap";
import type { Product } from "../types/types";
import ProductList from "../components/ProductList/ProductList";
import styles from "./LandingPage.module.css";

export default function LandingPage() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    fetch("/products?featured=true")
      .then((res) => {
        if (!res.ok)
          throw new Error(`Failed to load featured products: ${res.status}`);
        return res.json();
      })
      .then((data: Product[]) => {
        setFeaturedProducts(data);
        setLoading(false);
      })
      .catch((err: Error) => {
        setError(`Error loading featured products: ${err.message}`);
        setLoading(false);
        console.error("Fetch error:", err);
      });
  }, []);

  return (
    <Container fluid className={styles.container}>
      {loading ? (
        <Spinner animation="border" className="d-block mx-auto mt-4" />
      ) : error ? (
        <Alert variant="danger" className="mt-4">
          {error}
        </Alert>
      ) : (
        <Carousel className={styles.carousel} interval={5000}>
          {featuredProducts.length === 0 ? (
            <Carousel.Item className={styles.carouselItem}>
              <img
                className="d-block w-100"
                src="/placeholder-product.jpg"
                alt="No featured products"
              />
              <Carousel.Caption className={styles.carouselCaption}>
                <h3>No Featured Products</h3>
                <p>Check back later for new items!</p>
              </Carousel.Caption>
            </Carousel.Item>
          ) : (
            featuredProducts.map((product) => (
              <Carousel.Item key={product.id} className={styles.carouselItem}>
                <img
                  className="d-block w-100"
                  src={product.image || "/placeholder-product.jpg"}
                  alt={product.name}
                />
                <Carousel.Caption className={styles.carouselCaption}>
                  <h3>{product.name}</h3>
                  <p>
                    $
                    {typeof product.price === "string"
                      ? parseFloat(product.price).toFixed(2)
                      : product.price.toFixed(2)}
                  </p>
                </Carousel.Caption>
              </Carousel.Item>
            ))
          )}
        </Carousel>
      )}

      <section className={styles.featuredSection}>
        <h2 className={styles.heading}>Our Products</h2>
        <ProductList />
      </section>
    </Container>
  );
}
