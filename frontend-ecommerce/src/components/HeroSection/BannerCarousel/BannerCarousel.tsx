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
          {banners.map((banner, index) => (
            <motion.div
              key={banner.id}
              className={styles.bannerSlide}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
            >
              <img
                src={banner.image_url}
                alt={banner.title}
                className={styles.bannerImage}
                onError={(e) => {
                  e.currentTarget.src = "https://placehold.co/1200x400";
                }}
              />
              <div className={styles.bannerContent}>
                <motion.h2
                  className={styles.bannerTitle}
                  initial={{ y: 30, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.3, ease: "easeOut" }}
                >
                  {banner.title}
                </motion.h2>
                <motion.p
                  className={styles.bannerDescription}
                  initial={{ y: 30, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.6, ease: "easeOut" }}
                >
                  {banner.description}
                </motion.p>
                <motion.div
                  initial={{ y: 30, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.9, ease: "easeOut" }}
                >
                  <Button href={banner.cta_url} className={styles.bannerCta}>
                    {banner.cta_text}
                  </Button>
                </motion.div>
              </div>
            </motion.div>
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
              <img
                src={banner.image_url}
                alt={banner.title}
                className={styles.bannerImage}
                onError={(e) => {
                  e.currentTarget.src = "https://placehold.co/1200x400";
                }}
              />
              <div className={styles.bannerContent}>
                <motion.h2
                  className={styles.bannerTitle}
                  initial={{ y: 30, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.3, ease: "easeOut" }}
                >
                  {banner.title}
                </motion.h2>
                <motion.p
                  className={styles.bannerDescription}
                  initial={{ y: 30, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.6, ease: "easeOut" }}
                >
                  {banner.description}
                </motion.p>
                <motion.div
                  initial={{ y: 30, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.9, ease: "easeOut" }}
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
