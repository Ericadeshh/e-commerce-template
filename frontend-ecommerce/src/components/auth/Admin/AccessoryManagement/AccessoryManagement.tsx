import { useState, useEffect, useCallback } from "react";
import { Button, Form, Table } from "react-bootstrap";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import styles from "./AccessoryManagement.module.css";

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  stock: number;
  featured: boolean;
  is_accessory: boolean;
  is_new: boolean;
  category: string;
  original_price: number | null;
  discount_percentage: number | null;
}

const AccessoryManagement: React.FC = () => {
  const [accessories, setAccessories] = useState<Product[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [editingAccessory, setEditingAccessory] = useState<Product | null>(
    null
  );
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const fetchAccessories = useCallback(async () => {
    setLoading(true);
    const token = localStorage.getItem("token");
    if (!token) {
      setError("Please log in as an admin");
      navigate("/login");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(
        "http://localhost:5000/api/products/admin?is_accessory=true",
        {
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
        throw new Error(`Failed to fetch accessories: ${res.status}`);
      }
      const data = await res.json();
      setAccessories(data);
      setError(null);
    } catch (err: unknown) {
      console.error("Error fetching accessories:", err);
      const errorMessage =
        err instanceof Error ? err.message : "Failed to fetch accessories";
      setError(errorMessage);
      if (errorMessage.includes("Admin privileges required")) {
        navigate("/login");
      }
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    fetchAccessories();
  }, [fetchAccessories]);

  const handleUpdateAccessory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !editingAccessory ||
      !editingAccessory.name ||
      !editingAccessory.price ||
      !editingAccessory.image ||
      !editingAccessory.category
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
        `http://localhost:5000/api/products/admin/${editingAccessory.id}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(editingAccessory),
        }
      );
      if (!res.ok) {
        if (res.status === 403) {
          throw new Error("Access denied: Admin privileges required");
        }
        throw new Error(`Failed to update accessory: ${res.status}`);
      }
      setEditingAccessory(null);
      setError(null);
      fetchAccessories();
    } catch (err: unknown) {
      console.error("Error updating accessory:", err);
      const errorMessage =
        err instanceof Error ? err.message : "Failed to update accessory";
      setError(errorMessage);
      if (errorMessage.includes("Admin privileges required")) {
        navigate("/login");
      }
    }
  };

  const handleDeleteAccessory = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this accessory?"))
      return;
    const token = localStorage.getItem("token");
    if (!token) {
      setError("Please log in as an admin");
      navigate("/login");
      return;
    }

    try {
      const res = await fetch(
        `http://localhost:5000/api/products/admin/${id}`,
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
        throw new Error(`Failed to delete accessory: ${res.status}`);
      }
      setError(null);
      fetchAccessories();
    } catch (err: unknown) {
      console.error("Error deleting accessory:", err);
      const errorMessage =
        err instanceof Error ? err.message : "Failed to delete accessory";
      setError(errorMessage);
      if (errorMessage.includes("Admin privileges required")) {
        navigate("/login");
      }
    }
  };

  const filteredAccessories = accessories.filter(
    (accessory) =>
      accessory.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      accessory.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <motion.div
      className={styles.section}
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h3 className={styles.title}>Manage Accessories</h3>
      {error && <div className={styles.error}>{error}</div>}
      {loading && <div className={styles.loadingSpinner}>Loading...</div>}

      <div className={styles.searchContainer}>
        <input
          type="text"
          placeholder="Search accessories by name or category..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={styles.searchInput}
        />
      </div>

      <div className={styles.tableSection}>
        <h4 className={styles.subtitle}>All Accessories</h4>
        {filteredAccessories.length === 0 ? (
          <p className={styles.noAccessories}>No accessories found.</p>
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
                <th>Name</th>
                <th>Price</th>
                <th>Image</th>
                <th>Stock</th>
                <th>Featured</th>
                <th>Category</th>
                <th>Original Price</th>
                <th>Discount %</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredAccessories.map((accessory) => (
                <motion.tr
                  key={accessory.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <td>{accessory.id}</td>
                  <td>{accessory.name}</td>
                  <td>${accessory.price.toFixed(2)}</td>
                  <td>{accessory.image}</td>
                  <td>{accessory.stock}</td>
                  <td>{accessory.featured ? "Yes" : "No"}</td>
                  <td>{accessory.category}</td>
                  <td>
                    {accessory.original_price
                      ? `$${accessory.original_price.toFixed(2)}`
                      : "N/A"}
                  </td>
                  <td>
                    {accessory.discount_percentage
                      ? `${accessory.discount_percentage}%`
                      : "N/A"}
                  </td>
                  <td>
                    <Button
                      variant="outline-primary"
                      size="sm"
                      onClick={() => setEditingAccessory(accessory)}
                      className={styles.editButton}
                    >
                      Edit
                    </Button>{" "}
                    <Button
                      variant="outline-danger"
                      size="sm"
                      onClick={() => handleDeleteAccessory(accessory.id)}
                      className={styles.deleteButton}
                    >
                      Delete
                    </Button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </Table>
        )}
      </div>

      {editingAccessory && (
        <div className={styles.formSection}>
          <h4 className={styles.subtitle}>Edit Accessory</h4>
          <Form onSubmit={handleUpdateAccessory}>
            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                value={editingAccessory.name}
                onChange={(e) =>
                  setEditingAccessory({
                    ...editingAccessory,
                    name: e.target.value,
                  })
                }
                required
                className={styles.inputField}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Price</Form.Label>
              <Form.Control
                type="number"
                step="0.01"
                value={editingAccessory.price}
                onChange={(e) =>
                  setEditingAccessory({
                    ...editingAccessory,
                    price: parseFloat(e.target.value),
                  })
                }
                required
                className={styles.inputField}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Image URL</Form.Label>
              <Form.Control
                type="text"
                value={editingAccessory.image}
                onChange={(e) =>
                  setEditingAccessory({
                    ...editingAccessory,
                    image: e.target.value,
                  })
                }
                required
                className={styles.inputField}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Stock</Form.Label>
              <Form.Control
                type="number"
                value={editingAccessory.stock}
                onChange={(e) =>
                  setEditingAccessory({
                    ...editingAccessory,
                    stock: parseInt(e.target.value),
                  })
                }
                className={styles.inputField}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Category</Form.Label>
              <Form.Control
                as="select"
                value={editingAccessory.category}
                onChange={(e) =>
                  setEditingAccessory({
                    ...editingAccessory,
                    category: e.target.value,
                  })
                }
                required
                className={styles.inputField}
              >
                <option value="">Select Category</option>
                <option value="womens">Womens</option>
                <option value="mens">Mens</option>
                <option value="childrens">Childrens</option>
                <option value="beddings">Beddings</option>
                <option value="shoes">Shoes</option>
              </Form.Control>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Original Price</Form.Label>
              <Form.Control
                type="number"
                step="0.01"
                value={editingAccessory.original_price ?? ""}
                onChange={(e) =>
                  setEditingAccessory({
                    ...editingAccessory,
                    original_price: e.target.value
                      ? parseFloat(e.target.value)
                      : null,
                  })
                }
                className={styles.inputField}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Discount Percentage</Form.Label>
              <Form.Control
                type="number"
                value={editingAccessory.discount_percentage ?? ""}
                onChange={(e) =>
                  setEditingAccessory({
                    ...editingAccessory,
                    discount_percentage: e.target.value
                      ? parseInt(e.target.value)
                      : null,
                  })
                }
                className={styles.inputField}
              />
            </Form.Group>
            <Form.Check
              type="checkbox"
              label="Featured"
              checked={editingAccessory.featured}
              onChange={(e) =>
                setEditingAccessory({
                  ...editingAccessory,
                  featured: e.target.checked,
                })
              }
              className={styles.checkbox}
            />
            <Form.Check
              type="checkbox"
              label="New"
              checked={editingAccessory.is_new}
              onChange={(e) =>
                setEditingAccessory({
                  ...editingAccessory,
                  is_new: e.target.checked,
                })
              }
              className={styles.checkbox}
            />
            <Button type="submit" className={styles.submitButton}>
              Update Accessory
            </Button>
            <Button
              variant="outline-secondary"
              onClick={() => setEditingAccessory(null)}
              className={styles.cancelButton}
            >
              Cancel
            </Button>
          </Form>
        </div>
      )}
    </motion.div>
  );
};

export default AccessoryManagement;
