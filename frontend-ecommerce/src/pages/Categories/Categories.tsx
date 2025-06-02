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
        name: "Elegant Evening Dress",
        description: "Sleek, floor-length gown with intricate beadwork.",
        image: "https://via.placeholder.com/150?text=Dress",
        price: "$149.99",
        url: "/products/womens",
        discount: 15,
      },
      {
        id: "2",
        name: "Casual Denim Jacket",
        description: "Stylish denim with distressed detailing.",
        image: "https://via.placeholder.com/150?text=Jacket",
        price: "$79.99",
        url: "/products/mens",
      },
      {
        id: "3",
        name: "Floral Maxi Skirt",
        description: "Flowy skirt with vibrant floral patterns.",
        image: "https://via.placeholder.com/150?text=Skirt",
        price: "$59.99",
        url: "/products/womens",
        isNew: true,
      },
      {
        id: "16",
        name: "Kids Sneakers",
        description: "Durable sneakers for active kids.",
        image: "https://via.placeholder.com/150?text=Sneakers",
        price: "$39.99",
        url: "/products/childrens",
      },
      {
        id: "17",
        name: "Men's Shirt",
        description: "Classic button-up shirt for all occasions.",
        image: "https://via.placeholder.com/150?text=Shirt",
        price: "$49.99",
        url: "/products/mens",
      },
    ],
    viewAllUrl: "/products/clothing",
  },
  {
    title: "Brands",
    description:
      "Shop premium collections from top fashion brands like Gucci, Nike, and Zara.",
    icon: <FaTags />,
    items: [
      {
        id: "4",
        name: "Gucci Silk Scarf",
        description: "Luxurious silk scarf with signature Gucci print.",
        image: "https://via.placeholder.com/150?text=Gucci",
        price: "$199.99",
        url: "/products/brands",
        isNew: true,
      },
      {
        id: "5",
        name: "Nike Athletic Wear",
        description: "Breathable, high-performance sportswear.",
        image: "https://via.placeholder.com/150?text=Nike",
        price: "$89.99",
        url: "/products/brands",
      },
      {
        id: "6",
        name: "Zara Trench Coat",
        description: "Classic beige trench with modern cut.",
        image: "https://via.placeholder.com/150?text=Zara",
        price: "$129.99",
        url: "/products/brands",
        discount: 10,
      },
      {
        id: "18",
        name: "Adidas Sneakers",
        description: "Comfortable sneakers for everyday wear.",
        image: "https://via.placeholder.com/150?text=Adidas",
        price: "$79.99",
        url: "/products/brands",
      },
      {
        id: "19",
        name: "Prada Handbag",
        description: "Elegant leather handbag for sophistication.",
        image: "https://via.placeholder.com/150?text=Prada",
        price: "$299.99",
        url: "/products/brands",
      },
    ],
    viewAllUrl: "/products/brands",
  },
  {
    title: "Shoes",
    description:
      "Step into style with our diverse range of footwear for all lifestyles.",
    icon: <GiConverseShoe />,
    items: [
      {
        id: "7",
        name: "Leather Ankle Boots",
        description: "Premium leather boots with sturdy soles.",
        image: "https://via.placeholder.com/150?text=Boots",
        price: "$99.99",
        url: "/products/shoes",
      },
      {
        id: "8",
        name: "Running Sneakers",
        description: "Lightweight sneakers for ultimate comfort.",
        image: "https://via.placeholder.com/150?text=Sneakers",
        price: "$69.99",
        url: "/products/shoes",
        isNew: true,
      },
      {
        id: "9",
        name: "High Heels",
        description: "Elegant stilettos for formal occasions.",
        image: "https://via.placeholder.com/150?text=Heels",
        price: "$89.99",
        url: "/products/shoes",
      },
      {
        id: "20",
        name: "Casual Sandals",
        description: "Breathable sandals for summer outings.",
        image: "https://via.placeholder.com/150?text=Sandals",
        price: "$39.99",
        url: "/products/shoes",
        discount: 20,
      },
      {
        id: "21",
        name: "Formal Shoes",
        description: "Polished shoes for professional settings.",
        image: "https://via.placeholder.com/150?text=Formal",
        price: "$79.99",
        url: "/products/shoes",
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
        name: "Cotton Duvet Set",
        description: "Soft, breathable cotton duvet with pillowcases.",
        image: "https://via.placeholder.com/150?text=Duvet",
        price: "$119.99",
        url: "/products/beddings",
      },
      {
        id: "11",
        name: "Satin Bedsheet Set",
        description: "Luxurious satin sheets for a premium feel.",
        image: "https://via.placeholder.com/150?text=Bedsheet",
        price: "$79.99",
        url: "/products/beddings",
        isNew: true,
      },
      {
        id: "12",
        name: "Quilted Comforter",
        description: "Warm, cozy comforter for all seasons.",
        image: "https://via.placeholder.com/150?text=Comforter",
        price: "$99.99",
        url: "/products/beddings",
      },
      {
        id: "22",
        name: "Pillow Set",
        description: "Soft pillows for ultimate comfort.",
        image: "https://via.placeholder.com/150?text=Pillows",
        price: "$49.99",
        url: "/products/beddings",
        discount: 10,
      },
      {
        id: "23",
        name: "Mattress Cover",
        description: "Protective cover for your mattress.",
        image: "https://via.placeholder.com/150?text=Cover",
        price: "$39.99",
        url: "/products/beddings",
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
        id: "13",
        name: "Leather Handbag",
        description: "Chic handbag with multiple compartments.",
        image: "https://via.placeholder.com/150?text=Handbag",
        price: "$149.99",
        url: "/products/accessories",
        discount: 15,
      },
      {
        id: "14",
        name: "Sunglasses",
        description: "Stylish UV-protective sunglasses.",
        image: "https://via.placeholder.com/150?text=Sunglasses",
        price: "$49.99",
        url: "/products/accessories",
      },
      {
        id: "15",
        name: "Gold Necklace",
        description: "Elegant gold necklace with pendant.",
        image: "https://via.placeholder.com/150?text=Necklace",
        price: "$199.99",
        url: "/products/accessories",
        isNew: true,
      },
      {
        id: "24",
        name: "Wristwatch",
        description: "Sleek watch for timeless style.",
        image: "https://via.placeholder.com/150?text=Watch",
        price: "$129.99",
        url: "/products/accessories",
      },
      {
        id: "25",
        name: "Belt",
        description: "Classic leather belt for any outfit.",
        image: "https://via.placeholder.com/150?text=Belt",
        price: "$39.99",
        url: "/products/accessories",
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
      {/* Hero Section */}
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

      {/* Featured Categories */}
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
              whileHover={{
                scale: 1.02,
                boxShadow: "0 8px 16px rgba(0, 0, 0, 0.2)",
              }}
              transition={{ duration: 0.3 }}
            >
              <Link to={cat.url} className={styles.featuredLink}>
                {cat.icon}
                <h3 className={styles.featuredTitle}>{cat.name}</h3>
              </Link>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* All Categories */}
      <motion.section
        className={styles.allCategoriesSection}
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        <h2 className={styles.sectionTitle}>ALL CATEGORIES</h2>
        <div className={styles.categoryTabs}>
          {categoriesData.map((section) => (
            <motion.div
              key={section.title}
              className={`${styles.categoryTab} ${
                selectedCategory === section.title ? styles.activeTab : ""
              }`}
              onClick={() => selectCategory(section.title)}
              whileHover={{ backgroundColor: "#e6f0ff" }}
              transition={{ duration: 0.3 }}
            >
              <div className={styles.tabContent}>
                {section.icon}
                <span>{section.title}</span>
              </div>
            </motion.div>
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
                          scale: 1.02,
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

      {/* Promotional and Explore Section */}
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
              whileHover={{ scale: 1.02 }}
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
              whileHover={{ scale: 1.02 }}
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
