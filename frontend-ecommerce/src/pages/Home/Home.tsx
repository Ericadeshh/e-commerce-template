import { useState, useEffect } from "react";
import { Button, Card, Col, Row } from "react-bootstrap";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import HeroSection from "../../components/HeroSection/HeroSection";
import styles from "./Home.module.css";
import { motion } from "framer-motion";

interface Product {
  id: number;
  name: string;
  price: string | number;
  image: string;
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
            image: product.image || "https://placehold.co/150x150",
            price: parseFloat(product.price as string),
          }))
        );
      })
      .catch((err) => {
        console.error("Error fetching products:", err);
        setError("Failed to load products. Please try again later.");
      });
  }, []);

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: true,
    responsive: [
      {
        breakpoint: 768,
        settings: { slidesToShow: 1 },
      },
    ],
  };

  return (
    <div className={styles.home}>
      <HeroSection />
      {error && <div className={styles.error}>{error}</div>}

      {/* Featured Products */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Featured Products</h2>
        <Slider {...sliderSettings}>
          {featuredProducts.map((product) => (
            <motion.div
              key={product.id}
              className={styles.productSlide}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Card className={styles.productCard}>
                <Card.Img
                  variant="top"
                  src={product.image}
                  alt={product.name}
                  className={styles.productImage}
                  onError={(e) => {
                    e.currentTarget.src = "https://placehold.co/150x150";
                  }}
                />
                <Card.Body>
                  <Card.Title className={styles.productName}>
                    {product.name}
                  </Card.Title>
                  <Card.Text className={styles.productPrice}>
                    $
                    {(typeof product.price === "string"
                      ? parseFloat(product.price)
                      : product.price
                    ).toFixed(2)}
                  </Card.Text>
                  <Button
                    className={styles.productCta}
                    href={`/products/${product.id}`}
                    style={{
                      backgroundColor: "#9400D3",
                      borderColor: "#9400D3",
                    }}
                  >
                    View Product
                  </Button>
                </Card.Body>
              </Card>
            </motion.div>
          ))}
        </Slider>
      </section>

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
            .filter((product) => product.id % 2 === 0)
            .slice(0, 3)
            .map((product) => (
              <Col key={product.id}>
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <Card className={styles.productCard}>
                    <Card.Img
                      variant="top"
                      src={product.image}
                      alt={product.name}
                      className={styles.productImage}
                      onError={(e) => {
                        e.currentTarget.src = "https://placehold.co/150x150";
                      }}
                    />
                    <Card.Body>
                      <Card.Title className={styles.productName}>
                        {product.name}
                      </Card.Title>
                      <Card.Text className={styles.productPrice}>
                        $
                        {(typeof product.price === "string"
                          ? parseFloat(product.price)
                          : product.price
                        ).toFixed(2)}
                      </Card.Text>
                      <Button
                        className={styles.productCta}
                        href={`/products/${product.id}`}
                        style={{
                          backgroundColor: "#9400D3",
                          borderColor: "#9400D3",
                        }}
                      >
                        View Product
                      </Button>
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
