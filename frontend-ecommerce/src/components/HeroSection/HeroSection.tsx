import { useState, useEffect } from "react";
import { Button, Card, Col, Row } from "react-bootstrap";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import styles from "./HeroSection.module.css";

interface Banner {
  id: number;
  title: string;
  description: string;
  image_url: string;
  cta_text: string;
  cta_url: string;
}

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
}

export default function HeroSection() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Fetch banners
    fetch("http://localhost:5000/api/admin/banners")
      .then(async (res) => {
        if (!res.ok) throw new Error(`Failed to fetch banners: ${res.status}`);
        return res.json();
      })
      .then((data: Banner[]) => setBanners(data))
      .catch((err) => {
        console.error("Error fetching banners:", err);
        setError("Failed to load banners.");
      });

    // Fetch promotions
    fetch("http://localhost:5000/api/admin/promotions")
      .then(async (res) => {
        if (!res.ok)
          throw new Error(`Failed to fetch promotions: ${res.status}`);
        return res.json();
      })
      .then((data: Promotion[]) => setPromotions(data))
      .catch((err) => {
        console.error("Error fetching promotions:", err);
        setError("Failed to load promotions.");
        setPromotions([]); // Ensure panel renders even if API fails
      });
  }, []);

  const sliderSettings = {
    dots: true,
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
        settings: { arrows: false },
      },
    ],
  };

  const quickLinks = [
    {
      title: "Clothing",
      items: [
        { name: "Women's", url: "/products?category=womens" },
        { name: "Men's", url: "/products?category=mens" },
        { name: "Children's", url: "/products?category=childrens" },
        {
          name: "Girls'",
          url: "/products?category=childrens&subcategory=girls",
        },
        { name: "Boys'", url: "/products?category=childrens&subcategory=boys" },
      ],
    },
    {
      title: "Footwear",
      items: [
        {
          name: "Sneakers",
          url: "/products?category=shoes&subcategory=sneakers",
        },
        { name: "Boots", url: "/products?category=shoes&subcategory=boots" },
        {
          name: "Sandals",
          url: "/products?category=shoes&subcategory=sandals",
        },
        { name: "Formal", url: "/products?category=shoes&subcategory=formal" },
      ],
    },
    {
      title: "Beddings",
      items: [
        {
          name: "Pillows",
          url: "/products?category=beddings&subcategory=pillows",
        },
        {
          name: "Mattresses",
          url: "/products?category=beddings&subcategory=mattresses",
        },
        {
          name: "Covers",
          url: "/products?category=beddings&subcategory=covers",
        },
        {
          name: "Blankets",
          url: "/products?category=beddings&subcategory=blankets",
        },
        {
          name: "Curtains",
          url: "/products?category=beddings&subcategory=curtains",
        },
      ],
    },
  ];

  return (
    <div className={styles.hero}>
      {error && <div className={styles.error}>{error}</div>}

      {/* Desktop Layout */}
      <Row className={`${styles.desktopLayout} d-none d-md-flex`}>
        {/* Left Panel: Quick Links */}
        <Col md={3} className={styles.quickLinks}>
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
                      whileHover={{ x: 5 }}
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

        {/* Center: Banner Carousel */}
        <Col md={6} className={styles.bannerCarousel}>
          <Slider {...sliderSettings}>
            {banners.length > 0 ? (
              banners.map((banner, index) => (
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
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ duration: 0.5, delay: 0.3 }}
                    >
                      {banner.title}
                    </motion.h2>
                    <motion.p
                      className={styles.bannerDescription}
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ duration: 0.5, delay: 0.4 }}
                    >
                      {banner.description}
                    </motion.p>
                    <motion.div
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ duration: 0.5, delay: 0.5 }}
                    >
                      <Button
                        href={banner.cta_url}
                        className={styles.bannerCta}
                        style={{
                          backgroundColor: "#9400D3",
                          borderColor: "#9400D3",
                        }}
                      >
                        {banner.cta_text}
                      </Button>
                    </motion.div>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className={styles.bannerSlide}>
                <img
                  src="https://placehold.co/1200x400"
                  alt="Placeholder"
                  className={styles.bannerImage}
                />
                <div className={styles.bannerContent}>
                  <h2 className={styles.bannerTitle}>
                    Welcome to Milliwin Boutique
                  </h2>
                  <p className={styles.bannerDescription}>
                    Shop the latest trends!
                  </p>
                  <Button
                    href="/products"
                    className={styles.bannerCta}
                    style={{
                      backgroundColor: "#9400D3",
                      borderColor: "#9400D3",
                    }}
                  >
                    Shop Now
                  </Button>
                </div>
              </div>
            )}
          </Slider>
        </Col>

        {/* Right Panel: Promotions */}
        <Col md={3} className={styles.promoPanel}>
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <h3 className={styles.promoPanelTitle}>Offers & Deals</h3>
            {promotions.length > 0 ? (
              promotions.slice(0, 2).map((promo, index) => (
                <motion.div
                  key={promo.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.3 }}
                >
                  <Card className={styles.promoCard}>
                    <Card.Img
                      variant="top"
                      src={promo.image_url}
                      alt={promo.title}
                      className={styles.promoImage}
                      onError={(e) => {
                        e.currentTarget.src = "https://placehold.co/400x200";
                      }}
                    />
                    <Card.Body>
                      <Card.Title className={styles.promoTitle}>
                        {promo.title}
                      </Card.Title>
                      {promo.discount_percentage && (
                        <Card.Text className={styles.promoDiscount}>
                          {promo.discount_percentage}% Off
                        </Card.Text>
                      )}
                      <Card.Text className={styles.promoDescription}>
                        {promo.description}
                      </Card.Text>
                      <Button
                        href={promo.cta_url}
                        className={styles.promoCta}
                        style={{
                          backgroundColor: "#FF1493",
                          borderColor: "#FF1493",
                        }}
                      >
                        {promo.cta_text}
                      </Button>
                    </Card.Body>
                  </Card>
                </motion.div>
              ))
            ) : (
              <Card className={styles.promoCard}>
                <Card.Img
                  variant="top"
                  src="https://placehold.co/400x200"
                  alt="No Promotions"
                  className={styles.promoImage}
                />
                <Card.Body>
                  <Card.Title className={styles.promoTitle}>
                    No Active Offers
                  </Card.Title>
                  <Card.Text className={styles.promoDescription}>
                    Check back soon for exciting deals!
                  </Card.Text>
                  <Button
                    href="/products"
                    className={styles.promoCta}
                    style={{
                      backgroundColor: "#FF1493",
                      borderColor: "#FF1493",
                    }}
                  >
                    Browse Products
                  </Button>
                </Card.Body>
              </Card>
            )}
          </motion.div>
        </Col>
      </Row>

      {/* Mobile Layout */}
      <div className={`${styles.mobileLayout} d-md-none`}>
        {/* Banner Carousel */}
        <Slider {...sliderSettings}>
          {banners.length > 0 ? (
            banners.map((banner) => (
              <motion.div
                key={banner.id}
                className={styles.bannerSlide}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6 }}
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
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.5 }}
                  >
                    {banner.title}
                  </motion.h2>
                  <motion.p
                    className={styles.bannerDescription}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                  >
                    {banner.description}
                  </motion.p>
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                  >
                    <Button
                      href={banner.cta_url}
                      className={styles.bannerCta}
                      style={{
                        backgroundColor: "#9400D3",
                        borderColor: "#9400D3",
                      }}
                    >
                      {banner.cta_text}
                    </Button>
                  </motion.div>
                </div>
              </motion.div>
            ))
          ) : (
            <div className={styles.bannerSlide}>
              <img
                src="https://placehold.co/1200x400"
                alt="Placeholder"
                className={styles.bannerImage}
              />
              <div className={styles.bannerContent}>
                <h2 className={styles.bannerTitle}>
                  Welcome to Milliwin Boutique
                </h2>
                <p className={styles.bannerDescription}>
                  Shop the latest trends!
                </p>
                <Button
                  href="/products"
                  className={styles.bannerCta}
                  style={{ backgroundColor: "#9400D3", borderColor: "#9400D3" }}
                >
                  Shop Now
                </Button>
              </div>
            </div>
          )}
        </Slider>

        {/* Quick Links */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className={styles.quickLinks}
        >
          <h3 className={styles.quickLinksTitle}>Quick Links</h3>
          {quickLinks.map((section) => (
            <div key={section.title} className={styles.linkSection}>
              <h4 className={styles.linkSectionTitle}>{section.title}</h4>
              <div className={styles.scrollableLinks}>
                {section.items.map((item) => (
                  <motion.div
                    key={item.name}
                    className={styles.scrollableLinkItem}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Link to={item.url} className={styles.linkItem}>
                      {item.name}
                    </Link>
                  </motion.div>
                ))}
              </div>
            </div>
          ))}
        </motion.div>

        {/* Promotions */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <h3 className={styles.promoPanelTitle}>Offers & Deals</h3>
          {promotions.length > 0 ? (
            promotions.slice(0, 2).map((promo) => (
              <motion.div
                key={promo.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className={styles.promoCard}
              >
                <Card>
                  <Card.Img
                    variant="top"
                    src={promo.image_url}
                    alt={promo.title}
                    className={styles.promoImage}
                    onError={(e) => {
                      e.currentTarget.src = "https://placehold.co/400x200";
                    }}
                  />
                  <Card.Body>
                    <Card.Title className={styles.promoTitle}>
                      {promo.title}
                    </Card.Title>
                    {promo.discount_percentage && (
                      <Card.Text className={styles.promoDiscount}>
                        {promo.discount_percentage}% Off
                      </Card.Text>
                    )}
                    <Card.Text className={styles.promoDescription}>
                      {promo.description}
                    </Card.Text>
                    <Button
                      href={promo.cta_url}
                      className={styles.promoCta}
                      style={{
                        backgroundColor: "#FF1493",
                        borderColor: "#FF1493",
                      }}
                    >
                      {promo.cta_text}
                    </Button>
                  </Card.Body>
                </Card>
              </motion.div>
            ))
          ) : (
            <Card className={styles.promoCard}>
              <Card.Img
                variant="top"
                src="https://placehold.co/400x200"
                alt="No Promotions"
                className={styles.promoImage}
              />
              <Card.Body>
                <Card.Title className={styles.promoTitle}>
                  No Active Offers
                </Card.Title>
                <Card.Text className={styles.promoDescription}>
                  Check back soon for exciting deals!
                </Card.Text>
                <Button
                  href="/products"
                  className={styles.promoCta}
                  style={{ backgroundColor: "#FF1493", borderColor: "#FF1493" }}
                >
                  Browse Products
                </Button>
              </Card.Body>
            </Card>
          )}
        </motion.div>
      </div>
    </div>
  );
}
