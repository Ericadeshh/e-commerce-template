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
      <button
        disabled={page === 1}
        onClick={() => setPage(page - 1)}
        className={styles.button}
      >
        Previous
      </button>
      {pages.map((p) => (
        <button
          key={p}
          onClick={() => setPage(p)}
          className={`${styles.button} ${p === page ? styles.active : ""}`}
        >
          {p}
        </button>
      ))}
      <button
        disabled={page === totalPages}
        onClick={() => setPage(page + 1)}
        className={styles.button}
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;
