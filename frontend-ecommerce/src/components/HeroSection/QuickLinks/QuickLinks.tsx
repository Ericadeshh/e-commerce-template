import { Col } from "react-bootstrap";
import Slider from "react-slick";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaArrowRight,
  FaLink,
  FaMale,
  FaFemale,
  FaChild,
  FaShoePrints,
  FaBed,
  FaStar,
  FaGem,
  FaPlus,
} from "react-icons/fa";
import { LuBaby } from "react-icons/lu";

import styles from "./QuickLinks.module.css";
import { useState, useEffect, useRef } from "react";

interface QuickLinkItem {
  name: string;
  url: string;
}

interface QuickLinkSection {
  title: string;
  items: QuickLinkItem[];
}

interface QuickLinksProps {
  quickLinks: QuickLinkSection[];
  activeLink: string | null;
  handleLinkClick: (name: string) => void;
}

const quickLinksSliderSettings = {
  dots: false,
  infinite: true,
  speed: 5000,
  slidesToShow: 4,
  slidesToScroll: 1,
  autoplay: true,
  autoplaySpeed: 0,
  cssEase: "linear",
  arrows: false,
  variableWidth: true,
  pauseOnHover: true,
  responsive: [
    {
      breakpoint: 992,
      settings: { slidesToShow: 3 },
    },
    {
      breakpoint: 576,
      settings: { slidesToShow: 2 },
    },
  ],
};

// Map section titles to their respective icons
const sectionIcons: Record<string, React.ReactElement> = {
  "Men's": <FaMale className={styles.sectionIcon} />,
  "Women's": <FaFemale className={styles.sectionIcon} />,
  "Children's": <FaChild className={styles.sectionIcon} />,
  Shoes: <FaShoePrints className={styles.sectionIcon} />,
  Beddings: <FaBed className={styles.sectionIcon} />,
  "New Arrivals": <FaStar className={styles.sectionIcon} />,
  "Featured Products": <FaGem className={styles.sectionIcon} />,
};

const QuickLinks: React.FC<QuickLinksProps> = ({
  quickLinks,
  activeLink,
  handleLinkClick,
}) => {
  const [showOverlay, setShowOverlay] = useState(true);
  const quickLinksRef = useRef<HTMLDivElement>(null);

  // Intersection Observer to detect when QuickLinks is out of view
  useEffect(() => {
    const currentRef = quickLinksRef.current; // Copy ref to variable
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) {
          setShowOverlay(true);
        }
      },
      { threshold: 0.1 }
    );

    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, []);

  const handleShowMore = () => {
    setShowOverlay(false);
  };

  // Overlay animation variants
  const overlayVariants = {
    hidden: {
      opacity: 0,
      x: "-100%",
      transition: { duration: 0.5, ease: "easeInOut" },
    },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.5, ease: "easeInOut" },
    },
  };

  // Icon animation for Show More button
  const iconVariants = {
    animate: {
      rotate: [0, 360],
      transition: { repeat: Infinity, duration: 2, ease: "linear" },
    },
  };

  return (
    <>
      <Col md={3} className={`${styles.quickLinks} d-none d-md-flex`}>
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <h3 className={styles.quickLinksTitle}>
            <FaLink className={styles.titleIcon} /> Quick Links
          </h3>
          {quickLinks.map((section) => (
            <div key={section.title} className={styles.linkSection}>
              <h4 className={styles.linkSectionTitle}>
                {sectionIcons[section.title] || null} {section.title}
              </h4>
              <ul className={styles.linkList}>
                {section.items.map((item) => (
                  <motion.li
                    key={item.name}
                    whileHover={{ x: 5, color: "#FF1493" }}
                    transition={{ duration: 0.3 }}
                  >
                    <Link to={item.url} className={styles.linkItem}>
                      {item.name}
                    </Link>
                  </motion.li>
                ))}
              </ul>
            </div>
          ))}
        </motion.div>
      </Col>
      <motion.div
        ref={quickLinksRef}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className={`${styles.quickLinks} d-md-none ${
          showOverlay ? styles.reducedHeight : ""
        }`}
      >
        <h3 className={styles.quickLinksTitle}>Quick Links</h3>
        {quickLinks.map((section) => (
          <div key={section.title} className={styles.linkSection}>
            <h4 className={styles.linkSectionTitle}>{section.title}</h4>
            <Slider {...quickLinksSliderSettings}>
              {section.items.map((item) => (
                <motion.div
                  key={item.name}
                  className={styles.linkItem}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                >
                  <Link
                    to={item.url}
                    className={`${styles.linkButton} ${
                      activeLink === item.name ? styles.active : ""
                    }`}
                    onClick={() => handleLinkClick(item.name)}
                  >
                    <FaArrowRight className={styles.linkIcon} /> {item.name}
                  </Link>
                </motion.div>
              ))}
            </Slider>
          </div>
        ))}
        <AnimatePresence>
          {showOverlay && (
            <motion.div
              className={styles.overlay}
              variants={overlayVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
            >
              <span className={styles.badgeTitle}>
                QUICK LINKS <FaLink />
              </span>
              <div className={styles.badgesContainer}>
                <span className={styles.badge}>
                  Women's <FaFemale />
                </span>
                <span className={styles.badge}>
                  Children's <LuBaby />
                </span>
              </div>
              <p className={styles.overlayText}>
                Explore our curated collections
              </p>
              <motion.button
                className={styles.showMoreButton}
                onClick={handleShowMore}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <motion.span variants={iconVariants} animate="animate">
                  <FaPlus className={styles.showMoreIcon} />
                </motion.span>
                Show More
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </>
  );
};

export default QuickLinks;
