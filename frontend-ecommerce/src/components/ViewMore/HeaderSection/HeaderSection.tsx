import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FaSearch } from "react-icons/fa";
import { CategoryMetadata } from "../../../types/ViewMore";
import styles from "./HeaderSection.module.css";

interface HeaderSectionProps {
  metadata: CategoryMetadata;
}

const HeaderSection: React.FC<HeaderSectionProps> = ({ metadata }) => {
  const handleSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const searchInput = event.currentTarget.querySelector("input")?.value;
    if (searchInput) {
      console.log(`Searching for: ${searchInput}`);
      // Implement search logic here
    }
  };

  return (
    <motion.div
      className={styles.container}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div className={styles.breadcrumbs}>
        <Link to="/">Home</Link> {">"} <span>{metadata.name}</span>
      </div>
      <div className={styles.contentWrapper}>
        <motion.img
          src={metadata.heroImage}
          alt={`${metadata.name} banner`}
          className={styles.heroImage}
          loading="lazy"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
        />
        <motion.div
          className={styles.textContent}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.4 }}
        >
          <h1 className={styles.title}>{metadata.name}</h1>
          <p className={styles.description}>{metadata.description}</p>
          <form onSubmit={handleSearch} className={styles.searchBar}>
            <input
              type="text"
              placeholder={`Search in ${metadata.name}`}
              className={styles.searchInput}
            />
            <button type="submit" className={styles.searchButton}>
              <FaSearch />
            </button>
          </form>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default HeaderSection;
