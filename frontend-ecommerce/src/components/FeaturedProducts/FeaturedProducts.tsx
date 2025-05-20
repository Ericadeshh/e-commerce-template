import { useState, useEffect, useMemo } from "react";
import { Button, Card } from "react-bootstrap";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { motion } from "framer-motion";
import MenSuitPic from "../../assets/Men's blue suitjpg.jpg";
import WomenDressPic from "../../assets/lady red suit.jpg";
import kidPantsPic from "../../assets/kids pants.jpg";
import kidMatchPic from "../../assets/kids matching cloth.jpg";
import MenOmbrePic from "../../assets/Men Ombre Japanese.jpg";
import BeddingPic from "../../assets/nice blankets.jpg";
import styles from "./FeaturedProducts.module.css";

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

export default function FeaturedProducts() {
  const defaultProducts = useMemo<Product[]>(
    () => [
      {
        id: 1,
        name: "Men's Blue Suit",
        price: 99.99,
        original_price: 129.99,
        discount_percentage: 23,
        stock: 5,
        category: "mens",
        image: MenSuitPic,
      },
      {
        id: 2,
        name: "Women's Red Dress",
        price: 59.99,
        original_price: 69.99,
        discount_percentage: 15,
        stock: 10,
        category: "womens",
        image: WomenDressPic,
      },
      {
        id: 3,
        name: "Kids' Pants",
        price: 19.99,
        original_price: 22.99,
        discount_percentage: 10,
        stock: 3,
        category: "childrens",
        image: kidPantsPic,
      },
      {
        id: 4,
        name: "Kids' Matching Set",
        price: 29.99,
        original_price: null,
        discount_percentage: null,
        stock: 8,
        category: "childrens",
        image: kidMatchPic,
      },
      {
        id: 5,
        name: "Men's Ombre Shirt",
        price: 39.99,
        original_price: 49.99,
        discount_percentage: 20,
        stock: 12,
        category: "mens",
        image: MenOmbrePic,
      },
      {
        id: 6,
        name: "Nice Blanket",
        price: 44.99,
        original_price: 59.99,
        discount_percentage: 25,
        stock: 4,
        category: "beddings",
        image: BeddingPic,
      },
    ],
    []
  );

  const [featuredProducts, setFeaturedProducts] =
    useState<Product[]>(defaultProducts);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("http://localhost:5000/api/products?featured=true", {
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then(async (res) => {
        if (!res.ok) {
          throw new Error(`Failed to fetch products: ${res.status}`);
        }
        return res.json();
      })
      .then((data: Product[]) => {
        if (data.length === 0) {
          setFeaturedProducts(defaultProducts);
          setError("No featured products in database. Showing demo content.");
        } else {
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
        }
      })
      .catch((err) => {
        console.error("Error fetching products:", err);
        setFeaturedProducts(defaultProducts);
        setError("Server unavailable. Showing demo content.");
      });
  }, [defaultProducts]);

  const sliderSettings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: true,
    responsive: [
      {
        breakpoint: 992,
        settings: { slidesToShow: 2, arrows: true },
      },
      {
        breakpoint: 768,
        settings: { slidesToShow: 1, arrows: true },
      },
    ],
  };

  return (
    <section className={styles.section}>
      <h2 className={styles.sectionTitle}>Featured Products</h2>
      {error && <div className={styles.error}>{error}</div>}
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
                {product.is_new && <div className={styles.newBadge}>New</div>}
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
        ))}
      </Slider>
    </section>
  );
}
