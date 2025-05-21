import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import CategoryCarousel from "../CategoryCarousel/CategoryCarousel";
import styles from "./FeaturedCategories.module.css";

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  category: string;
  stock: number;
  original_price?: number | null;
  discount_percentage?: number | null;
  is_new?: boolean;
}

interface Category {
  name: string;
  products: Product[];
}

const staticCategories: Category[] = [
  {
    name: "Men's",
    products: [
      {
        id: 1,
        name: "Men's Jacket",
        price: 89.99,
        image: "https://placehold.co/300x300",
        category: "mens",
        stock: 10,
        discount_percentage: 20,
        original_price: 109.99,
      },
      {
        id: 2,
        name: "Men's Sneakers",
        price: 79.99,
        image: "https://placehold.co/300x300",
        category: "mens",
        stock: 15,
        is_new: true,
      },
      {
        id: 3,
        name: "Men's Shirt",
        price: 49.99,
        image: "https://placehold.co/300x300",
        category: "mens",
        stock: 20,
      },
      {
        id: 4,
        name: "Men's Jeans",
        price: 59.99,
        image: "https://placehold.co/300x300",
        category: "mens",
        stock: 12,
      },
      {
        id: 5,
        name: "Men's Cap",
        price: 29.99,
        image: "https://placehold.co/300x300",
        category: "mens",
        stock: 18,
      },
      {
        id: 6,
        name: "Men's Belt",
        price: 39.99,
        image: "https://placehold.co/300x300",
        category: "mens",
        stock: 25,
      },
      {
        id: 7,
        name: "Men's Watch",
        price: 99.99,
        image: "https://placehold.co/300x300",
        category: "mens",
        stock: 8,
      },
    ],
  },
  {
    name: "Women's",
    products: [
      {
        id: 8,
        name: "Summer Dress",
        price: 49.99,
        image: "https://placehold.co/300x300",
        category: "womens",
        stock: 20,
        discount_percentage: 15,
        original_price: 59.99,
      },
      {
        id: 9,
        name: "Women's Heels",
        price: 69.99,
        image: "https://placehold.co/300x300",
        category: "womens",
        stock: 10,
      },
      {
        id: 10,
        name: "Women's Blouse",
        price: 39.99,
        image: "https://placehold.co/300x300",
        category: "womens",
        stock: 15,
        is_new: true,
      },
      {
        id: 11,
        name: "Women's Skirt",
        price: 44.99,
        image: "https://placehold.co/300x300",
        category: "womens",
        stock: 12,
      },
      {
        id: 12,
        name: "Women's Scarf",
        price: 29.99,
        image: "https://placehold.co/300x300",
        category: "womens",
        stock: 18,
      },
      {
        id: 13,
        name: "Women's Bag",
        price: 79.99,
        image: "https://placehold.co/300x300",
        category: "womens",
        stock: 9,
      },
      {
        id: 14,
        name: "Women's Sunglasses",
        price: 59.99,
        image: "https://placehold.co/300x300",
        category: "womens",
        stock: 11,
      },
    ],
  },
  {
    name: "Children's",
    products: [
      {
        id: 15,
        name: "Kids T-Shirt",
        price: 19.99,
        image: "https://placehold.co/300x300",
        category: "childrens",
        stock: 30,
      },
      {
        id: 16,
        name: "Kids Sneakers",
        price: 39.99,
        image: "https://placehold.co/300x300",
        category: "childrens",
        stock: 20,
        discount_percentage: 10,
        original_price: 44.99,
      },
      {
        id: 17,
        name: "Kids Jacket",
        price: 49.99,
        image: "https://placehold.co/300x300",
        category: "childrens",
        stock: 15,
      },
      {
        id: 18,
        name: "Kids Shorts",
        price: 24.99,
        image: "https://placehold.co/300x300",
        category: "childrens",
        stock: 18,
        is_new: true,
      },
      {
        id: 19,
        name: "Kids Cap",
        price: 14.99,
        image: "https://placehold.co/300x300",
        category: "childrens",
        stock: 25,
      },
      {
        id: 20,
        name: "Kids Backpack",
        price: 29.99,
        image: "https://placehold.co/300x300",
        category: "childrens",
        stock: 12,
      },
      {
        id: 21,
        name: "Kids Socks",
        price: 9.99,
        image: "https://placehold.co/300x300",
        category: "childrens",
        stock: 30,
      },
    ],
  },
  {
    name: "Shoes",
    products: [
      {
        id: 22,
        name: "Running Shoes",
        price: 79.99,
        image: "https://placehold.co/300x300",
        category: "shoes",
        stock: 15,
      },
      {
        id: 23,
        name: "Casual Sneakers",
        price: 59.99,
        image: "https://placehold.co/300x300",
        category: "shoes",
        stock: 20,
      },
      {
        id: 24,
        name: "Formal Shoes",
        price: 89.99,
        image: "https://placehold.co/300x300",
        category: "shoes",
        stock: 10,
        discount_percentage: 25,
        original_price: 119.99,
      },
      {
        id: 25,
        name: "Sandals",
        price: 39.99,
        image: "https://placehold.co/300x300",
        category: "shoes",
        stock: 18,
      },
      {
        id: 26,
        name: "Boots",
        price: 99.99,
        image: "https://placehold.co/300x300",
        category: "shoes",
        stock: 12,
      },
      {
        id: 27,
        name: "Slippers",
        price: 29.99,
        image: "https://placehold.co/300x300",
        category: "shoes",
        stock: 25,
        is_new: true,
      },
      {
        id: 28,
        name: "High Heels",
        price: 69.99,
        image: "https://placehold.co/300x300",
        category: "shoes",
        stock: 8,
      },
    ],
  },
  {
    name: "Beddings",
    products: [
      {
        id: 29,
        name: "Cotton Duvet",
        price: 99.99,
        image: "https://placehold.co/300x300",
        category: "beddings",
        stock: 10,
      },
      {
        id: 30,
        name: "Pillow Set",
        price: 49.99,
        image: "https://placehold.co/300x300",
        category: "beddings",
        stock: 15,
      },
      {
        id: 31,
        name: "Bed Sheet",
        price: 59.99,
        image: "https://placehold.co/300x300",
        category: "beddings",
        stock: 12,
        discount_percentage: 15,
        original_price: 69.99,
      },
      {
        id: 32,
        name: "Comforter",
        price: 79.99,
        image: "https://placehold.co/300x300",
        category: "beddings",
        stock: 8,
      },
      {
        id: 33,
        name: "Mattress Cover",
        price: 39.99,
        image: "https://placehold.co/300x300",
        category: "beddings",
        stock: 20,
      },
      {
        id: 34,
        name: "Blanket",
        price: 69.99,
        image: "https://placehold.co/300x300",
        category: "beddings",
        stock: 10,
        is_new: true,
      },
      {
        id: 35,
        name: "Cushion Set",
        price: 29.99,
        image: "https://placehold.co/300x300",
        category: "beddings",
        stock: 18,
      },
    ],
  },
];

const FeaturedCategories: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>(staticCategories);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const fetchedCategories = await Promise.all(
          staticCategories.map(async (category) => {
            const res = await fetch(
              `http://localhost:5000/api/products?category=${category.name.toLowerCase()}`
            );
            if (!res.ok)
              throw new Error(
                `Failed to fetch ${category.name} products: ${res.status}`
              );
            const data: Product[] = await res.json();
            return {
              name: category.name,
              products: data.map((product) => ({
                ...product,
                image: product.image || "https://placehold.co/300x300",
                price: parseFloat(String(product.price)),
                stock: Number(product.stock),
                original_price: product.original_price
                  ? parseFloat(String(product.original_price))
                  : null,
                discount_percentage: product.discount_percentage
                  ? Number(product.discount_percentage)
                  : null,
              })),
            };
          })
        );
        setCategories(fetchedCategories);
        setError(null);
      } catch (err) {
        console.error("Error fetching categories:", err);
        setError("Failed to load categories. Showing static content.");
        setCategories(staticCategories);
      }
    };

    fetchCategories();
  }, []);

  return (
    <motion.section
      className={styles.section}
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className={styles.sectionTitle}>Featured Categories</h2>
      {error && <div className={styles.error}>{error}</div>}
      {categories.map((category) => (
        <CategoryCarousel
          key={category.name}
          category={category.name}
          products={category.products}
        />
      ))}
    </motion.section>
  );
};

export default FeaturedCategories;
