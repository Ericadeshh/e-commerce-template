import { motion } from "framer-motion";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import styles from "./Pagination.module.css";

interface PaginationProps {
  page: number;
  totalPages: number;
  setPage: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  page,
  totalPages,
  setPage,
}) => {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className={styles.container}>
      <motion.button
        disabled={page === 1}
        onClick={() => setPage(page - 1)}
        className={styles.button}
        whileHover={{ scale: 1.1 }}
        transition={{ duration: 0.2 }}
      >
        <FaChevronLeft />
      </motion.button>
      {pages.map((p) => (
        <motion.button
          key={p}
          onClick={() => setPage(p)}
          className={`${styles.button} ${p === page ? styles.active : ""}`}
          whileHover={{ scale: 1.1 }}
          transition={{ duration: 0.2 }}
        >
          {p}
        </motion.button>
      ))}
      <motion.button
        disabled={page === totalPages}
        onClick={() => setPage(page + 1)}
        className={styles.button}
        whileHover={{ scale: 1.1 }}
        transition={{ duration: 0.2 }}
      >
        <FaChevronRight />
      </motion.button>
    </div>
  );
};

export default Pagination;
