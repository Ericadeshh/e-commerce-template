import { motion } from "framer-motion";
import {
  FaCreditCard,
  FaMobileAlt,
  FaPaypal,
  FaUniversity,
} from "react-icons/fa";
import styles from "./PaymentMethods.module.css";

interface PaymentMethodsProps {
  selectedPayment: "credit_card" | "mpesa" | "paypal" | "bank_transfer" | null;
  setSelectedPayment: (
    payment: "credit_card" | "mpesa" | "paypal" | "bank_transfer" | null
  ) => void;
}

const buttonVariants = {
  hover: { scale: 1.03, transition: { duration: 0.2, ease: "easeOut" } },
  tap: { scale: 0.97, transition: { duration: 0.2, ease: "easeOut" } },
};

const PaymentMethods: React.FC<PaymentMethodsProps> = ({
  selectedPayment,
  setSelectedPayment,
}) => {
  return (
    <div className={styles.paymentMethods}>
      <h4 className={styles.sectionTitle}>
        <FaCreditCard className={styles.sectionIcon} /> Payment Methods
      </h4>
      <div className={styles.paymentOptions}>
        <motion.div
          variants={buttonVariants}
          whileHover="hover"
          whileTap="tap"
          className={`${styles.paymentOption} ${
            selectedPayment === "credit_card" ? styles.selected : ""
          }`}
          onClick={() => setSelectedPayment("credit_card")}
        >
          <FaCreditCard className={styles.optionIcon} /> Credit Card
        </motion.div>
        <motion.div
          variants={buttonVariants}
          whileHover="hover"
          whileTap="tap"
          className={`${styles.paymentOption} ${
            selectedPayment === "mpesa" ? styles.selected : ""
          }`}
          onClick={() => setSelectedPayment("mpesa")}
        >
          <FaMobileAlt className={styles.optionIcon} /> M-Pesa
        </motion.div>
        <motion.div
          variants={buttonVariants}
          whileHover="hover"
          whileTap="tap"
          className={`${styles.paymentOption} ${
            selectedPayment === "paypal" ? styles.selected : ""
          }`}
          onClick={() => setSelectedPayment("paypal")}
        >
          <FaPaypal className={styles.optionIcon} /> PayPal
        </motion.div>
        <motion.div
          variants={buttonVariants}
          whileHover="hover"
          whileTap="tap"
          className={`${styles.paymentOption} ${
            selectedPayment === "bank_transfer" ? styles.selected : ""
          }`}
          onClick={() => setSelectedPayment("bank_transfer")}
        >
          <FaUniversity className={styles.optionIcon} /> Bank Transfer
        </motion.div>
      </div>
    </div>
  );
};

export default PaymentMethods;
