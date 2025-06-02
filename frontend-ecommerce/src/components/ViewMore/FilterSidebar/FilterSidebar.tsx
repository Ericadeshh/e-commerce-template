import { useState } from "react";
import { motion } from "framer-motion";
import {
  FaFilter,
  FaTshirt,
  FaPalette,
  FaCubes,
  FaShapes,
  FaMoneyBillWave,
  FaBox,
} from "react-icons/fa";
import { FilterOptions } from "../../../types/ViewMore";
import { staticFilters } from "../../../static/filters";
import styles from "./FilterSidebar.module.css";

interface FilterSidebarProps {
  filters: FilterOptions;
  setFilters: (filters: FilterOptions) => void;
  category: string;
}

const FilterSidebar: React.FC<FilterSidebarProps> = ({
  filters,
  setFilters,
  category,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const filterConfig =
    staticFilters[category.toLowerCase()] || staticFilters.default;

  const toggleFilter = (
    key: keyof Omit<FilterOptions, "priceRange" | "inStock">,
    value: string
  ) => {
    const current = filters[key] as string[];
    setFilters({
      ...filters,
      [key]: current.includes(value)
        ? current.filter((v) => v !== value)
        : [...current, value],
    });
  };

  const handlePriceChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const newRange = [...filters.priceRange];
    newRange[index] = Number(e.target.value);
    setFilters({ ...filters, priceRange: newRange as [number, number] });
  };

  const filterGroupVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  };

  return (
    <motion.div
      className={styles.container}
      initial={{ x: -100 }}
      animate={{ x: 0 }}
      transition={{ duration: 0.3 }}
    >
      <motion.button
        className={styles.mobileToggle}
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.05 }}
        transition={{ duration: 0.2 }}
      >
        <FaFilter /> Filters
      </motion.button>
      <div className={`${styles.filterContent} ${isOpen ? styles.open : ""}`}>
        <h3 className={styles.title}>Filters</h3>
        <motion.button
          className={styles.resetButton}
          onClick={() =>
            setFilters({
              sizes: [],
              colors: [],
              materials: [],
              styles: [],
              brands: [],
              priceRange: [0, 200],
              inStock: false,
            })
          }
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.2 }}
        >
          Reset Filters
        </motion.button>

        <motion.div
          className={styles.filterGroup}
          variants={filterGroupVariants}
          initial="hidden"
          animate="visible"
        >
          <h4>
            <FaTshirt className={styles.icon} /> Size
          </h4>
          {filterConfig.sizes.map((size) => (
            <label key={size} className={styles.checkbox}>
              <input
                type="checkbox"
                checked={filters.sizes.includes(size)}
                onChange={() => toggleFilter("sizes", size)}
              />
              {size}
            </label>
          ))}
        </motion.div>

        <motion.div
          className={styles.filterGroup}
          variants={filterGroupVariants}
          initial="hidden"
          animate="visible"
        >
          <h4>
            <FaPalette className={styles.icon} /> Color
          </h4>
          {filterConfig.colors.map((color) => (
            <label key={color} className={styles.checkbox}>
              <input
                type="checkbox"
                checked={filters.colors.includes(color)}
                onChange={() => toggleFilter("colors", color)}
              />
              {color}
            </label>
          ))}
        </motion.div>

        <motion.div
          className={styles.filterGroup}
          variants={filterGroupVariants}
          initial="hidden"
          animate="visible"
        >
          <h4>
            <FaCubes className={styles.icon} /> Material
          </h4>
          {filterConfig.materials.map((material) => (
            <label key={material} className={styles.checkbox}>
              <input
                type="checkbox"
                checked={filters.materials.includes(material)}
                onChange={() => toggleFilter("materials", material)}
              />
              {material}
            </label>
          ))}
        </motion.div>

        <motion.div
          className={styles.filterGroup}
          variants={filterGroupVariants}
          initial="hidden"
          animate="visible"
        >
          <h4>
            <FaShapes className={styles.icon} /> Style
          </h4>
          {filterConfig.styles.map((style) => (
            <label key={style} className={styles.checkbox}>
              <input
                type="checkbox"
                checked={filters.styles.includes(style)}
                onChange={() => toggleFilter("styles", style)}
              />
              {style}
            </label>
          ))}
        </motion.div>

        <motion.div
          className={styles.filterGroup}
          variants={filterGroupVariants}
          initial="hidden"
          animate="visible"
        >
          <h4>
            <FaMoneyBillWave className={styles.icon} /> Price Range
          </h4>
          <input
            type="range"
            min="0"
            max="200"
            value={filters.priceRange[0]}
            onChange={(e) => handlePriceChange(e, 0)}
          />
          <input
            type="range"
            min="0"
            max="200"
            value={filters.priceRange[1]}
            onChange={(e) => handlePriceChange(e, 1)}
          />
          <div>
            ${filters.priceRange[0]} - ${filters.priceRange[1]}
          </div>
        </motion.div>

        <motion.div
          className={styles.filterGroup}
          variants={filterGroupVariants}
          initial="hidden"
          animate="visible"
        >
          <label className={styles.checkbox}>
            <input
              type="checkbox"
              checked={filters.inStock}
              onChange={() =>
                setFilters({ ...filters, inStock: !filters.inStock })
              }
            />
            <FaBox className={styles.icon} /> In Stock Only
          </label>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default FilterSidebar;
