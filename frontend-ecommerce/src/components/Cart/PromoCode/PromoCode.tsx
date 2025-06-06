import { Form, Button } from "react-bootstrap";
import { FaDollarSign, FaTag } from "react-icons/fa";
import { motion } from "framer-motion";
import styles from "./PromoCode.module.css";

const buttonVariants = {
  hover: { scale: 1.03, transition: { duration: 0.2, ease: "easeOut" } },
  tap: { scale: 0.97, transition: { duration: 0.2, ease: "easeOut" } },
};

const PromoCode: React.FC = () => {
  return (
    <div className={styles.promoCode}>
      <h4 className={styles.sectionTitle}>
        <FaDollarSign className={styles.sectionIcon} /> Promo Code
      </h4>
      <div className={styles.promoInputGroup}>
        <Form.Control
          type="text"
          placeholder="Enter promo code"
          className={styles.promoInput}
          disabled
        />
        <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
          <Button className={styles.promoButton} disabled>
            <FaTag /> Apply
          </Button>
        </motion.div>
      </div>
      <p className={styles.promoHint}>
        Try: WELCOME10, MILLIWIN20, or NEWCUSTOMER
      </p>
    </div>
  );
};

export default PromoCode;
