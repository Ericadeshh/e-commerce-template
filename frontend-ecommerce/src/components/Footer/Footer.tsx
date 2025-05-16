import { Container, Row, Col } from "react-bootstrap";
import { FaFacebook, FaTwitter, FaInstagram } from "react-icons/fa";
import styles from "./Footer.module.css";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <Container>
        <Row className="py-4">
          <Col md={4} className="mb-3">
            <h5 className={styles.title}>E-Commerce</h5>
            <p className={styles.text}>
              Your one-stop shop for quality products at unbeatable prices.
            </p>
          </Col>
          <Col md={4} className="mb-3">
            <h5 className={styles.title}>Quick Links</h5>
            <ul className={styles.links}>
              <li>
                <a href="/" className={styles.link}>
                  Home
                </a>
              </li>
              <li>
                <a href="/about" className={styles.link}>
                  About
                </a>
              </li>
              <li>
                <a href="/contact" className={styles.link}>
                  Contact
                </a>
              </li>
            </ul>
          </Col>
          <Col md={4} className="mb-3">
            <h5 className={styles.title}>Follow Us</h5>
            <div className={styles.social}>
              <a href="https://facebook.com" className={styles.socialLink}>
                <FaFacebook size={24} />
              </a>
              <a href="https://twitter.com" className={styles.socialLink}>
                <FaTwitter size={24} />
              </a>
              <a href="https://instagram.com" className={styles.socialLink}>
                <FaInstagram size={24} />
              </a>
            </div>
          </Col>
        </Row>
        <div className={styles.bottom}>
          <p className={styles.text}>
            &copy; {new Date().getFullYear()} E-Commerce. All rights reserved.
          </p>
        </div>
      </Container>
    </footer>
  );
}
