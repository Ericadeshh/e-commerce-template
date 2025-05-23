import { useState, useEffect } from "react";
import { Button, Card, Col, Row } from "react-bootstrap";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FaArrowRight, FaShoppingCart, FaTag } from "react-icons/fa";
import MenSuitPic from "../../assets/Men's blue suitjpg.jpg";
import WomenDressPic from "../../assets/lady red suit.jpg";
import kidPantsPic from "../../assets/kids pants.jpg";
import kidMatchPic from "../../assets/kids matching cloth.jpg";
import MenOmbrePic from "../../assets/Men Ombre Japanese.jpg";
import BeachShirtPic from "../../assets/beach shirt.jpg";
import BeddingPic from "../../assets/nice blankets.jpg";
import MidBanner from "./mid_banner/mid_banner";
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
  price_range?: string;
  tag?: string;
  timer?: string;
  stock?: string;
}

export default function HeroSection() {
  const defaultBanners: Banner[] = [
    {
      id: 1,
      title: "Discover Men's Fashion",
      description: "Elevate your style with our premium suits!",
      image_url: MenSuitPic,
      cta_text: "Shop Men's",
      cta_url: "/products?category=mens",
    },
    {
      id: 2,
      title: "Summer Collection",
      description: "Vibrant styles for women!",
      image_url: BeachShirtPic,
      cta_text: "Discover Women's",
      cta_url: "/products?category=womens",
    },
    {
      id: 3,
      title: "Kids' Matching Sets",
      description: "Adorable outfits for your little ones!",
      image_url: kidMatchPic,
      cta_text: "Shop by Category",
      cta_url: "/products?category=childrens",
    },
    {
      id: 4,
      title: "Welcome to Milliwin Boutique",
      description: "Explore the latest trends in fashion!",
      image_url: MenOmbrePic,
      cta_text: "Shop Now",
      cta_url: "/products",
    },
  ];

  const defaultPromotions: Promotion[] = [
    {
      id: 1,
      title: "Free Shipping",
      description: "On orders over $50",
      image_url: WomenDressPic,
      cta_text: "Shop Now",
      cta_url: "/products",
      is_active: true,
      discount_percentage: null,
      start_date: null,
      end_date: null,
      price_range: "$50+",
      tag: "LIMITED TIME",
      timer: "Ends in 3 days",
    },
    {
      id: 2,
      title: "Beddings Sale",
      description: "20% off all beddings",
      image_url: BeddingPic,
      cta_text: "Shop Sale",
      cta_url: "/products/beddings",
      is_active: true,
      discount_percentage: 20,
      start_date: null,
      end_date: null,
      price_range: "From $29.99",
      tag: "20% OFF",
      stock: "Only 50 left!",
    },
    {
      id: 3,
      title: "Kids' Clothing Sale",
      description: "15% off children's pants and sets",
      image_url: kidPantsPic,
      cta_text: "Shop Kids Sale",
      cta_url: "/products?category=childrens",
      is_active: true,
      discount_percentage: 15,
      start_date: null,
      end_date: null,
    },
  ];

  const [banners, setBanners] = useState<Banner[]>(defaultBanners);
  const [promotions, setPromotions] = useState<Promotion[]>(defaultPromotions);
  const [serverStatus, setServerStatus] = useState<boolean>(true);
  const [activeLink, setActiveLink] = useState<string | null>(null);

  useEffect(() => {
    const fetchBanners = fetch("http://localhost:5000/api/admin/banners")
      .then(async (res) => {
        if (!res.ok) throw new Error(`Failed to fetch banners: ${res.status}`);
        return res.json();
      })
      .then((data: Banner[]) => {
        setBanners(data);
        setServerStatus(true);
      })
      .catch((err) => {
        console.error("Error fetching banners:", err);
        setServerStatus(false);
      });

    const fetchPromotions = fetch("http://localhost:5000/api/admin/promotions")
      .then(async (res) => {
        if (!res.ok)
          throw new Error(`Failed to fetch promotions: ${res.status}`);
        return res.json();
      })
      .then((data: Promotion[]) => {
        setPromotions(data.slice(0, 3));
        setServerStatus(true);
      })
      .catch((err) => {
        console.error("Error fetching promotions:", err);
        setServerStatus(false);
      });

    Promise.all([fetchBanners, fetchPromotions]).catch(() => {
      setServerStatus(false);
    });
  }, []);

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

  const handleLinkClick = (name: string) => {
    setActiveLink(name);
  };

  return (
    <div className={styles.hero}>
      <div className={styles.heroTitleBar}>
        <div className={styles.heroHeader}>
          <h1 className={styles.heroTitle}>Milliwin Boutique</h1>
          <span
            className={styles.serverStatusDot}
            style={{ backgroundColor: serverStatus ? "#00FF00" : "#FF0000" }}
          ></span>
        </div>
      </div>

      {/* Desktop Layout */}
      <Row className={`${styles.desktopLayout} d-none d-md-flex`}>
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

        <Col md={6} className={styles.bannerCarousel}>
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

        <Col md={3} className={styles.promoPanel}>
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
                  </Card.Body>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </Col>
      </Row>

      {/* Mobile Layout */}
      <div className={`${styles.mobileLayout} d-md-none`}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
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

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className={styles.quickLinks}
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

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className={styles.promoPanel}
        >
          <h3 className={styles.promoPanelTitle}>Offers & Deals</h3>
          <div className={styles.promoContainer}>
            {promotions.slice(0, 2).map((promo) => (
              <motion.div
                key={promo.id}
                initial={{ opacity: 0, y: 20 }}
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
                  </Card.Body>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
