import { useState } from "react";
import { motion } from "framer-motion";
import { FaFilter } from "react-icons/fa";
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

  return (
    <motion.div
      className={styles.container}
      initial={{ x: -100 }}
      animate={{ x: 0 }}
      transition={{ duration: 0.3 }}
    >
      <button
        className={styles.mobileToggle}
        onClick={() => setIsOpen(!isOpen)}
      >
        <FaFilter /> Filters
      </button>
      <div className={`${styles.filterContent} ${isOpen ? styles.open : ""}`}>
        <h3 className={styles.title}>Filters</h3>
        <button
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
        >
          Reset Filters
        </button>

        <div className={styles.filterGroup}>
          <h4>Size</h4>
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
        </div>

        <div className={styles.filterGroup}>
          <h4>Color</h4>
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
        </div>

        <div className={styles.filterGroup}>
          <h4>Material</h4>
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
        </div>

        <div className={styles.filterGroup}>
          <h4>Style</h4>
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
        </div>

        <div className={styles.filterGroup}>
          <h4>Price Range</h4>
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
        </div>

        <div className={styles.filterGroup}>
          <label className={styles.checkbox}>
            <input
              type="checkbox"
              checked={filters.inStock}
              onChange={() =>
                setFilters({ ...filters, inStock: !filters.inStock })
              }
            />
            In Stock Only
          </label>
        </div>
      </div>
    </motion.div>
  );
};

export default FilterSidebar;
