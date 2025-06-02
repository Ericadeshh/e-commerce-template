import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FaSearch } from "react-icons/fa";
import { CategoryMetadata } from "../../../types/ViewMore";
import styles from "./HeaderSection.module.css";

interface HeaderSectionProps {
  metadata: CategoryMetadata;
}

const HeaderSection: React.FC<HeaderSectionProps> = ({ metadata }) => {
  return (
    <motion.div
      className={styles.container}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className={styles.breadcrumbs}>
        <Link to="/">Home</Link> &gt; <span>{metadata.name}</span>
      </div>
      <img
        src={metadata.heroImage}
        alt={`${metadata.name} banner`}
        className={styles.heroImage}
        loading="lazy"
      />
      <h1 className={styles.title}>{metadata.name}</h1>
      <p className={styles.description}>{metadata.description}</p>
      <div className={styles.searchBar}>
        <FaSearch className={styles.searchIcon} />
        <input
          type="text"
          placeholder={`Search in ${metadata.name}`}
          className={styles.searchInput}
        />
      </div>
    </motion.div>
  );
};

export default HeaderSection;
