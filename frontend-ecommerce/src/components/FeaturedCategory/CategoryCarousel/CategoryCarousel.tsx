import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { motion } from "framer-motion";
import {
  FaStar,
  FaChevronLeft,
  FaChevronRight,
  FaArrowRight,
} from "react-icons/fa";
import CategoryCard from "../CategoryCard/CategoryCard";
import styles from "./CategoryCarousel.module.css";

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  category: string;
  stock: number;
  original_price?: number | null;
  discount_percentage?: number | null;
  is_new?: boolean;
}

interface CategoryCarouselProps {
  category: string;
  products: Product[];
}

const categoryDescriptions: Record<string, string> = {
  "Men's":
    "Discover the latest in men's fashion, from stylish jackets to timeless accessories, designed for comfort and elegance,",
  "Women's":
    "Explore our curated collection of women's apparel, featuring vibrant dresses, chic blouses, and more.",
  "Children's":
    "Find fun and durable clothing for kids, perfect for playtime and special occasions.",
  Shoes:
    "Step up your shoes with our range of footwear, from casual sneakers to elegant heels.",
  Beddings:
    "Transform your bedroom with our cozy and luxurious bedding sets, crafted for ultimate comfort.",
};

const CategoryCarousel: React.FC<CategoryCarouselProps> = ({
  category,
  products,
}) => {
  const sliderSettings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 6,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: true,
    prevArrow: (
      <div className={styles.prevArrow}>
        <FaChevronLeft />
      </div>
    ),
    nextArrow: (
      <div className={styles.nextArrow}>
        <FaChevronRight />
      </div>
    ),
    responsive: [
      {
        breakpoint: 1366,
        settings: { slidesToShow: 4, slidesToScroll: 1, arrows: true },
      },
      {
        breakpoint: 768,
        settings: { slidesToShow: 2, slidesToScroll: 1, arrows: true },
      },
      {
        breakpoint: 320,
        settings: { slidesToShow: 1, slidesToScroll: 1, arrows: true },
      },
    ],
  };

  return (
    <div className={styles.carouselContainer}>
      <div className={styles.tab}>
        <h3 className={styles.categoryTitle}>{category}</h3>
        <a
          href={`/products?category=${category.toLowerCase()}`}
          className={styles.viewMore}
        >
          View More <FaArrowRight />
        </a>
      </div>
      <motion.div
        className={styles.description}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <FaStar className={styles.starIcon} />
        {categoryDescriptions[category] ||
          "Explore our latest collection, curated just for you."}
        <FaStar className={styles.starIcon} />
      </motion.div>
      <Slider {...sliderSettings}>
        {products.map((product) => (
          <div key={product.id} className={styles.productSlide}>
            <CategoryCard product={product} />
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default CategoryCarousel;
