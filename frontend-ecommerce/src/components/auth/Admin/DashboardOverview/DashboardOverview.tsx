import { useState, useEffect, useCallback } from "react";
import { Card } from "react-bootstrap";
import {
  FaShoppingCart,
  FaBox,
  FaUsers,
  FaComments,
  FaDollarSign,
  FaExclamationTriangle,
  FaStar,
} from "react-icons/fa";
import { Line, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import styles from "./DashboardOverview.module.css";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface DashboardStats {
  totalOrders: number;
  totalStock: number;
  totalUsers: number;
  unreadChats: number;
  totalRevenue: number;
  lowStockItems: number;
  recentReviews: number;
}

const DashboardOverview: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const fetchStats = useCallback(async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("Please log in as an admin");
      navigate("/login");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/admin/stats", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      if (!res.ok) {
        if (res.status === 403) {
          throw new Error("Access denied: Admin privileges required");
        }
        throw new Error(`Failed to fetch stats: ${res.status}`);
      }
      const data = await res.json();
      setStats(data);
      setError(null);
    } catch (err: unknown) {
      console.error("Error fetching stats:", err);
      const errorMessage =
        err instanceof Error ? err.message : "Failed to load dashboard stats";
      setError(errorMessage);
      if (errorMessage.includes("Admin privileges required")) {
        navigate("/login");
      }
    }
  }, [navigate]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  if (error) return <div className={styles.error}>{error}</div>;
  if (!stats) return <div className={styles.loading}>Loading...</div>;

  const lineChartData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May"],
    datasets: [
      {
        label: "Revenue",
        data: [
          stats.totalRevenue * 0.2,
          stats.totalRevenue * 0.4,
          stats.totalRevenue * 0.6,
          stats.totalRevenue * 0.8,
          stats.totalRevenue,
        ],
        borderColor: "#ff1493",
        backgroundColor: "rgba(255, 20, 147, 0.2)",
        fill: true,
      },
    ],
  };

  const barChartData = {
    labels: ["Orders", "Users", "Reviews"],
    datasets: [
      {
        label: "Counts",
        data: [stats.totalOrders, stats.totalUsers, stats.recentReviews],
        backgroundColor: ["#a1dc17", "#9400d3", "#dda0dd"],
      },
    ],
  };

  return (
    <motion.div
      className={styles.overview}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <h3 className={styles.title}>Dashboard Overview</h3>
      <div className={styles.statsGrid}>
        <Card className={styles.statCard}>
          <Card.Body>
            <FaShoppingCart className={styles.icon} />
            <Card.Title>Total Orders</Card.Title>
            <Card.Text>{stats.totalOrders}</Card.Text>
          </Card.Body>
        </Card>
        <Card className={styles.statCard}>
          <Card.Body>
            <FaBox className={styles.icon} />
            <Card.Title>Total Stock</Card.Title>
            <Card.Text>{stats.totalStock}</Card.Text>
          </Card.Body>
        </Card>
        <Card className={styles.statCard}>
          <Card.Body>
            <FaUsers className={styles.icon} />
            <Card.Title>Total Users</Card.Title>
            <Card.Text>{stats.totalUsers}</Card.Text>
          </Card.Body>
        </Card>
        <Card className={styles.statCard}>
          <Card.Body>
            <FaComments className={styles.icon} />
            <Card.Title>Unread Chats</Card.Title>
            <Card.Text>{stats.unreadChats}</Card.Text>
          </Card.Body>
        </Card>
        <Card className={styles.statCard}>
          <Card.Body>
            <FaDollarSign className={styles.icon} />
            <Card.Title>Total Revenue</Card.Title>
            <Card.Text>${stats.totalRevenue.toFixed(2)}</Card.Text>
          </Card.Body>
        </Card>
        <Card className={styles.statCard}>
          <Card.Body>
            <FaExclamationTriangle className={styles.icon} />
            <Card.Title>Low Stock Items</Card.Title>
            <Card.Text>{stats.lowStockItems}</Card.Text>
          </Card.Body>
        </Card>
        <Card className={styles.statCard}>
          <Card.Body>
            <FaStar className={styles.icon} />
            <Card.Title>Recent Reviews</Card.Title>
            <Card.Text>{stats.recentReviews}</Card.Text>
          </Card.Body>
        </Card>
      </div>

      <div className={styles.charts}>
        <Card className={styles.chartCard}>
          <Card.Title className={styles.chartTitle}>Revenue Trend</Card.Title>
          <Line
            data={lineChartData}
            options={{
              responsive: true,
              plugins: { legend: { position: "top" } },
            }}
          />
        </Card>
        <Card className={styles.chartCard}>
          <Card.Title className={styles.chartTitle}>
            Activity Overview
          </Card.Title>
          <Bar
            data={barChartData}
            options={{
              responsive: true,
              plugins: { legend: { position: "top" } },
            }}
          />
        </Card>
      </div>
    </motion.div>
  );
};

export default DashboardOverview;
