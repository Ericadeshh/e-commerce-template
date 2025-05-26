import { Col, Card, Button } from "react-bootstrap";
import { motion } from "framer-motion";
import { FaTag, FaShoppingCart, FaStar, FaClock } from "react-icons/fa";
import styles from "./PromoPanel.module.css";

interface Promotion {
  id: number;
  title: string;
  description: string;
  image_url: string;
  cta_text: string;
  cta_url: string;
  is_active: boolean;
  discount_percentage?: number | null;
  start_date?: string | null;
  end_date?: string | null;
  price_range?: string;
  tag?: string;
  timer?: string;
  stock?: string;
}

interface PromoPanelProps {
  promotions: Promotion[];
}

const cardVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: (i: number) => ({
    opacity: 1,
    scale: 1,
    transition: { duration: 0.3, delay: i * 0.1, ease: "easeInOut" },
  }),
  hover: { scale: 1.02 },
  tap: { scale: 0.98 },
};

const imageVariants = {
  hover: { scale: 1.05, transition: { duration: 0.2, ease: "easeInOut" } },
};

const detailCircleVariants = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: { duration: 0.3, delay: 0.2, ease: "easeInOut" },
  },
};

const buttonVariants = {
  hover: { scale: 1.05, transition: { duration: 0.2, ease: "easeInOut" } },
  tap: { scale: 0.95, transition: { duration: 0.2, ease: "easeInOut" } },
};

const desktopCardVariants = {
  initial: { opacity: 1, y: 0 },
  hover: {
    opacity: 1,
    y: -5,
    transition: { duration: 0.3, ease: "easeInOut" },
  },
};

const desktopImageVariants = {
  initial: { scale: 1 },
  hover: {
    scale: 1.15,
    transition: { duration: 0.3, ease: "easeInOut" },
  },
};

const PromoPanel: React.FC<PromoPanelProps> = ({ promotions }) => {
  return (
    <>
      <Col md={3} className={`${styles.promoPanel} d-none d-md-flex`}>
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <h3 className={styles.promoPanelTitle}>Offers & Deals</h3>
          {promotions.slice(0, 2).map((promo, index) => (
            <motion.div
              key={promo.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.3 }}
            >
              <Card className={styles.promoCard}>
                <motion.div whileHover="hover">
                  <div className={styles.imageWrapper}>
                    <motion.img
                      variants={desktopImageVariants}
                      src={promo.image_url}
                      alt={promo.title}
                      className={styles.promoImage}
                      onError={(e) => {
                        e.currentTarget.src = "https://placehold.co/400x200";
                      }}
                    />
                  </div>
                  <Card.Body>
                    <motion.div variants={desktopCardVariants}>
                      <Card.Title className={styles.promoTitle}>
                        <FaTag className={styles.titleIcon} /> {promo.title}
                      </Card.Title>
                      {promo.discount_percentage && (
                        <Card.Text className={styles.promoDiscount}>
                          {promo.discount_percentage}% Off
                        </Card.Text>
                      )}
                      {promo.price_range && (
                        <Card.Text className={styles.promoPrice}>
                          {promo.price_range}
                        </Card.Text>
                      )}
                      {promo.tag && (
                        <Card.Text className={styles.promoTag}>
                          {promo.tag}
                        </Card.Text>
                      )}
                      <Card.Text className={styles.promoDescription}>
                        {promo.description}
                      </Card.Text>
                      {promo.timer && (
                        <Card.Text className={styles.promoTimer}>
                          {promo.timer}
                        </Card.Text>
                      )}
                      {promo.stock && (
                        <Card.Text className={styles.promoStock}>
                          {promo.stock}
                        </Card.Text>
                      )}
                      <Button href={promo.cta_url} className={styles.promoCta}>
                        <FaShoppingCart className={styles.ctaIcon} />{" "}
                        {promo.cta_text}
                      </Button>
                    </motion.div>
                  </Card.Body>
                </motion.div>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </Col>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
        className={`${styles.promoPanel} d-md-none`}
      >
        <h3 className={styles.promoPanelTitle}>Offers & Deals</h3>
        <div className={styles.promoContainer}>
          {promotions.slice(0, 2).map((promo, index) => (
            <motion.div
              key={promo.id}
              custom={index}
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              whileHover="hover"
              whileTap="tap"
              className={styles.circularCard}
              style={{ backgroundImage: `url(${promo.image_url})` }}
            >
              <motion.img
                src={promo.image_url}
                alt={promo.title}
                className={styles.cardImage}
                onError={(e) => {
                  e.currentTarget.src = "https://placehold.co/120x120";
                }}
                variants={imageVariants}
                whileHover="hover"
              />
              <div className={styles.cardContent}>
                <h4 className={styles.promoTitle}>
                  <FaTag className={styles.titleIcon} /> {promo.title}
                </h4>
                {promo.discount_percentage && (
                  <p className={styles.promoDiscount}>
                    {promo.discount_percentage}% Off
                  </p>
                )}
                {promo.price_range && (
                  <p className={styles.promoPrice}>{promo.price_range}</p>
                )}
                {promo.tag && <p className={styles.promoTag}>{promo.tag}</p>}
                <p className={styles.promoDescription}>{promo.description}</p>
                {promo.timer && (
                  <p className={styles.promoTimer}>{promo.timer}</p>
                )}
                {promo.stock && (
                  <p className={styles.promoStock}>{promo.stock}</p>
                )}
                <motion.div
                  variants={buttonVariants}
                  whileHover="hover"
                  whileTap="tap"
                >
                  <Button
                    href={promo.cta_url}
                    className={`${styles.promoCta} ${styles.boxyCta}`}
                  >
                    <FaShoppingCart className={styles.ctaIcon} /> SHOP NOW
                  </Button>
                </motion.div>
              </div>
              <motion.div
                className={styles.detailCircle}
                variants={detailCircleVariants}
                initial="initial"
                animate="animate"
              >
                {promo.tag && <p className={styles.detailText}>{promo.tag}</p>}
                <FaStar className={styles.detailIcon} />
                <FaClock className={styles.detailIcon} />
              </motion.div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </>
  );
};

export default PromoPanel;
