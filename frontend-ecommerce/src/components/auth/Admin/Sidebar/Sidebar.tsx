import { useState } from "react";
import { Nav, Offcanvas, Navbar } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import {
  FaChartLine,
  FaBox,
  FaImage,
  FaTag,
  FaBoxOpen,
  FaUsers,
  FaShoppingCart,
} from "react-icons/fa";
import { IconType } from "react-icons";
import { motion } from "framer-motion";
import styles from "./Sidebar.module.css";

interface SidebarProps {
  isMobile: boolean;
  show?: boolean;
  onHide?: () => void;
}

interface NavItem {
  to: string;
  icon: IconType;
  label: string;
  end?: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({
  isMobile,
  show = false,
  onHide,
}) => {
  const [mobileShow, setMobileShow] = useState(show);

  const navItems: { section: string; items: NavItem[] }[] = [
    {
      section: "Overview",
      items: [
        {
          to: "/admin/dashboard",
          icon: FaChartLine,
          label: "Dashboard",
          end: true,
        },
      ],
    },
    {
      section: "Hero Section Updates",
      items: [
        {
          to: "/admin/dashboard/banners",
          icon: FaImage,
          label: "Banner Update",
        },
        {
          to: "/admin/dashboard/promotions",
          icon: FaTag,
          label: "Promotion Update",
        },
      ],
    },
    {
      section: "Product Management",
      items: [
        {
          to: "/admin/dashboard/products",
          icon: FaBox,
          label: "Featured Products",
        },
        {
          to: "/admin/dashboard/accessories",
          icon: FaBoxOpen,
          label: "Accessories",
        },
      ],
    },
    {
      section: "Other Tasks",
      items: [
        {
          to: "/admin/dashboard/users",
          icon: FaUsers,
          label: "User Management",
        },
        {
          to: "/admin/dashboard/orders",
          icon: FaShoppingCart,
          label: "Order Management",
        },
      ],
    },
  ];

  const navContent = (
    <motion.div
      initial={{ x: isMobile ? -100 : 0 }}
      animate={{ x: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Nav className={styles.nav}>
        {isMobile && <h3 className={styles.sidebarTitle}>Admin Panel</h3>}
        {navItems.map((section) => (
          <div key={section.section}>
            <h5 className={styles.sectionTitle}>{section.section}</h5>
            {section.items.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end ?? false}
                className={({ isActive }) =>
                  isActive ? styles.activeLink : styles.navLink
                }
                onClick={() => isMobile && setMobileShow(false)}
              >
                <item.icon className={styles.icon} /> {item.label}
              </NavLink>
            ))}
          </div>
        ))}
      </Nav>
    </motion.div>
  );

  return isMobile ? (
    <>
      <Navbar.Toggle onClick={() => setMobileShow(true)} />
      <Offcanvas
        show={mobileShow}
        onHide={() => {
          setMobileShow(false);
          if (onHide) onHide();
        }}
        placement="start"
        className={styles.offcanvas}
      >
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Admin Menu</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>{navContent}</Offcanvas.Body>
      </Offcanvas>
    </>
  ) : (
    <motion.div
      className={styles.sidebar}
      initial={{ x: -200 }}
      animate={{ x: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h3 className={styles.sidebarTitle}>Admin Panel</h3>
      {navContent}
    </motion.div>
  );
};

export default Sidebar;
