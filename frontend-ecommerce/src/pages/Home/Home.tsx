import { useEffect, useState } from "react";
import { Container, Carousel, Alert } from "react-bootstrap";
import HeroSection from "../../components/HeroSection/HeroSection";
import styles from "./Home.module.css";
import type { Product } from "../../types/types";

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("http://localhost:5000/api/products?featured=true")
      .then(async (res) => {
        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(
            `Failed to load featured products: ${res.status} - ${
              errorData.error || "Unknown error"
            }`
          );
        }
        return res.json();
      })
      .then((data: Product[]) => {
        // Ensure price is a number and image has fallback
        const parsedData = data.map((product) => ({
          ...product,
          price: parseFloat(product.price as string), // Convert string to number
          image: product.image || "https://placehold.co/150x150", // Fallback image
        }));
        setFeaturedProducts(parsedData);
      })
      .catch((err: Error) => {
        setError(err.message);
        console.error("Fetch error:", err);
      });
  }, []);

  return (
    <div className={styles.home} style={{ backgroundColor: "#E6E6FA" }}>
      {" "}
      {/* Lavender */}
      <Container>
        <h1 className={styles.title} style={{ color: "#A1DC17" }}>
          Welcome to Milliwin Boutique
        </h1>
        {error && <Alert variant="danger">{error}</Alert>}

        {/* Hero Section */}
        <HeroSection />

        {/* Featured Products Carousel */}
        {featuredProducts.length > 0 ? (
          <Carousel className={styles.carousel}>
            {featuredProducts.map((product) => (
              <Carousel.Item key={product.id}>
                <img
                  className={styles.carouselImage}
                  src={product.image}
                  alt={product.name}
                  onError={(e) => {
                    e.currentTarget.src = "https://placehold.co/150x150"; // Fallback on error
                  }}
                />
                <Carousel.Caption
                  style={{
                    background: "rgba(0, 0, 0, 0.5)",
                    borderRadius: "0.5rem",
                  }}
                >
                  <h3 style={{ color: "#FF1493" }}>{product.name}</h3>{" "}
                  {/* Fuchsia Pink */}
                  <p style={{ color: "#DDA0DD" }}>
                    Price: $
                    {(typeof product.price === "string"
                      ? parseFloat(product.price)
                      : product.price
                    ).toFixed(2)}
                  </p>{" "}
                  {/* Plum */}
                </Carousel.Caption>
              </Carousel.Item>
            ))}
          </Carousel>
        ) : (
          <Alert variant="info">No featured products available.</Alert>
        )}

        {/* Placeholder: Featured Categories */}
        <section className={styles.featuredSection}>
          <h2 style={{ color: "#9400D3" }}>Featured Categories</h2>{" "}
          {/* Purple */}
          <p>Coming soon: Women's, Men's, Children's, Beddings, Shoes</p>
        </section>

        {/* Placeholder: New Arrivals */}
        <section className={styles.featuredSection}>
          <h2 style={{ color: "#9400D3" }}>New Arrivals</h2> {/* Purple */}
          <p>Coming soon: Latest products</p>
        </section>
      </Container>
    </div>
  );
}
