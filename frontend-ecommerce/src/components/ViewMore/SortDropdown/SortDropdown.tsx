import { motion } from "framer-motion";
import { FaSort, FaAngleDown } from "react-icons/fa";
import { SortOption } from "../../../types/ViewMore";
import styles from "./SortDropdown.module.css";
import { useState, useRef, useEffect } from "react";

interface SortDropdownProps {
  sort: SortOption;
  setSort: (sort: SortOption) => void;
}

const sortOptions: SortOption[] = [
  { label: "Price: Low to High", value: "price-asc" },
  { label: "Price: High to Low", value: "price-desc" },
  { label: "Newest First", value: "newest" },
  { label: "Best Sellers", value: "bestsellers" },
  { label: "Discounted", value: "discounted" },
];

const SortDropdown: React.FC<SortDropdownProps> = ({ sort, setSort }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleSelect = (option: SortOption) => {
    setSort(option);
    setIsOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <motion.div
      className={styles.container}
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
    >
      <label className={styles.label}>
        <FaSort className={styles.sortIcon} /> Sort By:
      </label>
      <div className={styles.dropdownWrapper} ref={dropdownRef}>
        <button
          className={styles.trigger}
          onClick={() => setIsOpen((prev) => !prev)}
        >
          {sort.label} <FaAngleDown className={styles.arrowIcon} />
        </button>
        {isOpen && (
          <div className={styles.dropdown}>
            {sortOptions.map((option) => (
              <div
                key={option.value}
                className={styles.dropdownItem}
                onClick={() => handleSelect(option)}
              >
                {option.label}
              </div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default SortDropdown;
