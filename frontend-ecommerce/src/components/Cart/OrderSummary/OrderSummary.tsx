import { Button } from "react-bootstrap";
import { motion } from "framer-motion";
import {
  FaCheck,
  FaTag,
  FaTruck,
  FaGift,
  FaCreditCard,
  FaLock,
  FaWhatsapp,
} from "react-icons/fa";
import styles from "./OrderSummary.module.css";

interface OrderSummaryProps {
  subtotal: number;
  shippingCost: number;
  giftWrappingCost: number;
  vat: number;
  total: number;
  selectedPayment: "credit_card" | "mpesa" | "paypal" | "bank_transfer" | null;
  handleCheckout: () => void;
}

const buttonVariants = {
  hover: { scale: 1.03, transition: { duration: 0.2, ease: "easeOut" } },
  tap: { scale: 0.97, transition: { duration: 0.2, ease: "easeOut" } },
};

const OrderSummary: React.FC<OrderSummaryProps> = ({
  subtotal,
  shippingCost,
  giftWrappingCost,
  vat,
  total,
  selectedPayment,
  handleCheckout,
}) => {
  return (
    <div className={styles.orderSummary}>
      <h4 className={styles.sectionTitle}>
        <FaCheck className={styles.sectionIcon} /> Order Summary
      </h4>
      <div className={styles.summaryRow}>
        <span>
          <FaTag /> Subtotal
        </span>
        <span>KSh {subtotal.toFixed(0)}</span>
      </div>
      <div className={styles.summaryRow}>
        <span>
          <FaTruck /> Shipping
        </span>
        <span>KSh {shippingCost.toFixed(0)}</span>
      </div>
      <div className={styles.summaryRow}>
        <span>
          <FaTag /> VAT (16%)
        </span>
        <span>KSh {vat.toFixed(0)}</span>
      </div>
      {giftWrappingCost > 0 && (
        <div className={styles.summaryRow}>
          <span>
            <FaGift /> Gift Wrapping
          </span>
          <span>KSh {giftWrappingCost.toFixed(0)}</span>
        </div>
      )}
      <div className={styles.summaryTotal}>
        <span>
          <FaCreditCard /> Total
        </span>
        <span>KSh {total.toFixed(0)}</span>
      </div>
      <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
        <Button
          onClick={handleCheckout}
          className={styles.checkoutButton}
          disabled={!selectedPayment}
        >
          <FaLock className={styles.actionIcon} /> Proceed to Checkout
        </Button>
      </motion.div>
      <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
        <a
          href="https://wa.me/+254741091661?text=I'd%20like%20to%20place%20an%20order"
          target="_blank"
          rel="noopener noreferrer"
          className={styles.whatsappButton}
        >
          <FaWhatsapp className={styles.actionIcon} /> Order via WhatsApp
        </a>
      </motion.div>
      <p className={styles.secureCheckout}>
        <FaLock className={styles.actionIcon} /> Secure checkout with SSL
        encryption
      </p>
    </div>
  );
};

export default OrderSummary;
