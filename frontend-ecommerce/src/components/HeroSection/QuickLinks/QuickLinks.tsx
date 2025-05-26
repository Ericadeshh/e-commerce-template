import { Col } from "react-bootstrap";
import Slider from "react-slick";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FaArrowRight } from "react-icons/fa";
import styles from "./QuickLinks.module.css";

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

const QuickLinks: React.FC<QuickLinksProps> = ({
  quickLinks,
  activeLink,
  handleLinkClick,
}) => {
  return (
    <>
      <Col md={3} className={`${styles.quickLinks} d-none d-md-flex`}>
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <h3 className={styles.quickLinksTitle}>Quick Links</h3>
          {quickLinks.map((section) => (
            <div key={section.title} className={styles.linkSection}>
              <h4 className={styles.linkSectionTitle}>{section.title}</h4>
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
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className={`${styles.quickLinks} d-md-none`}
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
      </motion.div>
    </>
  );
};

export default QuickLinks;
