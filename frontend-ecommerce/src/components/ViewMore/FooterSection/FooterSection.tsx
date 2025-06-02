import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FaStar, FaArrowRight } from "react-icons/fa";
import styles from "./FooterSection.module.css";

interface FooterSectionProps {
  category: string;
}

const subcategories: Record<string, string[]> = {
  mens: ["Jackets", "Shirts", "Trousers"],
  womens: ["Dresses", "Blouses", "Skirts"],
  childrens: ["T-Shirts", "Shorts", "Dresses"],
  shoes: ["Running", "Casual", "Formal"],
  beddings: ["Bed Sheets", "Comforters", "Pillows"],
};

const FooterSection: React.FC<FooterSectionProps> = ({ category }) => {
  const categoryLower = category.toLowerCase();
  const categorySubcategories = subcategories[categoryLower] || [];

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
              key={sub}
              initial={{ x: -10, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <Link
                to={`/products/${categoryLower}?subcategory=${sub.toLowerCase()}`}
                className={styles.subcategoryLink}
              >
                {sub} <FaArrowRight className={styles.arrowIcon} />
              </Link>
            </motion.li>
          ))}
        </ul>
      </div>
      <div className={styles.review}>
        <h3 className={styles.title}>Customer Favorite</h3>
        <div className={styles.reviewContent}>
          <div className={styles.stars}>
            {[...Array(5)].map((_, i) => (
              <FaStar key={i} className={styles.starIcon} />
            ))}
          </div>
          <p>
            "Absolutely love the {category} collection! High quality and
            stylish!" - Jane D.
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default FooterSection;
