import { useEffect, useState } from "react";
import { Carousel } from "react-bootstrap";
import type { Product } from "../types/types";
import ProductList from "../components/ProductList/ProductList";
import styles from "./LandingPage.module.css";

export default function LandingPage() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);

  useEffect(() => {
    fetch("/products?featured=true")
      .then((res) => res.json())
      .then((data: Product[]) => setFeaturedProducts(data));
  }, []);

  return (
    <div className={styles.container}>
      <Carousel className={styles.carousel}>
        {featuredProducts.map((product) => (
          <Carousel.Item key={product.id}>
            <img
              className="d-block w-100"
              src={product.image}
              alt={product.name}
            />
            <Carousel.Caption>
              <h3>{product.name}</h3>
              <p>${product.price}</p>
            </Carousel.Caption>
          </Carousel.Item>
        ))}
      </Carousel>

      <section className={styles.featuredSection}>
        <h2 className={styles.heading}>Our Products</h2>
        <ProductList />
      </section>
    </div>
  );
}
