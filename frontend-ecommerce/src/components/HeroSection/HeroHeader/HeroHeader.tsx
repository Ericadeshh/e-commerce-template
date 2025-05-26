import { motion } from "framer-motion";
import styles from "./HeroHeader.module.css";

interface HeroHeaderProps {
  serverStatus: boolean;
}

const HeroHeader: React.FC<HeroHeaderProps> = ({ serverStatus }) => {
  return (
    <div className={styles.heroTitleBar}>
      <div className={styles.heroHeader}>
        <h1 className={styles.heroTitle}>Milliwin Boutique</h1>
        <motion.span
          className={styles.serverStatusDot}
          style={{ backgroundColor: serverStatus ? "#00FF00" : "#FF0000" }}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5 }}
        ></motion.span>
      </div>
    </div>
  );
};

export default HeroHeader;
