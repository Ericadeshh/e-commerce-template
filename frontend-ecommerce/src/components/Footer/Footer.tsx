import { useState } from "react";
import { Container, Row, Col, Form, Button, Alert } from "react-bootstrap";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaInstagram,
  FaTwitter,
  FaFacebookF,
} from "react-icons/fa";
import styles from "./Footer.module.css";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address");
      return;
    }
    // Placeholder for newsletter API call
    console.log("Subscribing:", email);
    setSubmitted(true);
    setEmail("");
    setError("");
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <footer className={styles.footer}>
      <Container>
        <Row className={styles.footerTop}>
          <Col md={3} className={styles.branding}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Link to="/" className={styles.logo}>
                Milliwin Boutique
              </Link>
              <p className={styles.tagline}>
                Elevate your style with premium fashion and home essentials.
              </p>
            </motion.div>
          </Col>
          <Col md={3} className={styles.navSection}>
            <h4 className={styles.navTitle}>Shop</h4>
            <ul className={styles.navList}>
              {["mens", "womens", "childrens", "shoes", "beddings"].map(
                (category) => (
                  <motion.li
                    key={category}
                    whileHover={{ x: 5, color: "#ff1493" }}
                    transition={{ duration: 0.3 }}
                  >
                    <Link
                      to={`/products?category=${category}`}
                      className={styles.navLink}
                    >
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </Link>
                  </motion.li>
                )
              )}
            </ul>
          </Col>
          <Col md={3} className={styles.navSection}>
            <h4 className={styles.navTitle}>Support</h4>
            <ul className={styles.navList}>
              {[
                { name: "Help Center", path: "/help-center" },
                { name: "Returns & Refunds", path: "/returns" },
                { name: "Delivery", path: "/delivery" },
                { name: "Warranty", path: "/warranty" },
              ].map((item) => (
                <motion.li
                  key={item.name}
                  whileHover={{ x: 5, color: "#ff1493" }}
                  transition={{ duration: 0.3 }}
                >
                  <Link to={item.path} className={styles.navLink}>
                    {item.name}
                  </Link>
                </motion.li>
              ))}
            </ul>
          </Col>
          <Col md={3} className={styles.navSection}>
            <h4 className={styles.navTitle}>Account</h4>
            <ul className={styles.navList}>
              {[
                { name: "Login", path: "/login" },
                { name: "Signup", path: "/signup" },
                { name: "My Account", path: "/user/dashboard" },
              ].map((item) => (
                <motion.li
                  key={item.name}
                  whileHover={{ x: 5, color: "#ff1493" }}
                  transition={{ duration: 0.3 }}
                >
                  <Link to={item.path} className={styles.navLink}>
                    {item.name}
                  </Link>
                </motion.li>
              ))}
            </ul>
          </Col>
        </Row>
        <Row className={styles.footerMiddle}>
          <Col md={6} className={styles.contact}>
            <h4 className={styles.navTitle}>Contact Us</h4>
            <ul className={styles.contactList}>
              <li>
                <FaEnvelope className={styles.contactIcon} />
                <a
                  href="mailto:support@milliwinboutique.com"
                  className={styles.contactLink}
                >
                  support@milliwinboutique.com
                </a>
              </li>
              <li>
                <FaPhone className={styles.contactIcon} />
                <a href="tel:+1234567890" className={styles.contactLink}>
                  +1 (234) 567-890
                </a>
              </li>
              <li>
                <FaMapMarkerAlt className={styles.contactIcon} />
                <span>123 Fashion Ave, New York, NY 10001</span>
              </li>
            </ul>
          </Col>
          <Col md={6} className={styles.newsletter}>
            <h4 className={styles.navTitle}>Join Our Newsletter</h4>
            <Form onSubmit={handleNewsletterSubmit}>
              <Form.Group className={styles.newsletterForm}>
                <Form.Control
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={styles.newsletterInput}
                />
                <Button type="submit" className={styles.newsletterButton}>
                  Subscribe
                </Button>
              </Form.Group>
              {error && (
                <Alert variant="danger" className={styles.alert}>
                  {error}
                </Alert>
              )}
              {submitted && (
                <Alert variant="success" className={styles.alert}>
                  Thank you for subscribing!
                </Alert>
              )}
            </Form>
          </Col>
        </Row>
        <Row className={styles.footerBottom}>
          <Col md={6} className={styles.social}>
            <ul className={styles.socialList}>
              {[
                {
                  icon: <FaInstagram />,
                  url: "https://instagram.com/milliwinboutique",
                },
                {
                  icon: <FaTwitter />,
                  url: "https://twitter.com/milliwinboutique",
                },
                {
                  icon: <FaFacebookF />,
                  url: "https://facebook.com/milliwinboutique",
                },
              ].map((social, index) => (
                <motion.li
                  key={index}
                  whileHover={{ scale: 1.2, color: "#ff1493" }}
                  transition={{ duration: 0.3 }}
                >
                  <a
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.socialLink}
                  >
                    {social.icon}
                  </a>
                </motion.li>
              ))}
            </ul>
          </Col>
          <Col md={6} className={styles.copyright}>
            <p>
              &copy; 2025 Milliwin Boutique. All rights reserved.{" "}
              <Link to="/terms" className={styles.legalLink}>
                Terms & Conditions
              </Link>{" "}
              |{" "}
              <Link to="/privacy" className={styles.legalLink}>
                Privacy Policy
              </Link>
            </p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
}
