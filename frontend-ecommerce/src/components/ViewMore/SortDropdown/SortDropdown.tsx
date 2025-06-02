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
    <div className={styles.container}>
      <label htmlFor="sort">Sort By:</label>
      <select
        id="sort"
        value={sort.value}
        onChange={(e) =>
          setSort(sortOptions.find((opt) => opt.value === e.target.value)!)
        }
        className={styles.dropdown}
      >
        {sortOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default SortDropdown;
