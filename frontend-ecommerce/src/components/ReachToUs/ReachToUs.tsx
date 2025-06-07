// ReacTohUs.tsx

import styles from "./ReachToUs.module.css";
import {
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaEnvelope,
  FaInstagram,
  FaFacebook,
  FaTwitter,
} from "react-icons/fa";
import { motion } from "framer-motion";

const ReachUs = () => {
  return (
    <motion.div
      className={styles.reachContainer}
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8 }}
    >
      <div className={styles.sticker}>Vaa Na Milliwin</div>
      <h2 className={styles.title}>Reach To Us</h2>
      <p className={styles.subtitle}>We’d Love to Hear From You</p>
      <p className={styles.description}>
        Whether you're looking for premium fashion, support with your order, or
        want to collaborate, our team is ready to assist. Our boutique locations
        are open for fittings, consultations, and style pickups.
      </p>

      <div className={styles.flex}>
        <div className={styles.contactInfo}>
          <h3 className={styles.flexHeader}> Contact Us Via</h3>
          <p>
            <FaPhoneAlt /> <span>+254 741091661</span>
          </p>
          <p>
            <FaEnvelope /> <span>itjedi37@gmail.com</span>
          </p>
          <p>
            <FaInstagram /> <span>@milliwin_boutique</span>
          </p>
          <p>
            <FaFacebook /> <span>Milliwin Online Boutique</span>
          </p>
          <p>
            <FaTwitter /> <span>@vaa_na_milliwin</span>
          </p>
        </div>

        <div className={styles.locations}>
          <h3 className={styles.flexHeader}>Our Location</h3>
          <ul>
            <li>
              <FaMapMarkerAlt /> Eldoret City - Langas Town (Main Branch)
            </li>
            <li>
              <FaMapMarkerAlt /> Kapsabet Branch
            </li>
            <li>
              <FaMapMarkerAlt /> Nakuru Branch
            </li>
            <li>
              <FaMapMarkerAlt /> Coming Soon: Nairobi Area
            </li>
          </ul>
        </div>
      </div>

      <div className={styles.mapWrapper}>
        <iframe
          title="Eldoret Map"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15955.484616060437!2d35.25444421708307!3d0.521180699999989!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1780fe796b4f1317%3A0x5a8c131176e6cd5d!2sLangas%2C%20Eldoret!5e0!3m2!1sen!2ske!4v1629033662023!5m2!1sen!2ske"
          width="100%"
          height="200"
          style={{ border: 0 }}
          allowFullScreen={false}
          loading="lazy"
        ></iframe>
      </div>
    </motion.div>
  );
};

export default ReachUs;
