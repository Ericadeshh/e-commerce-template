import { useState, useEffect, useCallback } from "react";
import { Button, Table } from "react-bootstrap";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import styles from "./OrderManagement.module.css";

interface Order {
  id: number;
  customer_id: number;
  order_date: string;
  total_amount: number;
  status: string;
}

const OrderManagement: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [ordersPerPage] = useState(10);
  const navigate = useNavigate();

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    const token = localStorage.getItem("token");
    if (!token) {
      setError("Please log in as an admin");
      navigate("/login");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/admin/orders", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      if (!res.ok) {
        if (res.status === 403) {
          throw new Error("Access denied: Admin privileges required");
        }
        throw new Error(`Failed to fetch orders: ${res.status}`);
      }
      const data = await res.json();
      setOrders(data);
      setError(null);
    } catch (err: unknown) {
      console.error("Error fetching orders:", err);
      const errorMessage =
        err instanceof Error ? err.message : "Failed to fetch orders";
      setError(errorMessage);
      if (errorMessage.includes("Admin privileges required")) {
        navigate("/login");
      }
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const filteredOrders = orders.filter(
    (order) =>
      order.id.toString().includes(searchTerm) ||
      order.customer_id.toString().includes(searchTerm)
  );

  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = filteredOrders.slice(
    indexOfFirstOrder,
    indexOfLastOrder
  );

  return (
    <motion.div
      className={styles.section}
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h3 className={styles.title}>Manage Orders</h3>
      {error && <div className={styles.error}>{error}</div>}
      {loading && <div className={styles.loadingSpinner}>Loading...</div>}

      <div className={styles.searchContainer}>
        <input
          type="text"
          placeholder="Search orders by ID or Customer ID..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={styles.searchInput}
        />
      </div>

      <div className={styles.tableSection}>
        <h4 className={styles.subtitle}>All Orders</h4>
        {currentOrders.length === 0 ? (
          <p className={styles.noOrders}>No orders found.</p>
        ) : (
          <Table
            striped
            bordered
            hover
            responsive
            size="sm"
            className={styles.table}
          >
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer ID</th>
                <th>Order Date</th>
                <th>Total Amount</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentOrders.map((order) => (
                <motion.tr
                  key={order.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <td>{order.id}</td>
                  <td>{order.customer_id}</td>
                  <td>{order.order_date}</td>
                  <td>${order.total_amount.toFixed(2)}</td>
                  <td>{order.status}</td>
                  <td>
                    <Button
                      variant="outline-primary"
                      size="sm"
                      className={styles.viewButton}
                      onClick={() =>
                        alert("View order details functionality TBD")
                      }
                    >
                      View
                    </Button>{" "}
                    <Button
                      variant="outline-warning"
                      size="sm"
                      className={styles.updateButton}
                      onClick={() =>
                        alert("Update order status functionality TBD")
                      }
                    >
                      Update
                    </Button>{" "}
                    <Button
                      variant="outline-danger"
                      size="sm"
                      className={styles.deleteButton}
                      onClick={() => alert("Delete order functionality TBD")}
                    >
                      Delete
                    </Button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </Table>
        )}
        <div className={styles.pagination}>
          <Button
            onClick={() => setCurrentPage(currentPage - 1)}
            disabled={currentPage === 1}
            className={styles.paginationButton}
          >
            Previous
          </Button>
          <span className={styles.pageInfo}>
            Page {currentPage} of{" "}
            {Math.ceil(filteredOrders.length / ordersPerPage)}
          </span>
          <Button
            onClick={() => setCurrentPage(currentPage + 1)}
            disabled={indexOfLastOrder >= filteredOrders.length}
            className={styles.paginationButton}
          >
            Next
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default OrderManagement;
