import { useState, useEffect } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

// Import static images
import MensPremiumSuit from "../../assets/Men'sPremiumSuit.jpg";
import WomensSummerDress from "../../assets/Women'sSummerDress.jpg";
import kidsmatchingSet from "../../assets/KidsMatchingSet.jpg";
import luxuryBeddingSet from "../../assets/LuxuryBeddingSet.jpg";

import styles from "./NewArrivals.module.css";

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
  arrival_date?: string;
  shipping_info?: string;
}

const staticProducts: Product[] = [
  {
    id: 1,
    name: "Men's Premium Suit",
    price: 199.99,
    image: MensPremiumSuit,
    arrival_date: "May 20, 2025",
    shipping_info: "Free Shipping",
    category: "mens",
    stock: 10,
    is_new: true,
  },
  {
    id: 2,
    name: "Women's Summer Dress",
    price: 89.99,
    image: WomensSummerDress,
    arrival_date: "May 21, 2025",
    shipping_info: "Ships in 2 days",
    category: "womens",
    stock: 15,
    is_new: true,
  },
  {
    id: 3,
    name: "Kids' Matching Set",
    price: 49.99,
    image: kidsmatchingSet,
    arrival_date: "May 22, 2025",
    shipping_info: "Free Shipping",
    category: "childrens",
    stock: 20,
    is_new: true,
  },
  {
    id: 4,
    name: "Luxury Bedding Set",
    price: 129.99,
    image: luxuryBeddingSet,
    arrival_date: "May 23, 2025",
    shipping_info: "Ships in 3 days",
    category: "beddings",
    stock: 8,
    is_new: true,
  },
];

export default function NewArrivals() {
  const [newArrivals, setNewArrivals] = useState<Product[]>(staticProducts);
  const [error, setError] = useState<string | null>(null);
  const [isServerOnline, setIsServerOnline] = useState<boolean>(false);

  useEffect(() => {
    const fetchNewArrivals = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/products?new=true",
          {
            headers: {
              "Cache-Control": "no-cache",
            },
          }
        );
        if (!response.ok) {
          throw new Error(`Failed to fetch products: ${response.status}`);
        }
        const data: Product[] = await response.json();
        const formattedData = data.map((product) => ({
          ...product,
          image: product.image || staticProducts[0].image, // Fallback to static image
          price: parseFloat(String(product.price)),
          original_price: product.original_price
            ? parseFloat(String(product.original_price))
            : null,
          stock: Number(product.stock),
          discount_percentage: product.discount_percentage
            ? Number(product.discount_percentage)
            : null,
          arrival_date: product.arrival_date || "May 23, 2025",
          shipping_info: product.shipping_info || "Free Shipping",
        }));
        setNewArrivals(formattedData);
        setIsServerOnline(true);
        setError(null);
      } catch (err) {
        console.error("Error fetching new arrivals:", err);
        setError("Failed to load new arrivals. Showing static content.");
        setNewArrivals(staticProducts);
        setIsServerOnline(false);
      }
    };

    fetchNewArrivals();
  }, []);

  const sliderSettings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: false,
    responsive: [
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  return (
    <section className={styles.newArrivals}>
      <div className={styles.header}>
        <h2 className={styles.sectionTitle}>New Arrivals</h2>
        <Link to="/products/new-arrivals" className={styles.viewMore}>
          View More
        </Link>
      </div>
      {error && !isServerOnline && <div className={styles.error}>{error}</div>}
      <Slider {...sliderSettings}>
        {newArrivals.map((item, index) => (
          <motion.div
            key={item.id}
            className={styles.productCard}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.2 }}
          >
            <div className={styles.cardContainer}>
              {item.is_new && <span className={styles.newSticker}>NEW</span>}
              <div className={styles.imageCircle}>
                <img
                  src={typeof item.image === "string" ? item.image : item.image}
                  alt={item.name}
                  className={styles.productImage}
                  onError={(e) => {
                    e.currentTarget.src = staticProducts[0].image; // Fallback to first static image
                  }}
                />
              </div>
              <div className={styles.detailsCircle}>
                <h3 className={styles.productName}>{item.name}</h3>
                <p className={styles.productPrice}>${item.price.toFixed(2)}</p>
                <p className={styles.arrivalDate}>
                  Arrived: {item.arrival_date}
                </p>
                <p className={styles.shippingInfo}>{item.shipping_info}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </Slider>
    </section>
  );
}
