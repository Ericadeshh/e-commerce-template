import { useEffect, useState } from "react";
import { Container, Carousel, Alert } from "react-bootstrap";
import ProductList from "../../components/ProductList/ProductList";
import { Product } from "../../types/types";
import styles from "./LandingPage.module.css";

export default function LandingPage() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("http://localhost:5000/api/products?featured=true")
      .then(async (res) => {
        if (!res.ok) {
          const errorData = await res.json();
          console.log("LandingPage fetch error response:", errorData);
          throw new Error(`Failed to load featured products: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => setFeaturedProducts(data))
      .catch((err) => {
        setError(err.message);
        console.error("Fetch error:", err);
      });
  }, []);

  return (
    <div className={styles.landingPage}>
      <Container>
        <h1 className={styles.title}>Welcome to Our Store</h1>
        {error && <Alert variant="danger">{error}</Alert>}
        {featuredProducts.length > 0 ? (
          <Carousel className={styles.carousel}>
            {featuredProducts.map((product) => (
              <Carousel.Item key={product.id}>
                <img
                  className={styles.carouselImage}
                  src={product.image}
                  alt={product.name}
                />
                <Carousel.Caption>
                  <h3>{product.name}</h3>
                  <p>Price: ${product.price}</p>
                </Carousel.Caption>
              </Carousel.Item>
            ))}
          </Carousel>
        ) : (
          <p>No featured products available.</p>
        )}
        <ProductList />
      </Container>
    </div>
  );
}
