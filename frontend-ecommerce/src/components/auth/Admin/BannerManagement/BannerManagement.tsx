import { useState, useEffect, useCallback } from "react";
import { Button, Form, Table } from "react-bootstrap";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import styles from "./BannerManagement.module.css";

interface Banner {
  id: number;
  title: string;
  description: string;
  image_url: string;
  cta_text: string;
  cta_url: string;
  is_active: boolean;
}

const BannerManagement: React.FC = () => {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null);
  const [newBanner, setNewBanner] = useState<Partial<Banner>>({
    title: "",
    description: "",
    image_url: "",
    cta_text: "",
    cta_url: "",
    is_active: true,
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const fetchBanners = useCallback(async () => {
    setLoading(true);
    const token = localStorage.getItem("token");
    if (!token) {
      setError("Please log in as an admin");
      navigate("/login");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/admin/banners", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      if (!res.ok) {
        if (res.status === 403) {
          throw new Error("Access denied: Admin privileges required");
        }
        throw new Error(`Failed to fetch banners: ${res.status}`);
      }
      const data = await res.json();
      setBanners(data);
      setError(null);
    } catch (err: unknown) {
      console.error("Error fetching banners:", err);
      const errorMessage =
        err instanceof Error ? err.message : "Failed to fetch banners";
      setError(errorMessage);
      if (errorMessage.includes("Admin privileges required")) {
        navigate("/login");
      }
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    fetchBanners();
  }, [fetchBanners]);

  const handleCreateBanner = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBanner.title || !newBanner.image_url) {
      setError("Title and Image URL are required");
      return;
    }
    const token = localStorage.getItem("token");
    if (!token) {
      setError("Please log in as an admin");
      navigate("/login");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/admin/banners", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newBanner),
      });
      if (!res.ok) {
        if (res.status === 403) {
          throw new Error("Access denied: Admin privileges required");
        }
        throw new Error(`Failed to create banner: ${res.status}`);
      }
      setNewBanner({
        title: "",
        description: "",
        image_url: "",
        cta_text: "",
        cta_url: "",
        is_active: true,
      });
      setError(null);
      fetchBanners();
    } catch (err: unknown) {
      console.error("Error creating banner:", err);
      const errorMessage =
        err instanceof Error ? err.message : "Failed to create banner";
      setError(errorMessage);
      if (errorMessage.includes("Admin privileges required")) {
        navigate("/login");
      }
    }
  };

  const handleUpdateBanner = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBanner || !editingBanner.title || !editingBanner.image_url) {
      setError("Title and Image URL are required");
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
        `http://localhost:5000/api/admin/banners/${editingBanner.id}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(editingBanner),
        }
      );
      if (!res.ok) {
        if (res.status === 403) {
          throw new Error("Access denied: Admin privileges required");
        }
        throw new Error(`Failed to update banner: ${res.status}`);
      }
      setEditingBanner(null);
      setError(null);
      fetchBanners();
    } catch (err: unknown) {
      console.error("Error updating banner:", err);
      const errorMessage =
        err instanceof Error ? err.message : "Failed to update banner";
      setError(errorMessage);
      if (errorMessage.includes("Admin privileges required")) {
        navigate("/login");
      }
    }
  };

  const handleDeleteBanner = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this banner?")) return;
    const token = localStorage.getItem("token");
    if (!token) {
      setError("Please log in as an admin");
      navigate("/login");
      return;
    }

    try {
      const res = await fetch(`http://localhost:5000/api/admin/banners/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      if (!res.ok) {
        if (res.status === 403) {
          throw new Error("Access denied: Admin privileges required");
        }
        throw new Error(`Failed to delete banner: ${res.status}`);
      }
      setError(null);
      fetchBanners();
    } catch (err: unknown) {
      console.error("Error deleting banner:", err);
      const errorMessage =
        err instanceof Error ? err.message : "Failed to delete banner";
      setError(errorMessage);
      if (errorMessage.includes("Admin privileges required")) {
        navigate("/login");
      }
    }
  };

  return (
    <motion.div
      className={styles.section}
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h3 className={styles.title}>Manage Banners</h3>
      {error && <div className={styles.error}>{error}</div>}
      {loading && <div className={styles.loadingSpinner}>Loading...</div>}

      {/* Create Banner Form */}
      <div className={styles.formSection}>
        <h4 className={styles.subtitle}>Create New Banner</h4>
        <Form onSubmit={handleCreateBanner}>
          <Form.Group className="mb-3">
            <Form.Label>Title</Form.Label>
            <Form.Control
              type="text"
              value={newBanner.title}
              onChange={(e) =>
                setNewBanner({ ...newBanner, title: e.target.value })
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
              value={newBanner.description}
              onChange={(e) =>
                setNewBanner({ ...newBanner, description: e.target.value })
              }
              className={styles.inputField}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Image URL</Form.Label>
            <Form.Control
              type="text"
              value={newBanner.image_url}
              onChange={(e) =>
                setNewBanner({ ...newBanner, image_url: e.target.value })
              }
              required
              className={styles.inputField}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>CTA Text</Form.Label>
            <Form.Control
              type="text"
              value={newBanner.cta_text}
              onChange={(e) =>
                setNewBanner({ ...newBanner, cta_text: e.target.value })
              }
              className={styles.inputField}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>CTA URL</Form.Label>
            <Form.Control
              type="text"
              value={newBanner.cta_url}
              onChange={(e) =>
                setNewBanner({ ...newBanner, cta_url: e.target.value })
              }
              className={styles.inputField}
            />
          </Form.Group>
          <Form.Check
            type="checkbox"
            label="Active"
            checked={newBanner.is_active}
            onChange={(e) =>
              setNewBanner({ ...newBanner, is_active: e.target.checked })
            }
            className={styles.checkbox}
          />
          <Button type="submit" className={styles.submitButton}>
            Create Banner
          </Button>
        </Form>
      </div>

      {/* Edit Banner Form */}
      {editingBanner && (
        <div className={styles.formSection}>
          <h4 className={styles.subtitle}>Edit Banner</h4>
          <Form onSubmit={handleUpdateBanner}>
            <Form.Group className="mb-3">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                value={editingBanner.title}
                onChange={(e) =>
                  setEditingBanner({ ...editingBanner, title: e.target.value })
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
                value={editingBanner.description}
                onChange={(e) =>
                  setEditingBanner({
                    ...editingBanner,
                    description: e.target.value,
                  })
                }
                className={styles.inputField}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Image URL</Form.Label>
              <Form.Control
                type="text"
                value={editingBanner.image_url}
                onChange={(e) =>
                  setEditingBanner({
                    ...editingBanner,
                    image_url: e.target.value,
                  })
                }
                required
                className={styles.inputField}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>CTA Text</Form.Label>
              <Form.Control
                type="text"
                value={editingBanner.cta_text}
                onChange={(e) =>
                  setEditingBanner({
                    ...editingBanner,
                    cta_text: e.target.value,
                  })
                }
                className={styles.inputField}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>CTA URL</Form.Label>
              <Form.Control
                type="text"
                value={editingBanner.cta_url}
                onChange={(e) =>
                  setEditingBanner({
                    ...editingBanner,
                    cta_url: e.target.value,
                  })
                }
                className={styles.inputField}
              />
            </Form.Group>
            <Form.Check
              type="checkbox"
              label="Active"
              checked={editingBanner.is_active}
              onChange={(e) =>
                setEditingBanner({
                  ...editingBanner,
                  is_active: e.target.checked,
                })
              }
              className={styles.checkbox}
            />
            <Button type="submit" className={styles.submitButton}>
              Update Banner
            </Button>
            <Button
              variant="outline-secondary"
              onClick={() => setEditingBanner(null)}
              className={styles.cancelButton}
            >
              Cancel
            </Button>
          </Form>
        </div>
      )}

      {/* Banners Table */}
      <div className={styles.tableSection}>
        <h4 className={styles.subtitle}>All Banners</h4>
        {loading ? (
          <div className={styles.loadingSpinner}>Loading...</div>
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
                <th>ID</th>
                <th>Title</th>
                <th>Description</th>
                <th>Image URL</th>
                <th>CTA Text</th>
                <th>CTA URL</th>
                <th>Active</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {banners.length === 0 ? (
                <tr>
                  <td colSpan={8} className={styles.noBanners}>
                    No banners found.
                  </td>
                </tr>
              ) : (
                banners.map((banner) => (
                  <motion.tr
                    key={banner.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <td>{banner.id}</td>
                    <td>{banner.title}</td>
                    <td>{banner.description}</td>
                    <td>{banner.image_url}</td>
                    <td>{banner.cta_text}</td>
                    <td>{banner.cta_url}</td>
                    <td>{banner.is_active ? "Yes" : "No"}</td>
                    <td>
                      <Button
                        variant="outline-primary"
                        size="sm"
                        onClick={() => setEditingBanner(banner)}
                        className={styles.editButton}
                      >
                        Edit
                      </Button>{" "}
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => handleDeleteBanner(banner.id)}
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
        )}
      </div>
    </motion.div>
  );
};

export default BannerManagement;
