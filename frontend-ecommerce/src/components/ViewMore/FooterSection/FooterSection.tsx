import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FaArrowRight } from "react-icons/fa";
import styles from "./FooterSection.module.css";

interface FooterSectionProps {
  category: string;
}

const subcategories: Record<string, { name: string; description: string }[]> = {
  mens: [
    { name: "Jackets", description: "Stylish outerwear for all seasons." },
    { name: "Shirts", description: "From casual to formal, find your fit." },
    { name: "Trousers", description: "Comfortable and versatile pants." },
  ],
  womens: [
    { name: "Dresses", description: "Elegant dresses for every occasion." },
    { name: "Blouses", description: "Chic tops to elevate your wardrobe." },
    { name: "Skirts", description: "Trendy skirts in various styles." },
  ],
  childrens: [
    { name: "T-Shirts", description: "Fun and comfy tees for kids." },
    { name: "Shorts", description: "Perfect for playtime adventures." },
    { name: "Dresses", description: "Cute dresses for little ones." },
  ],
  shoes: [
    { name: "Running", description: "High-performance athletic shoes." },
    { name: "Casual", description: "Everyday sneakers and flats." },
    { name: "Formal", description: "Elegant shoes for special events." },
  ],
  beddings: [
    { name: "Bed Sheets", description: "Soft and luxurious linens." },
    { name: "Comforters", description: "Cozy bedding for restful sleep." },
    { name: "Pillows", description: "Supportive pillows for comfort." },
  ],
  "new-arrivals": [
    { name: "Latest Trends", description: "Hot off the press, stylish picks." },
    { name: "Seasonal Picks", description: "Curated for the current season." },
    { name: "Top Rated", description: "Fan favorites you can't miss." },
  ],
  "featured-products": [
    { name: "Editor’s Pick", description: "Hand-selected standout item." },
    { name: "Best Sellers", description: "Top-performing customer favorites." },
    { name: "Limited Edition", description: "Exclusive, limited-run items." },
  ],
};

const featuredProducts: Record<
  string,
  { name: string; price: number; image: string }
> = {
  mens: {
    name: "Casual Jacket",
    price: 59.99,
    image: "https://placehold.co/100x100",
  },
  womens: {
    name: "Summer Dress",
    price: 49.99,
    image: "https://placehold.co/100x100",
  },
  childrens: {
    name: "Kids T-Shirt",
    price: 14.99,
    image: "https://placehold.co/100x100",
  },
  shoes: {
    name: "Running Shoes",
    price: 79.99,
    image: "https://placehold.co/100x100",
  },
  beddings: {
    name: "Queen Bedding Set",
    price: 99.99,
    image: "https://placehold.co/100x100",
  },
  "new-arrivals": {
    name: "Seasonal Hoodie",
    price: 39.99,
    image: "https://placehold.co/100x100",
  },
  "featured-products": {
    name: "Premium Leather Bag",
    price: 129.99,
    image: "https://placehold.co/100x100",
  },
};

const FooterSection: React.FC<FooterSectionProps> = ({ category }) => {
  const categoryLower = category.toLowerCase().replace("'s", "s"); // Normalize: Men's -> mens
  const categorySubcategories = subcategories[categoryLower] || [];
  const featuredProduct =
    featuredProducts[categoryLower] || featuredProducts.mens;

  return (
    <motion.div
      className={styles.container}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className={styles.overview}>
        <h3 className={styles.title}>About {category}</h3>
        <p>
          Discover our handpicked {category} collection, crafted for style and
          comfort. Explore sizing guides and care tips in our{" "}
          <Link to="/help-center">Help Center</Link>.
        </p>
      </div>
      <div className={styles.subcategories}>
        <h3 className={styles.title}>Explore More in {category}</h3>
        <ul className={styles.subcategoryList}>
          {categorySubcategories.map((sub) => (
            <motion.li
              key={sub.name}
              initial={{ x: -10, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <Link
                to={`/products/${categoryLower}?subcategory=${sub.name.toLowerCase()}`}
                className={styles.subcategoryLink}
              >
                <span>{sub.name}</span>{" "}
                <FaArrowRight className={styles.arrowIcon} />
                <p className={styles.subcategoryDesc}>{sub.description}</p>
              </Link>
            </motion.li>
          ))}
        </ul>
      </div>
      <div className={styles.featured}>
        <h3 className={styles.title}>Featured Collection</h3>
        <div className={styles.featuredContent}>
          <img
            src={featuredProduct.image}
            alt={featuredProduct.name}
            className={styles.featuredImage}
          />
          <p className={styles.featuredName}>{featuredProduct.name}</p>
          <p className={styles.featuredPrice}>
            ${featuredProduct.price.toFixed(2)}
          </p>
          <Link
            to={`/products/${categoryLower}?name=${featuredProduct.name.toLowerCase()}`}
            className={styles.shopLink}
          >
            Shop Now <FaArrowRight className={styles.arrowIcon} />
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default FooterSection;
