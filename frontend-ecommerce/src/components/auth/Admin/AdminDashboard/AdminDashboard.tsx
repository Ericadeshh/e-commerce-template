import { Routes, Route, useNavigate } from "react-router-dom";
import { Button, Container, Navbar } from "react-bootstrap";
import { FaUserCog } from "react-icons/fa";
import { motion } from "framer-motion";
import Sidebar from "../Sidebar/Sidebar";
import DashboardOverview from "../DashboardOverview/DashboardOverview";
import ProductManagement from "../ProductManagement/ProductManagement";
import BannerManagement from "../BannerManagement/BannerManagement";
import PromotionManagement from "../PromotionManagement/PromotionManagement";
import AccessoryManagement from "../AccessoryManagement/AccessoryManagement";
import UserManagement from "../UserManagement/UserManagement";
import OrderManagement from "../OrderManagement/OrderManagement";
import styles from "./AdminDashboard.module.css";

export default function AdminDashboard() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className={styles.dashboard}>
      {/* Mobile Navbar */}
      <Navbar
        bg="dark"
        variant="dark"
        expand={false}
        className={styles.mobileNav}
      >
        <Container fluid>
          <Navbar.Brand>Admin Dashboard</Navbar.Brand>
          <Navbar.Toggle />
          <Sidebar isMobile />
        </Container>
      </Navbar>

      <div className={styles.layout}>
        {/* Desktop Sidebar */}
        <div className={styles.desktopSidebar}>
          <Sidebar isMobile={false} />
        </div>

        {/* Main Content */}
        <main className={styles.main}>
          <motion.div
            className={styles.topBar}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className={styles.title}>Admin Dashboard</h2>
            <div className={styles.adminInfo}>
              <span className={styles.welcomeText}>Welcome, Admin</span>
              <Button
                variant="outline-danger"
                onClick={handleLogout}
                className={styles.logoutButton}
              >
                <FaUserCog className={styles.icon} /> Logout
              </Button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Routes>
              <Route index element={<DashboardOverview />} />
              <Route path="products" element={<ProductManagement />} />
              <Route path="banners" element={<BannerManagement />} />
              <Route path="promotions" element={<PromotionManagement />} />
              <Route path="accessories" element={<AccessoryManagement />} />
              <Route path="users" element={<UserManagement />} />
              <Route path="orders" element={<OrderManagement />} />
            </Routes>
          </motion.div>
        </main>
      </div>
    </div>
  );
}
