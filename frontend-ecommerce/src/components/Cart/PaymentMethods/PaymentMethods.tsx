import { useState } from "react";
import { Modal, Form, Button } from "react-bootstrap";
import { motion } from "framer-motion";
import {
  FaCreditCard,
  FaMobileAlt,
  FaPaypal,
  FaUniversity,
  FaLock,
  FaUser,
  FaPhone,
  FaMoneyBill,
  FaCalendar,
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

const modalVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.3, ease: "easeOut" },
  },
  exit: {
    opacity: 0,
    scale: 0.8,
    transition: { duration: 0.3, ease: "easeOut" },
  },
};

const PaymentMethods: React.FC<PaymentMethodsProps> = ({
  selectedPayment,
  setSelectedPayment,
}) => {
  const [showModal, setShowModal] = useState<
    "credit_card" | "mpesa" | "paypal" | "bank_transfer" | null
  >(null);
  const [formData, setFormData] = useState({
    credit_card: { cardNumber: "", expiry: "", cvv: "" },
    mpesa: { phone: "" },
    paypal: { email: "" },
    bank_transfer: { accountNumber: "", bankName: "" },
  });

  const handlePaymentSelect = (
    method: "credit_card" | "mpesa" | "paypal" | "bank_transfer"
  ) => {
    setSelectedPayment(method);
    setShowModal(method);
  };

  type PaymentMethodType = "credit_card" | "mpesa" | "paypal" | "bank_transfer";

  const handleFormChange = (
    method: PaymentMethodType,
    field: string,
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      [method]: { ...prev[method], [field]: value },
    }));
  };

  const handleSubmit = (method: PaymentMethodType) => {
    console.log(`Submitting ${method} payment:`, formData[method]);
    setShowModal(null);
  };

  const renderPaymentForm = (
    method: "credit_card" | "mpesa" | "paypal" | "bank_transfer"
  ) => {
    switch (method) {
      case "credit_card":
        return (
          <>
            <Form.Group className="mb-3">
              <Form.Label className={styles.formLabel}>
                <FaCreditCard /> Card Number
              </Form.Label>
              <Form.Control
                type="text"
                placeholder="1234 5678 9012 3456"
                value={formData.credit_card.cardNumber}
                onChange={(e) =>
                  handleFormChange("credit_card", "cardNumber", e.target.value)
                }
                className={styles.formInput}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label className={styles.formLabel}>
                <FaCalendar /> Expiry Date
              </Form.Label>
              <Form.Control
                type="text"
                placeholder="MM/YY"
                value={formData.credit_card.expiry}
                onChange={(e) =>
                  handleFormChange("credit_card", "expiry", e.target.value)
                }
                className={styles.formInput}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label className={styles.formLabel}>
                <FaLock /> CVV
              </Form.Label>
              <Form.Control
                type="text"
                placeholder="123"
                value={formData.credit_card.cvv}
                onChange={(e) =>
                  handleFormChange("credit_card", "cvv", e.target.value)
                }
                className={styles.formInput}
              />
            </Form.Group>
          </>
        );
      case "mpesa":
        return (
          <Form.Group className="mb-3">
            <Form.Label className={styles.formLabel}>
              <FaPhone /> Phone Number
            </Form.Label>
            <Form.Control
              type="text"
              placeholder="+254 123 456 789"
              value={formData.mpesa.phone}
              onChange={(e) =>
                handleFormChange("mpesa", "phone", e.target.value)
              }
              className={styles.formInput}
            />
          </Form.Group>
        );
      case "paypal":
        return (
          <Form.Group className="mb-3">
            <Form.Label className={styles.formLabel}>
              <FaUser /> PayPal Email
            </Form.Label>
            <Form.Control
              type="email"
              placeholder="example@paypal.com"
              value={formData.paypal.email}
              onChange={(e) =>
                handleFormChange("paypal", "email", e.target.value)
              }
              className={styles.formInput}
            />
          </Form.Group>
        );
      case "bank_transfer":
        return (
          <>
            <Form.Group className="mb-3">
              <Form.Label className={styles.formLabel}>
                <FaMoneyBill /> Account Number
              </Form.Label>
              <Form.Control
                type="text"
                placeholder="1234567890"
                value={formData.bank_transfer.accountNumber}
                onChange={(e) =>
                  handleFormChange(
                    "bank_transfer",
                    "accountNumber",
                    e.target.value
                  )
                }
                className={styles.formInput}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label className={styles.formLabel}>
                <FaUniversity /> Bank Name
              </Form.Label>
              <Form.Control
                type="text"
                placeholder="Bank Name"
                value={formData.bank_transfer.bankName}
                onChange={(e) =>
                  handleFormChange("bank_transfer", "bankName", e.target.value)
                }
                className={styles.formInput}
              />
            </Form.Group>
          </>
        );
      default:
        return null;
    }
  };

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
          onClick={() => handlePaymentSelect("credit_card")}
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
          onClick={() => handlePaymentSelect("mpesa")}
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
          onClick={() => handlePaymentSelect("paypal")}
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
          onClick={() => handlePaymentSelect("bank_transfer")}
        >
          <FaUniversity className={styles.optionIcon} /> Bank Transfer
        </motion.div>
      </div>
      {showModal && (
        <motion.div
          variants={modalVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          <Modal
            show={!!showModal}
            onHide={() => setShowModal(null)}
            centered
            className={styles.paymentModal}
          >
            <Modal.Header closeButton className={styles.modalHeader}>
              <Modal.Title className={styles.modalTitle}>
                {showModal === "credit_card" && (
                  <>
                    <FaCreditCard /> Credit Card Payment
                  </>
                )}
                {showModal === "mpesa" && (
                  <>
                    <FaMobileAlt /> M-Pesa Payment
                  </>
                )}
                {showModal === "paypal" && (
                  <>
                    <FaPaypal /> PayPal Payment
                  </>
                )}
                {showModal === "bank_transfer" && (
                  <>
                    <FaUniversity /> Bank Transfer
                  </>
                )}
              </Modal.Title>
            </Modal.Header>
            <Modal.Body className={styles.modalBody}>
              <Form>
                {renderPaymentForm(showModal)}
                <motion.div
                  variants={buttonVariants}
                  whileHover="hover"
                  whileTap="tap"
                >
                  <Button
                    className={styles.submitButton}
                    onClick={() => handleSubmit(showModal)}
                  >
                    <FaLock /> Submit Payment
                  </Button>
                </motion.div>
              </Form>
            </Modal.Body>
          </Modal>
        </motion.div>
      )}
    </div>
  );
};

export default PaymentMethods;
