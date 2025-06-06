import { Form } from "react-bootstrap";
import { FaTruck, FaStore } from "react-icons/fa";
import styles from "./ShippingOptions.module.css";

interface ShippingOptionsProps {
  shippingOption: "standard" | "express" | "pickup";
  setShippingOption: (option: "standard" | "express" | "pickup") => void;
}

const ShippingOptions: React.FC<ShippingOptionsProps> = ({
  shippingOption,
  setShippingOption,
}) => {
  return (
    <div className={styles.shippingOptions}>
      <h4 className={styles.sectionTitle}>
        <FaTruck className={styles.sectionIcon} /> Shipping Options
      </h4>
      <Form.Check
        type="radio"
        id="standard"
        label={
          <span>
            <FaTruck className={styles.optionIcon} /> Standard Delivery
            <br />
            <small>
              Delivery within Nairobi and major towns, 3-5 business days
            </small>
          </span>
        }
        name="shipping"
        checked={shippingOption === "standard"}
        onChange={() => setShippingOption("standard")}
        className={styles.shippingOption}
      />
      <div className={styles.shippingCost}>KSh 200</div>
      <Form.Check
        type="radio"
        id="express"
        label={
          <span>
            <FaTruck className={styles.optionIcon} /> Express Delivery
            <br />
            <small>Fast delivery within Nairobi, 1-2 business days</small>
          </span>
        }
        name="shipping"
        checked={shippingOption === "express"}
        onChange={() => setShippingOption("express")}
        className={styles.shippingOption}
      />
      <div className={styles.shippingCost}>KSh 500</div>
      <Form.Check
        type="radio"
        id="pickup"
        label={
          <span>
            <FaStore className={styles.optionIcon} /> Store Pickup
            <br />
            <small>Collect from our Westlands store, Same day</small>
          </span>
        }
        name="shipping"
        checked={shippingOption === "pickup"}
        onChange={() => setShippingOption("pickup")}
        className={styles.shippingOption}
      />
      <div className={styles.shippingCost}>Free</div>
    </div>
  );
};

export default ShippingOptions;
