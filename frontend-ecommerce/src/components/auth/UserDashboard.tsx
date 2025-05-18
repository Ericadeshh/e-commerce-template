import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./UserDashboard.module.css";

export default function UserDashboard() {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    }
  }, [navigate]);

  return (
    <div className={styles.dashboard}>
      <h1>User Dashboard</h1>
      <p>Welcome to your dashboard. Features coming soon!</p>
    </div>
  );
}
