import { Col, Button } from "react-bootstrap";
import Slider from "react-slick";
import { motion } from "framer-motion";
import MidBanner from "../mid_banner/mid_banner";
import styles from "./BannerCarousel.module.css";

interface Banner {
  id: number;
  title: string;
  description: string;
  image_url: string;
  cta_text: string;
  cta_url: string;
}

interface BannerCarouselProps {
  banners: Banner[];
}

const bannerSliderSettings = {
  dots: false,
  infinite: true,
  speed: 500,
  slidesToShow: 1,
  slidesToScroll: 1,
  autoplay: true,
  autoplaySpeed: 3000,
  arrows: true,
  responsive: [
    {
      breakpoint: 768,
      settings: { arrows: true },
    },
  ],
};

const BannerCarousel: React.FC<BannerCarouselProps> = ({ banners }) => {
  return (
    <>
      <Col md={6} className={`${styles.bannerCarousel} d-none d-md-flex`}>
        <Slider {...bannerSliderSettings}>
          {banners.map((banner) => (
            <div key={banner.id} className={styles.bannerSlide}>
              <motion.div
                className={styles.bannerImageWrapper}
                initial={{ x: 100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.8 }}
              >
                <div className={styles.bannerImageContainer}>
                  <img
                    src={banner.image_url}
                    alt={banner.title}
                    className={styles.bannerImage}
                    onError={(e) => {
                      e.currentTarget.src = "https://placehold.co/1200x400";
                    }}
                  />
                  <div className={styles.bannerImageOverlay} />
                </div>
              </motion.div>
              <div className={styles.bannerContent}>
                <motion.h2
                  className={styles.bannerTitle}
                  initial={{ y: 40, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                  key={`title-${banner.id}`}
                >
                  {banner.title}
                </motion.h2>
                <motion.p
                  className={styles.bannerDescription}
                  initial={{ y: 40, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.6, delay: 0.6 }}
                  key={`desc-${banner.id}`}
                >
                  {banner.description}
                </motion.p>
                <motion.div
                  initial={{ y: 40, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.6, delay: 0.9 }}
                  key={`cta-${banner.id}`}
                >
                  <Button href={banner.cta_url} className={styles.bannerCta}>
                    {banner.cta_text}
                  </Button>
                </motion.div>
              </div>
            </div>
          ))}
        </Slider>
        <MidBanner />
      </Col>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className={`${styles.bannerCarousel} d-md-none`}
      >
        <Slider {...bannerSliderSettings}>
          {banners.map((banner) => (
            <div key={banner.id} className={styles.bannerSlide}>
              <motion.div
                className={styles.bannerImageWrapper}
                initial={{ x: 100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.8 }}
              >
                <div className={styles.bannerImageContainer}>
                  <img
                    src={banner.image_url}
                    alt={banner.title}
                    className={styles.bannerImage}
                    onError={(e) => {
                      e.currentTarget.src = "https://placehold.co/1200x400";
                    }}
                  />
                  <div className={styles.bannerImageOverlay} />
                </div>
              </motion.div>
              <div className={styles.bannerContent}>
                <motion.h2
                  className={styles.bannerTitle}
                  initial={{ y: 40, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                  key={`title-mobile-${banner.id}`}
                >
                  {banner.title}
                </motion.h2>
                <motion.p
                  className={styles.bannerDescription}
                  initial={{ y: 40, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.6, delay: 0.6 }}
                  key={`desc-mobile-${banner.id}`}
                >
                  {banner.description}
                </motion.p>
                <motion.div
                  initial={{ y: 40, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.6, delay: 0.9 }}
                  key={`cta-mobile-${banner.id}`}
                >
                  <Button href={banner.cta_url} className={styles.bannerCta}>
                    {banner.cta_text}
                  </Button>
                </motion.div>
              </div>
            </div>
          ))}
        </Slider>
        <MidBanner />
      </motion.div>
    </>
  );
};

export default BannerCarousel;
