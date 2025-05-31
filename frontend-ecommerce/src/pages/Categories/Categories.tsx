import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FaArrowRight, FaChevronDown, FaChevronUp } from "react-icons/fa";
import styles from "./Categories.module.css";

interface CategoryItem {
  id: string;
  name: string;
  description: string;
  image: string;
  price: string;
  url: string;
}

interface CategorySection {
  title: string;
  items: CategoryItem[];
}

const categoriesData: CategorySection[] = [
  {
    title: "Clothing Designs",
    items: [
      {
        id: "1",
        name: "Elegant Evening Dress",
        description: "Sleek, floor-length gown with intricate beadwork.",
        image: "https://via.placeholder.com/150?text=Dress",
        price: "$149.99",
        url: "/products/1",
      },
      {
        id: "2",
        name: "Casual Denim Jacket",
        description: "Stylish denim with distressed detailing.",
        image: "https://via.placeholder.com/150?text=Jacket",
        price: "$79.99",
        url: "/products/2",
      },
      {
        id: "3",
        name: "Floral Maxi Skirt",
        description: "Flowy skirt with vibrant floral patterns.",
        image: "https://via.placeholder.com/150?text=Skirt",
        price: "$59.99",
        url: "/products/3",
      },
    ],
  },
  {
    title: "Brands",
    items: [
      {
        id: "4",
        name: "Gucci Silk Scarf",
        description: "Luxurious silk scarf with signature Gucci print.",
        image: "https://via.placeholder.com/150?text=Gucci",
        price: "$199.99",
        url: "/products/4",
      },
      {
        id: "5",
        name: "Nike Athletic Wear",
        description: "Breathable, high-performance sportswear.",
        image: "https://via.placeholder.com/150?text=Nike",
        price: "$89.99",
        url: "/products/5",
      },
      {
        id: "6",
        name: "Zara Trench Coat",
        description: "Classic beige trench with modern cut.",
        image: "https://via.placeholder.com/150?text=Zara",
        price: "$129.99",
        url: "/products/6",
      },
    ],
  },
  {
    title: "Shoes",
    items: [
      {
        id: "7",
        name: "Leather Ankle Boots",
        description: "Premium leather boots with sturdy soles.",
        image: "https://via.placeholder.com/150?text=Boots",
        price: "$99.99",
        url: "/products/7",
      },
      {
        id: "8",
        name: "Running Sneakers",
        description: "Lightweight sneakers for ultimate comfort.",
        image: "https://via.placeholder.com/150?text=Sneakers",
        price: "$69.99",
        url: "/products/8",
      },
      {
        id: "9",
        name: "High Heels",
        description: "Elegant stilettos for formal occasions.",
        image: "https://via.placeholder.com/150?text=Heels",
        price: "$89.99",
        url: "/products/9",
      },
    ],
  },
  {
    title: "Beddings",
    items: [
      {
        id: "10",
        name: "Cotton Duvet Set",
        description: "Soft, breathable cotton duvet with pillowcases.",
        image: "https://via.placeholder.com/150?text=Duvet",
        price: "$119.99",
        url: "/products/10",
      },
      {
        id: "11",
        name: "Satin Bedsheet Set",
        description: "Luxurious satin sheets for a premium feel.",
        image: "https://via.placeholder.com/150?text=Bedsheet",
        price: "$79.99",
        url: "/products/11",
      },
      {
        id: "12",
        name: "Quilted Comforter",
        description: "Warm, cozy comforter for all seasons.",
        image: "https://via.placeholder.com/150?text=Comforter",
        price: "$99.99",
        url: "/products/12",
      },
    ],
  },
  {
    title: "Accessories",
    items: [
      {
        id: "13",
        name: "Leather Handbag",
        description: "Chic handbag with multiple compartments.",
        image: "https://via.placeholder.com/150?text=Handbag",
        price: "$149.99",
        url: "/products/13",
      },
      {
        id: "14",
        name: "Sunglasses",
        description: "Stylish UV-protective sunglasses.",
        image: "https://via.placeholder.com/150?text=Sunglasses",
        price: "$49.99",
        url: "/products/14",
      },
      {
        id: "15",
        name: "Gold Necklace",
        description: "Elegant gold necklace with pendant.",
        image: "https://via.placeholder.com/150?text=Necklace",
        price: "$199.99",
        url: "/products/15",
      },
    ],
  },
];

export default function Categories() {
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  const toggleSection = (title: string) => {
    setExpandedSection(expandedSection === title ? null : title);
  };

  return (
    <div className={styles.categoriesContainer}>
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className={styles.categoriesTitle}
      >
        Shop All Categories
      </motion.h1>
      {categoriesData.map((section) => (
        <div key={section.title} className={styles.categorySection}>
          <motion.div
            className={styles.sectionHeader}
            onClick={() => toggleSection(section.title)}
            whileHover={{ backgroundColor: "#f8f9fa" }}
            transition={{ duration: 0.3 }}
          >
            <h2 className={styles.sectionTitle}>{section.title}</h2>
            {expandedSection === section.title ? (
              <FaChevronUp className={styles.toggleIcon} />
            ) : (
              <FaChevronDown className={styles.toggleIcon} />
            )}
          </motion.div>
          <AnimatePresence>
            {expandedSection === section.title && (
              <motion.div
                className={styles.sectionItems}
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
              >
                <div className={styles.itemsGrid}>
                  {section.items.map((item) => (
                    <motion.div
                      key={item.id}
                      className={styles.itemCard}
                      whileHover={{
                        scale: 1.05,
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
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  );
}
