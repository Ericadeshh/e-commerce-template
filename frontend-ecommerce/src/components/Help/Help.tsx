import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import {
  FaCheckCircle,
  FaQuestionCircle,
  FaShoppingCart,
  FaCreditCard,
  FaTruck,
  FaUndo,
  FaShieldAlt,
} from "react-icons/fa";
import styles from "./Help.module.css";

function Help() {
  const location = useLocation();

  useEffect(() => {
    const hash = location.hash;
    if (hash) {
      const element = document.getElementById(hash.replace("#", ""));
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, [location]);

  return (
    <div className={styles.helpContainer}>
      <h1 className={styles.title}>
        <FaQuestionCircle className={styles.titleIcon} /> Help Center
      </h1>
      <section id="help-center" className={styles.section}>
        <h2 className={styles.sectionTitle}>
          <FaQuestionCircle /> General Help
        </h2>
        <div className={styles.sectionContent}>
          <p>
            Welcome to our Help Center! We're here to assist you with all your
            shopping needs. Browse the sections below for detailed information
            or contact our support team for personalized assistance.
          </p>
          <p>
            <strong>Contact Us:</strong> Reach out via email at
            support@milliwinboutique.com or call us at 1-800-555-1234. Our team
            is available Monday to Friday, 9 AM to 5 PM.
          </p>
        </div>
      </section>
      <section id="place-order" className={styles.section}>
        <h2 className={styles.sectionTitle}>
          <FaShoppingCart /> Place Your Order
        </h2>
        <div className={styles.sectionContent}>
          <p>
            Ordering with Milliwin Boutique is simple! Follow these steps to
            place your order:
          </p>
          <ol>
            <li>
              <FaCheckCircle className={styles.listIcon} /> Browse our
              categories and add items to your cart.
            </li>
            <li>
              <FaCheckCircle className={styles.listIcon} /> Proceed to checkout
              and enter your shipping details.
            </li>
            <li>
              <FaCheckCircle className={styles.listIcon} /> Choose your
              preferred payment method and confirm your order.
            </li>
          </ol>
          <p>
            You'll receive an order confirmation email with your order ID, which
            you can use to track your package.
          </p>
        </div>
      </section>
      <section id="payment-options" className={styles.section}>
        <h2 className={styles.sectionTitle}>
          <FaCreditCard /> Payment Options
        </h2>
        <div className={styles.sectionContent}>
          <p>
            We offer a variety of secure payment methods to make your shopping
            experience convenient:
          </p>
          <ul>
            <li>
              <FaCheckCircle className={styles.listIcon} /> Credit/Debit Cards
              (Visa, MasterCard, American Express)
            </li>
            <li>
              <FaCheckCircle className={styles.listIcon} /> PayPal
            </li>
            <li>
              <FaCheckCircle className={styles.listIcon} /> Apple Pay and Google
              Pay
            </li>
            <li>
              <FaCheckCircle className={styles.listIcon} /> Bank Transfer (for
              select regions)
            </li>
          </ul>
          <p>
            All transactions are encrypted to ensure your payment information is
            safe.
          </p>
        </div>
      </section>
      <section id="track-order" className={styles.section}>
        <h2 className={styles.sectionTitle}>
          <FaTruck /> Delivery Timelines & Track Your Order
        </h2>
        <div className={styles.sectionContent}>
          <p>
            Once your order is placed, you'll receive a tracking number via
            email. Standard delivery typically takes 5-7 business days, while
            express shipping takes 2-3 business days.
          </p>
          <p>
            To track your order, visit our{" "}
            <a href="/track-order">Track Order</a> page and enter your order ID.
            You'll see real-time updates on your package's location and
            estimated delivery date.
          </p>
        </div>
      </section>
      <section id="returns" className={styles.section}>
        <h2 className={styles.sectionTitle}>
          <FaUndo /> Returns & Refunds
        </h2>
        <div className={styles.sectionContent}>
          <p>
            We want you to love your purchase! If you're not satisfied, you can
            return eligible items within 30 days of delivery. Here's how:
          </p>
          <ul>
            <li>
              <FaCheckCircle className={styles.listIcon} /> Contact our support
              team to initiate a return.
            </li>
            <li>
              <FaCheckCircle className={styles.listIcon} /> Package the item
              securely and include the return form.
            </li>
            <li>
              <FaCheckCircle className={styles.listIcon} /> Ship the item back
              using the provided return label.
            </li>
          </ul>
          <p>
            Refunds are processed within 7-10 business days after we receive the
            returned item.
          </p>
        </div>
      </section>
      <section id="warranty" className={styles.section}>
        <h2 className={styles.sectionTitle}>
          <FaShieldAlt /> Warranty
        </h2>
        <div className={styles.sectionContent}>
          <p>
            Selected products come with a limited warranty, covering
            manufacturing defects for up to one year from the purchase date. To
            make a warranty claim:
          </p>
          <ol>
            <li>
              <FaCheckCircle className={styles.listIcon} /> Contact our support
              team with your order ID and issue details.
            </li>
            <li>
              <FaCheckCircle className={styles.listIcon} /> Provide photos or
              videos of the defect, if applicable.
            </li>
            <li>
              <FaCheckCircle className={styles.listIcon} /> Follow the
              instructions for repair or replacement.
            </li>
          </ol>
          <p>
            Note: Warranty does not cover damages due to misuse or normal wear
            and tear.
          </p>
        </div>
      </section>
    </div>
  );
}

export default Help;
