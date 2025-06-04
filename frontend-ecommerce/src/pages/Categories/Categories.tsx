import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaArrowRight,
  FaLock,
  FaTshirt,
  FaFemale,
  FaBed,
  FaTags,
  FaHeart,
  FaTruck,
  FaStar,
} from "react-icons/fa";
import { GiConverseShoe } from "react-icons/gi";

// Import static images
import MensJacket from "../../assets/mensjacket.jpg";
import MenSneakers from "../../assets/men'ssneakers.jpg";
import MensShirt from "../../assets/men'sshirt.jpg";
import MensWatch from "../../assets/men's watch.jpg";

import WomensSummerDress from "../../assets/Women'sSummerDress.jpg";
import WomensHeels from "../../assets/women'sheels.jpg";
import WomensBlouse from "../../assets/womensblouse.jpg";
import WomensBag from "../../assets/birkin.jpg";

import kidstshirt from "../../assets/kidstshirt.jpg";

import runningshoes from "../../assets/runningshoes.jpg";
import casualSneakers from "../../assets/casualsneakers.avif";

import cottonDuvet from "../../assets/cottonduvet.jpg";
import pillowSet from "../../assets/pillowset.jpg";

import styles from "./Categories.module.css";

interface CategoryItem {
  id: string;
  name: string;
  description: string;
  image: string;
  price: string;
  url: string;
  isNew?: boolean;
  discount?: number;
}

interface CategorySection {
  title: string;
  description: string;
  icon: React.ReactNode;
  subcategories?: { name: string; url: string }[];
  items: CategoryItem[];
  viewAllUrl: string;
}

const categoriesData: CategorySection[] = [
  {
    title: "Clothing Designs",
    description:
      "Explore our stylish clothing for men, women, and children, crafted for every occasion.",
    icon: <FaTshirt />,
    subcategories: [
      { name: "Men's", url: "/products/mens" },
      { name: "Women's", url: "/products/womens" },
      { name: "Children's", url: "/products/childrens" },
    ],
    items: [
      {
        id: "1",
        name: "Men's Jacket",
        description: "Stylish denim with distressed detailing.",
        image: MensJacket,
        price: "$79.99",
        url: "/products/mens",
      },
      {
        id: "2",
        name: "Women's Dress",
        description: "Sleek, floor-length gown with intricate beadwork.",
        image: WomensSummerDress,
        price: "$149.99",
        url: "/products/womens",
        discount: 15,
      },
      {
        id: "3",
        name: "Kids T-Shirt",
        description: "Comfortable cotton t-shirt for kids.",
        image: kidstshirt,
        price: "$19.99",
        url: "/products/childrens",
        isNew: true,
      },
      {
        id: "4",
        name: "Men's Shirt",
        description: "Classic button-up shirt for all occasions.",
        image: MensShirt,
        price: "$49.99",
        url: "/products/mens",
      },
      {
        id: "5",
        name: "Women's Blouse",
        description: "Elegant blouse for formal occasions.",
        image: WomensBlouse,
        price: "$59.99",
        url: "/products/womens",
      },
    ],
    viewAllUrl: "/products/clothing",
  },
  {
    title: "Brands",
    description: "Shop premium collections from top fashion brands.",
    icon: <FaTags />,
    items: [
      {
        id: "6",
        name: "Men's Sneakers",
        description: "Comfortable sneakers for everyday wear.",
        image: MenSneakers,
        price: "$89.99",
        url: "/products/brands",
      },
      {
        id: "7",
        name: "Women's Heels",
        description: "Elegant heels for special occasions.",
        image: WomensHeels,
        price: "$79.99",
        url: "/products/brands",
        isNew: true,
      },
    ],
    viewAllUrl: "/products/brands",
  },
  {
    title: "Shoes",
    description: "Step into style with our diverse range of footwear.",
    icon: <GiConverseShoe />,
    items: [
      {
        id: "8",
        name: "Running Shoes",
        description: "Lightweight shoes for athletes.",
        image: runningshoes,
        price: "$99.99",
        url: "/products/shoes",
      },
      {
        id: "9",
        name: "Casual Sneakers",
        description: "Comfortable sneakers for daily wear.",
        image: casualSneakers,
        price: "$69.99",
        url: "/products/shoes",
        discount: 10,
      },
    ],
    viewAllUrl: "/products/shoes",
  },
  {
    title: "Beddings",
    description:
      "Create a cozy bedroom with our luxurious bedding collections.",
    icon: <FaBed />,
    items: [
      {
        id: "10",
        name: "Cotton Duvet",
        description: "Soft and breathable duvet set.",
        image: cottonDuvet,
        price: "$119.99",
        url: "/products/beddings",
      },
      {
        id: "11",
        name: "Pillow Set",
        description: "Comfortable pillows for better sleep.",
        image: pillowSet,
        price: "$49.99",
        url: "/products/beddings",
        isNew: true,
      },
    ],
    viewAllUrl: "/products/beddings",
  },
  {
    title: "Accessories",
    description:
      "Complete your look with our curated selection of accessories.",
    icon: <FaHeart />,
    items: [
      {
        id: "12",
        name: "Men's Watch",
        description: "Elegant timepiece for formal occasions.",
        image: MensWatch,
        price: "$199.99",
        url: "/products/accessories",
      },
      {
        id: "13",
        name: "Women's Bag",
        description: "Stylish handbag for everyday use.",
        image: WomensBag,
        price: "$149.99",
        url: "/products/accessories",
        discount: 20,
      },
    ],
    viewAllUrl: "/products/accessories",
  },
];

export default function Categories() {
  const [selectedCategory, setSelectedCategory] =
    useState<string>("Clothing Designs");

  const selectCategory = (title: string) => {
    setSelectedCategory(title);
  };

  return (
    <div className={styles.categoriesContainer}>
      <motion.section
        className={styles.heroSection}
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <h1 className={styles.heroTitle}>Discover Your Style</h1>
        <p className={styles.heroSubtitle}>
          Shop the latest trends in fashion, footwear, and home essentials.
        </p>
        <Link to="/" className={styles.heroButton}>
          Shop Now <FaLock className={styles.heroIcon} />
        </Link>
      </motion.section>

      <motion.section
        className={styles.featuredSection}
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <h2 className={styles.sectionTitle}>Featured Categories</h2>
        <div className={styles.featuredGrid}>
          {[
            { name: "Men's", url: "/products/mens", icon: <FaTshirt /> },
            { name: "Women's", url: "/products/womens", icon: <FaFemale /> },
            { name: "Shoes", url: "/products/shoes", icon: <GiConverseShoe /> },
            { name: "Beddings", url: "/products/beddings", icon: <FaBed /> },
          ].map((cat) => (
            <motion.div
              key={cat.name}
              className={styles.featuredCard}
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              <Link to={cat.url} className={styles.featuredLink}>
                <div className={styles.featuredIcon}>{cat.icon}</div>
                <h3 className={styles.featuredTitle}>{cat.name}</h3>
              </Link>
            </motion.div>
          ))}
        </div>
      </motion.section>

      <motion.section
        className={styles.allCategoriesSection}
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        <h2 className={styles.sectionTitle}>ALL CATEGORIES</h2>
        <div className={styles.categoryTabs}>
          {categoriesData.map((section) => (
            <motion.button
              key={section.title}
              className={`${styles.categoryTab} ${
                selectedCategory === section.title ? styles.activeTab : ""
              }`}
              onClick={() => selectCategory(section.title)}
              whileTap={{ scale: 0.08 }}
              transition={{ duration: 0.2 }}
            >
              <div className={styles.tabContent}>
                {section.icon}
                <span>{section.title}</span>
              </div>
            </motion.button>
          ))}
        </div>
        <AnimatePresence>
          {categoriesData.map(
            (section) =>
              selectedCategory === section.title && (
                <motion.div
                  key={section.title}
                  className={styles.sectionContent}
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.4, ease: "easeInOut" }}
                >
                  <p className={styles.sectionDescription}>
                    {section.description}
                  </p>
                  {section.subcategories && (
                    <div className={styles.subcategories}>
                      {section.subcategories.map((sub) => (
                        <Link
                          key={sub.name}
                          to={sub.url}
                          className={styles.subcategoryLink}
                        >
                          {sub.name}
                        </Link>
                      ))}
                    </div>
                  )}
                  <div className={styles.itemsGrid}>
                    {section.items.map((item) => (
                      <motion.div
                        key={item.id}
                        className={styles.itemCard}
                        whileHover={{
                          boxShadow: "0 8px 16px rgba(0, 0, 0, 0.2)",
                        }}
                        transition={{ duration: 0.3 }}
                      >
                        <img
                          src={item.image}
                          alt={item.name}
                          className={styles.itemImage}
                        />
                        <div className={styles.itemContent}>
                          {item.isNew && (
                            <span className={styles.newBadge}>
                              <FaStar /> New
                            </span>
                          )}
                          {item.discount && (
                            <span className={styles.discountBadge}>
                              <FaTags /> {item.discount}% Off
                            </span>
                          )}
                          <h3 className={styles.itemName}>{item.name}</h3>
                          <p className={styles.itemDescription}>
                            {item.description}
                          </p>
                          <p className={styles.itemPrice}>{item.price}</p>
                          <Link to={item.url} className={styles.detailsButton}>
                            More Details{" "}
                            <FaArrowRight className={styles.detailsIcon} />
                          </Link>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                  <Link
                    to={section.viewAllUrl}
                    className={styles.viewAllButton}
                  >
                    View All {section.title} <FaArrowRight />
                  </Link>
                </motion.div>
              )
          )}
        </AnimatePresence>
      </motion.section>

      <div className={styles.promoExploreContainer}>
        <motion.section
          className={styles.promoSection}
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <h2 className={styles.sectionTitle}>EXCLUSIVE OFFERS</h2>
          <div className={styles.promoGrid}>
            <motion.div
              className={styles.promoCard}
              whileHover={{ y: -5 }}
              transition={{ duration: 0.3 }}
            >
              <FaTags className={styles.promoIcon} />
              <h3 className={styles.promoTitle}>Seasonal Discounts</h3>
              <p className={styles.promoText}>
                Save up to 30% on selected clothing and accessories.
              </p>
              <Link to="/products/discounts" className={styles.promoButton}>
                Shop Deals
              </Link>
            </motion.div>
            <motion.div
              className={styles.promoCard}
              whileHover={{ y: -5 }}
              transition={{ duration: 0.3 }}
            >
              <FaStar className={styles.promoIcon} />
              <h3 className={styles.promoTitle}>New Arrivals</h3>
              <p className={styles.promoText}>
                Discover the latest trends in fashion and home decor.
              </p>
              <Link to="/new-arrivals" className={styles.promoButton}>
                Explore Now
              </Link>
            </motion.div>
          </div>
        </motion.section>

        <motion.section
          className={styles.exploreSection}
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <h2 className={styles.sectionTitle}>EXPLORE MORE</h2>
          <div className={styles.exploreGrid}>
            <Link to="/wishlist" className={styles.exploreLink}>
              <FaHeart className={styles.exploreIcon} />
              Your Wishlist
            </Link>
            <Link to="/products/brands" className={styles.exploreLink}>
              <FaTags className={styles.exploreIcon} />
              Top Brands
            </Link>
            <Link to="/delivery" className={styles.exploreLink}>
              <FaTruck className={styles.exploreIcon} />
              Track Your Order
            </Link>
          </div>
        </motion.section>
      </div>
    </div>
  );
}
