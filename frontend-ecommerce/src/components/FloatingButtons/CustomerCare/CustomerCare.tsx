import { useState, useEffect } from "react";
import { FaArrowUp, FaWhatsapp, FaPhone } from "react-icons/fa";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import styles from "./CustomerCare.module.css";

export default function CustomerCare() {
  const [isScrollVisible, setIsScrollVisible] = useState(false);

  const toggleVisibility = () => {
    if (window.pageYOffset > 200) {
      setIsScrollVisible(true);
    } else {
      setIsScrollVisible(false);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  return (
    <div className={styles.customerCareContainer}>
      <motion.div
        className={styles.customerCareButton}
        initial={{ opacity: 0, scale: 0.5, y: 100 }}
        animate={{
          opacity: isScrollVisible ? 1 : 0,
          scale: isScrollVisible ? 1 : 0.5,
          y: isScrollVisible ? 0 : 100,
        }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        whileHover={{ scale: 1.1, backgroundColor: "#a100d3" }}
        whileTap={{ scale: 0.9 }}
        onClick={scrollToTop}
      >
        <FaArrowUp />
      </motion.div>
      <a
        href="https://wa.me/+254741091661"
        target="_blank"
        rel="noopener noreferrer"
        className={styles.customerCareButton}
      >
        <FaWhatsapp />
      </a>
      <Link to="/chat" className={styles.customerCareButton}>
        <FaPhone />
      </Link>
    </div>
  );
}
