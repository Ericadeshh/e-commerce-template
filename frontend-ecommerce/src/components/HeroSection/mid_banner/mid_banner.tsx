import styles from "./mid_banner.module.css";
import { PiTruckTrailerDuotone } from "react-icons/pi";
import { FaRegCreditCard } from "react-icons/fa6";
import { IoTimeOutline } from "react-icons/io5";

function MidBanner() {
  return (
    <>
      <div className={styles.midbanner}>
        <div className={styles.card}>
          <PiTruckTrailerDuotone className={styles.icon} />
          <p className={styles.title}>Free Shipping</p>
          <p className={styles.description}>Over Ksh 7,000</p>
        </div>

        <div className={styles.card}>
          <FaRegCreditCard className={styles.icon} />
          <p className={styles.title}>Free Secure Payment</p>
          <p className={styles.description}>With Credit/Debit/M-Pesa</p>
        </div>

        <div className={styles.card}>
          <IoTimeOutline className={styles.icon} />
          <p className={styles.title}>Reliable Waranty </p>
          <p className={styles.description}>1 month + </p>
        </div>
      </div>
    </>
  );
}

export default MidBanner;
