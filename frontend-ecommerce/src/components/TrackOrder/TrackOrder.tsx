import { useState } from "react";
import {
  FaSearch,
  FaBox,
  FaTruck,
  FaCheckCircle,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaEnvelope,
  FaExclamationTriangle,
  FaHistory,
  FaFileDownload,
  FaUndo,
} from "react-icons/fa";
import styles from "./TrackOrder.module.css";

interface OrderDetails {
  id: string;
  status: "Ordered" | "Shipped" | "Delivered";
  orderDate: string;
  estimatedDelivery: string;
  items: { name: string; quantity: number; price: number }[];
  shippingAddress: string;
  trackingLocation: string;
}

function TrackOrder() {
  const [orderId, setOrderId] = useState("");
  const [error, setError] = useState("");
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null);

  const handleTrackOrder = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!orderId.trim()) {
      setError("Please enter a valid Order ID");
      return;
    }
    setOrderDetails({
      id: orderId,
      status: "Shipped",
      orderDate: "2025-06-01",
      estimatedDelivery: "2025-06-10",
      items: [
        { name: "Floral Dress", quantity: 1, price: 59.99 },
        { name: "Leather Jacket", quantity: 1, price: 129.99 },
      ],
      shippingAddress: "123 Fashion St, Style City, SC 12345",
      trackingLocation: "En route to regional hub",
    });
    setError("");
  };

  const getStatusProgress = (status: "Ordered" | "Shipped" | "Delivered") => {
    switch (status) {
      case "Ordered":
        return 33;
      case "Shipped":
        return 66;
      case "Delivered":
        return 100;
      default:
        return 0;
    }
  };

  return (
    <div className={styles.trackOrderContainer}>
      <h1 className={styles.title}>
        <FaBox className={styles.titleIcon} /> Track Your Order
      </h1>
      <p className={styles.description}>
        Stay updated on your order's journey with our tracking system. Simply
        enter your Order ID below to view real-time updates on your order
        status, from placement to delivery. Track your package's progress, check
        estimated delivery dates, and access detailed order information all in
        one place.
      </p>
      <form className={styles.trackForm} onSubmit={handleTrackOrder}>
        <div className={styles.inputWrapper}>
          <input
            type="text"
            className={styles.orderInput}
            value={orderId}
            onChange={(e) => setOrderId(e.target.value)}
            placeholder=" "
          />
          <label className={styles.orderLabel}>Enter Order ID</label>
          <button type="submit" className={styles.trackButton}>
            <FaSearch /> Track
          </button>
        </div>
        {error && (
          <p className={styles.error}>
            <FaExclamationTriangle /> {error}
          </p>
        )}
      </form>

      {orderDetails && (
        <div className={styles.orderDetails}>
          <h2 className={styles.sectionTitle}>Order #{orderDetails.id}</h2>
          <div className={styles.progressContainer}>
            <div className={styles.progressBar}>
              <div
                className={styles.progressFill}
                style={{ width: `${getStatusProgress(orderDetails.status)}%` }}
              ></div>
              <div className={`${styles.progressStep} ${styles.active}`}>
                <FaBox />
                <span>Ordered</span>
              </div>
              <div
                className={`${styles.progressStep} ${
                  orderDetails.status !== "Ordered" ? styles.active : ""
                }`}
              >
                <FaTruck />
                <span>Shipped</span>
              </div>
              <div
                className={`${styles.progressStep} ${
                  orderDetails.status === "Delivered" ? styles.active : ""
                }`}
              >
                <FaCheckCircle />
                <span>Delivered</span>
              </div>
            </div>
          </div>

          <div className={styles.detailsGrid}>
            <div className={styles.detailCard}>
              <h3>
                <FaCalendarAlt /> Order Details
              </h3>
              <p>
                <strong>Order Date:</strong> {orderDetails.orderDate}
              </p>
              <p>
                <strong>Estimated Delivery:</strong>{" "}
                {orderDetails.estimatedDelivery}
              </p>
              <p>
                <strong>Status:</strong> {orderDetails.status}
              </p>
            </div>
            <div className={styles.detailCard}>
              <h3>
                <FaBox /> Items
              </h3>
              {orderDetails.items.map((item, index) => (
                <p key={index}>
                  {item.name} x{item.quantity} - ${item.price.toFixed(2)}
                </p>
              ))}
              <p>
                <strong>Total:</strong> $
                {orderDetails.items
                  .reduce(
                    (sum: number, item) => sum + item.price * item.quantity,
                    0
                  )
                  .toFixed(2)}
              </p>
            </div>
            <div className={styles.detailCard}>
              <h3>
                <FaMapMarkerAlt /> Shipping Address
              </h3>
              <p>{orderDetails.shippingAddress}</p>
            </div>
            <div className={styles.detailCard}>
              <h3>
                <FaMapMarkerAlt /> Current Location
              </h3>
              <p>{orderDetails.trackingLocation}</p>
              <div className={styles.mapPlaceholder}>
                <FaMapMarkerAlt className={styles.mapIcon} />
                <span>Map view (Placeholder)</span>
              </div>
            </div>
          </div>

          <div className={styles.supportSection}>
            <p>Need assistance or more details?</p>
            <div className={styles.buttonGroup}>
              <button className={styles.supportButton}>
                <FaEnvelope /> Contact Support
              </button>
              <button className={styles.supportButton}>
                <FaHistory /> View Order History
              </button>
              <button className={styles.supportButton}>
                <FaFileDownload /> Download Invoice
              </button>
              <button className={styles.supportButton}>
                <FaUndo /> Request Return
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default TrackOrder;
