import { Form } from "react-bootstrap";
import { FaGift } from "react-icons/fa";
import styles from "./AdditionalOptions.module.css";

interface AdditionalOptionsProps {
  giftWrapping: boolean;
  setGiftWrapping: (value: boolean) => void;
}

const AdditionalOptions: React.FC<AdditionalOptionsProps> = ({
  giftWrapping,
  setGiftWrapping,
}) => {
  return (
    <div className={styles.additionalOptions}>
      <h4 className={styles.sectionTitle}>
        <FaGift className={styles.sectionIcon} /> Additional Options
      </h4>
      <Form.Check
        type="checkbox"
        label={
          <span>
            <FaGift className={styles.optionIcon} /> Add gift wrapping (+KSh
            150)
          </span>
        }
        checked={giftWrapping}
        onChange={() => setGiftWrapping(!giftWrapping)}
        className={styles.giftWrapping}
      />
    </div>
  );
};

export default AdditionalOptions;
