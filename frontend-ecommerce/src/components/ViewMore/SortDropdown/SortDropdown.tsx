import { motion } from "framer-motion";
import { FaSort } from "react-icons/fa";
import { SortOption } from "../../../types/ViewMore";
import styles from "./SortDropdown.module.css";

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
  return (
    <motion.div
      className={styles.container}
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
    >
      <label htmlFor="sort">
        <FaSort className={styles.sortIcon} /> Sort By:
      </label>
      <select
        id="sort"
        value={sort.value}
        onChange={(e) =>
          setSort(sortOptions.find((opt) => opt.value === e.target.value)!)
        }
        className={styles.sortDrop}
      >
        {sortOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </motion.div>
  );
};

export default SortDropdown;
