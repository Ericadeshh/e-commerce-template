import { useState } from "react";
import { Form, Button, Alert } from "react-bootstrap";
import {
  FaSearch,
  FaCheckCircle,
  FaTruck,
  FaBox,
  FaCalendarAlt,
  FaQuestionCircle,
  FaEnvelope,
} from "react-icons/fa";
import styles from "./TrackOrder.module.css";

interface OrderDetails {
  status: string;
  orderDate: string;
  estimatedDelivery: string;
  items: { name: string; quantity: number }[];
  timeline: { step: string; date: string; completed: boolean }[];
}

export default function TrackOrder() {
  const [orderId, setOrderId] = useState("");
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setOrderDetails(null);
    setIsLoading(true);

    try {
      // Mock API call for demonstration
      const res = await fetch(
        `http://localhost:5000/api/orders/track/${orderId}`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        }
      );
      if (!res.ok) {
        throw new Error("Order not found or invalid ID");
      }
      const data = await res.json();
      // Mock response structure
      const mockDetails: OrderDetails = {
        status: data.status || "In Transit",
        orderDate: "2025-06-01",
        estimatedDelivery: "2025-06-07",
        items: [
          { name: "Silk Dress", quantity: 1 },
          { name: "Leather Jacket", quantity: 2 },
        ],
        timeline: [
          { step: "Ordered", date: "2025-06-01", completed: true },
          { step: "Processed", date: "2025-06-02", completed: true },
          { step: "Shipped", date: "2025-06-03", completed: true },
          { step: "Delivered", date: "2025-06-07", completed: false },
        ],
      };
      setOrderDetails(mockDetails);
    } catch (err: unknown) {
      let message = "An unknown error occurred";
      if (err instanceof Error) {
        message = err.message;
      }
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.trackContainer}>
      <div className={styles.trackCard}>
        <h2 className={styles.title}>Track Your Order</h2>
        <Form onSubmit={handleSubmit} className={styles.trackForm}>
          <Form.Group className={styles.formGroup} controlId="formOrderId">
            <Form.Label>
              <FaSearch className={styles.icon} /> Order ID
            </Form.Label>
            <Form.Control
              type="text"
              value={orderId}
              onChange={(e) => setOrderId(e.target.value)}
              required
              className={styles.input}
            />
          </Form.Group>
          <Button
            type="submit"
            className={styles.submitButton}
            disabled={isLoading}
          >
            <FaSearch className={styles.buttonIcon} />{" "}
            {isLoading ? "Tracking..." : "Track Order"}
          </Button>
        </Form>
        {error && (
          <Alert variant="danger" className={styles.alert}>
            {error}
          </Alert>
        )}
        {orderDetails && (
          <div className={styles.orderDetails}>
            <h3 className={styles.sectionTitle}>
              Order Status: {orderDetails.status}
            </h3>
            <div className={styles.timeline}>
              {orderDetails.timeline.map((step, index) => (
                <div
                  key={index}
                  className={`${styles.timelineStep} ${
                    step.completed ? styles.completed : ""
                  }`}
                >
                  <div className={styles.timelineIcon}>
                    {step.step === "Ordered" && <FaBox />}
                    {step.step === "Processed" && <FaCheckCircle />}
                    {step.step === "Shipped" && <FaTruck />}
                    {step.step === "Delivered" && <FaCheckCircle />}
                  </div>
                  <div className={styles.timelineContent}>
                    <span className={styles.stepName}>{step.step}</span>
                    <span className={styles.stepDate}>{step.date}</span>
                  </div>
                </div>
              ))}
            </div>
            <div className={styles.orderInfo}>
              <h4 className={styles.infoTitle}>Order Details</h4>
              <p>
                <FaCalendarAlt className={styles.infoIcon} />{" "}
                <strong>Order Date:</strong> {orderDetails.orderDate}
              </p>
              <p>
                <FaCalendarAlt className={styles.infoIcon} />{" "}
                <strong>Estimated Delivery:</strong>{" "}
                {orderDetails.estimatedDelivery}
              </p>
              <h5 className={styles.itemsTitle}>Items Ordered:</h5>
              <ul className={styles.itemsList}>
                {orderDetails.items.map((item, index) => (
                  <li key={index}>
                    {item.name} x {item.quantity}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
        <div className={styles.helpSection}>
          <h3 className={styles.sectionTitle}>Need Help?</h3>
          <div className={styles.helpLinks}>
            <a href="/help-center" className={styles.helpLink}>
              <FaQuestionCircle className={styles.helpIcon} /> Help Center
            </a>
            <a href="/contact" className={styles.helpLink}>
              <FaEnvelope className={styles.helpIcon} /> Contact Support
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
