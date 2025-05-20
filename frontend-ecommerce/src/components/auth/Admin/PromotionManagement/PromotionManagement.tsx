import { useState, useEffect, useCallback } from "react";
import { Button, Form, Table } from "react-bootstrap";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import styles from "./PromotionManagement.module.css";

interface Promotion {
  id: number;
  title: string;
  description: string;
  discount_percentage: number;
  start_date: string;
  end_date: string;
  is_active: boolean;
}

const PromotionManagement: React.FC = () => {
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [editingPromotion, setEditingPromotion] = useState<Promotion | null>(
    null
  );
  const [newPromotion, setNewPromotion] = useState<Partial<Promotion>>({
    title: "",
    description: "",
    discount_percentage: 0,
    start_date: "",
    end_date: "",
    is_active: true,
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [promotionsPerPage] = useState(10);
  const navigate = useNavigate();

  const fetchPromotions = useCallback(async () => {
    setLoading(true);
    const token = localStorage.getItem("token");
    if (!token) {
      setError("Please log in as an admin");
      navigate("/login");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/admin/promotions", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      if (!res.ok) {
        if (res.status === 403) {
          throw new Error("Access denied: Admin privileges required");
        }
        throw new Error(`Failed to fetch promotions: ${res.status}`);
      }
      const data = await res.json();
      setPromotions(data);
      setError(null);
    } catch (err: unknown) {
      console.error("Error fetching promotions:", err);
      const errorMessage =
        err instanceof Error ? err.message : "Failed to fetch promotions";
      setError(errorMessage);
      if (errorMessage.includes("Admin privileges required")) {
        navigate("/login");
      }
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    fetchPromotions();
  }, [fetchPromotions]);

  const handleCreatePromotion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !newPromotion.title ||
      !newPromotion.discount_percentage ||
      !newPromotion.start_date ||
      !newPromotion.end_date
    ) {
      setError("Please fill in all required fields");
      return;
    }
    const token = localStorage.getItem("token");
    if (!token) {
      setError("Please log in as an admin");
      navigate("/login");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/admin/promotions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newPromotion),
      });
      if (!res.ok) {
        if (res.status === 403) {
          throw new Error("Access denied: Admin privileges required");
        }
        throw new Error(`Failed to create promotion: ${res.status}`);
      }
      setNewPromotion({
        title: "",
        description: "",
        discount_percentage: 0,
        start_date: "",
        end_date: "",
        is_active: true,
      });
      setError(null);
      fetchPromotions();
    } catch (err: unknown) {
      console.error("Error creating promotion:", err);
      const errorMessage =
        err instanceof Error ? err.message : "Failed to create promotion";
      setError(errorMessage);
      if (errorMessage.includes("Admin privileges required")) {
        navigate("/login");
      }
    }
  };

  const handleUpdatePromotion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !editingPromotion ||
      !editingPromotion.title ||
      !editingPromotion.discount_percentage ||
      !editingPromotion.start_date ||
      !editingPromotion.end_date
    ) {
      setError("Please fill in all required fields");
      return;
    }
    const token = localStorage.getItem("token");
    if (!token) {
      setError("Please log in as an admin");
      navigate("/login");
      return;
    }

    try {
      const res = await fetch(
        `http://localhost:5000/api/admin/promotions/${editingPromotion.id}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(editingPromotion),
        }
      );
      if (!res.ok) {
        if (res.status === 403) {
          throw new Error("Access denied: Admin privileges required");
        }
        throw new Error(`Failed to update promotion: ${res.status}`);
      }
      setEditingPromotion(null);
      setError(null);
      fetchPromotions();
    } catch (err: unknown) {
      console.error("Error updating promotion:", err);
      const errorMessage =
        err instanceof Error ? err.message : "Failed to update promotion";
      setError(errorMessage);
      if (errorMessage.includes("Admin privileges required")) {
        navigate("/login");
      }
    }
  };

  const handleDeletePromotion = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this promotion?"))
      return;
    const token = localStorage.getItem("token");
    if (!token) {
      setError("Please log in as an admin");
      navigate("/login");
      return;
    }

    try {
      const res = await fetch(
        `http://localhost:5000/api/admin/promotions/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (!res.ok) {
        if (res.status === 403) {
          throw new Error("Access denied: Admin privileges required");
        }
        throw new Error(`Failed to delete promotion: ${res.status}`);
      }
      setError(null);
      fetchPromotions();
    } catch (err: unknown) {
      console.error("Error deleting promotion:", err);
      const errorMessage =
        err instanceof Error ? err.message : "Failed to delete promotion";
      setError(errorMessage);
      if (errorMessage.includes("Admin privileges required")) {
        navigate("/login");
      }
    }
  };

  const filteredPromotions = promotions.filter((promotion) =>
    promotion.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastPromotion = currentPage * promotionsPerPage;
  const indexOfFirstPromotion = indexOfLastPromotion - promotionsPerPage;
  const currentPromotions = filteredPromotions.slice(
    indexOfFirstPromotion,
    indexOfLastPromotion
  );

  return (
    <motion.div
      className={styles.section}
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h3 className={styles.title}>Manage Promotions</h3>
      {error && <div className={styles.error}>{error}</div>}
      {loading && <div className={styles.loadingSpinner}>Loading...</div>}

      <div className={styles.formSection}>
        <h4 className={styles.subtitle}>Create New Promotion</h4>
        <Form onSubmit={handleCreatePromotion}>
          <Form.Group className="mb-3">
            <Form.Label>Title</Form.Label>
            <Form.Control
              type="text"
              value={newPromotion.title}
              onChange={(e) =>
                setNewPromotion({ ...newPromotion, title: e.target.value })
              }
              required
              className={styles.inputField}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Description</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={newPromotion.description}
              onChange={(e) =>
                setNewPromotion({
                  ...newPromotion,
                  description: e.target.value,
                })
              }
              className={styles.inputField}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Discount Percentage</Form.Label>
            <Form.Control
              type="number"
              value={newPromotion.discount_percentage}
              onChange={(e) =>
                setNewPromotion({
                  ...newPromotion,
                  discount_percentage: parseInt(e.target.value),
                })
              }
              required
              className={styles.inputField}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Start Date</Form.Label>
            <Form.Control
              type="date"
              value={newPromotion.start_date}
              onChange={(e) =>
                setNewPromotion({ ...newPromotion, start_date: e.target.value })
              }
              required
              className={styles.inputField}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>End Date</Form.Label>
            <Form.Control
              type="date"
              value={newPromotion.end_date}
              onChange={(e) =>
                setNewPromotion({ ...newPromotion, end_date: e.target.value })
              }
              required
              className={styles.inputField}
            />
          </Form.Group>
          <Form.Check
            type="checkbox"
            label="Active"
            checked={newPromotion.is_active}
            onChange={(e) =>
              setNewPromotion({ ...newPromotion, is_active: e.target.checked })
            }
            className={styles.checkbox}
          />
          <Button type="submit" className={styles.submitButton}>
            Create Promotion
          </Button>
        </Form>
      </div>

      {editingPromotion && (
        <div className={styles.formSection}>
          <h4 className={styles.subtitle}>Edit Promotion</h4>
          <Form onSubmit={handleUpdatePromotion}>
            <Form.Group className="mb-3">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                value={editingPromotion.title}
                onChange={(e) =>
                  setEditingPromotion({
                    ...editingPromotion,
                    title: e.target.value,
                  })
                }
                required
                className={styles.inputField}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={editingPromotion.description}
                onChange={(e) =>
                  setEditingPromotion({
                    ...editingPromotion,
                    description: e.target.value,
                  })
                }
                className={styles.inputField}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Discount Percentage</Form.Label>
              <Form.Control
                type="number"
                value={editingPromotion.discount_percentage}
                onChange={(e) =>
                  setEditingPromotion({
                    ...editingPromotion,
                    discount_percentage: parseInt(e.target.value),
                  })
                }
                required
                className={styles.inputField}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Start Date</Form.Label>
              <Form.Control
                type="date"
                value={editingPromotion.start_date}
                onChange={(e) =>
                  setEditingPromotion({
                    ...editingPromotion,
                    start_date: e.target.value,
                  })
                }
                required
                className={styles.inputField}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>End Date</Form.Label>
              <Form.Control
                type="date"
                value={editingPromotion.end_date}
                onChange={(e) =>
                  setEditingPromotion({
                    ...editingPromotion,
                    end_date: e.target.value,
                  })
                }
                required
                className={styles.inputField}
              />
            </Form.Group>
            <Form.Check
              type="checkbox"
              label="Active"
              checked={editingPromotion.is_active}
              onChange={(e) =>
                setEditingPromotion({
                  ...editingPromotion,
                  is_active: e.target.checked,
                })
              }
              className={styles.checkbox}
            />
            <Button type="submit" className={styles.submitButton}>
              Update Promotion
            </Button>
            <Button
              variant="outline-secondary"
              onClick={() => setEditingPromotion(null)}
              className={styles.cancelButton}
            >
              Cancel
            </Button>
          </Form>
        </div>
      )}

      <div className={styles.searchContainer}>
        <input
          type="text"
          placeholder="Search promotions by title..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={styles.searchInput}
        />
      </div>

      <div className={styles.tableSection}>
        <h4 className={styles.subtitle}>All Promotions</h4>
        {loading ? (
          <div className={styles.loadingSpinner}>Loading...</div>
        ) : (
          <>
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
                  <th>ID</th>
                  <th>Title</th>
                  <th>Description</th>
                  <th>Discount %</th>
                  <th>Start Date</th>
                  <th>End Date</th>
                  <th>Active</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentPromotions.length === 0 ? (
                  <tr>
                    <td colSpan={8} className={styles.noPromotions}>
                      No promotions found.
                    </td>
                  </tr>
                ) : (
                  currentPromotions.map((promotion) => (
                    <motion.tr
                      key={promotion.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      <td>{promotion.id}</td>
                      <td>{promotion.title}</td>
                      <td>{promotion.description}</td>
                      <td>{promotion.discount_percentage}%</td>
                      <td>{promotion.start_date}</td>
                      <td>{promotion.end_date}</td>
                      <td>{promotion.is_active ? "Yes" : "No"}</td>
                      <td>
                        <Button
                          variant="outline-primary"
                          size="sm"
                          onClick={() => setEditingPromotion(promotion)}
                          className={styles.editButton}
                        >
                          Edit
                        </Button>{" "}
                        <Button
                          variant="outline-danger"
                          size="sm"
                          onClick={() => handleDeletePromotion(promotion.id)}
                          className={styles.deleteButton}
                        >
                          Delete
                        </Button>
                      </td>
                    </motion.tr>
                  ))
                )}
              </tbody>
            </Table>
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
                {Math.ceil(filteredPromotions.length / promotionsPerPage)}
              </span>
              <Button
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={indexOfLastPromotion >= filteredPromotions.length}
                className={styles.paginationButton}
              >
                Next
              </Button>
            </div>
          </>
        )}
      </div>
    </motion.div>
  );
};

export default PromotionManagement;
