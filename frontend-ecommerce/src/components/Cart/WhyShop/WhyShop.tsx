import { FaGem, FaTruck, FaUndo } from "react-icons/fa";
import styles from "./WhyShop.module.css";

const WhyShop: React.FC = () => (
  <div className={styles.whyShop}>
    <h4 className={styles.sectionTitle}>
      <FaGem className={styles.sectionIcon} /> Why shop with Milliwin?
    </h4>
    <ul className={styles.whyShopList}>
      <li>
        <FaGem className={styles.whyShopIcon} /> Authentic African designs
      </li>
      <li>
        <FaTruck className={styles.whyShopIcon} /> Free delivery over KSh 5,000
      </li>
      <li>
        <FaUndo className={styles.whyShopIcon} /> 30-day return policy
      </li>
    </ul>
  </div>
);

export default WhyShop;
