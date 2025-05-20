import { useState, useEffect, useCallback } from "react";
import { Button, Form, Table } from "react-bootstrap";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import styles from "./ProductManagement.module.css";

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

const ProductManagement: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [newProduct, setNewProduct] = useState<Partial<Product>>({
    name: "",
    price: 0,
    image: "",
    stock: 0,
    featured: false,
    is_accessory: false,
    is_new: false,
    category: "",
    original_price: null,
    discount_percentage: null,
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(10);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    const token = localStorage.getItem("token");
    if (!token) {
      setError("Please log in as an admin");
      navigate("/login");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/products/admin", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      if (!res.ok) {
        if (res.status === 403) {
          throw new Error("Access denied: Admin privileges required");
        }
        throw new Error(`Failed to fetch products: ${res.status}`);
      }
      const data = await res.json();
      setProducts(data);
      setError(null);
    } catch (err: unknown) {
      console.error("Error fetching products:", err);
      const errorMessage =
        err instanceof Error ? err.message : "Failed to fetch products";
      setError(errorMessage);
      if (errorMessage.includes("Admin privileges required")) {
        navigate("/login");
      }
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !newProduct.name ||
      !newProduct.price ||
      !newProduct.image ||
      !newProduct.category
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
      const res = await fetch("http://localhost:5000/api/products/admin", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newProduct),
      });
      if (!res.ok) {
        if (res.status === 403) {
          throw new Error("Access denied: Admin privileges required");
        }
        throw new Error(`Failed to create product: ${res.status}`);
      }
      setNewProduct({
        name: "",
        price: 0,
        image: "",
        stock: 0,
        featured: false,
        is_accessory: false,
        is_new: false,
        category: "",
        original_price: null,
        discount_percentage: null,
      });
      fetchProducts();
    } catch (err: unknown) {
      console.error("Error creating product:", err);
      const errorMessage =
        err instanceof Error ? err.message : "Failed to create product";
      setError(errorMessage);
      if (errorMessage.includes("Admin privileges required")) {
        navigate("/login");
      }
    }
  };

  const handleUpdateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !editingProduct ||
      !editingProduct.name ||
      !editingProduct.price ||
      !editingProduct.image ||
      !editingProduct.category
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
        `http://localhost:5000/api/products/admin/${editingProduct.id}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(editingProduct),
        }
      );
      if (!res.ok) {
        if (res.status === 403) {
          throw new Error("Access denied: Admin privileges required");
        }
        throw new Error(`Failed to update product: ${res.status}`);
      }
      setEditingProduct(null);
      fetchProducts();
    } catch (err: unknown) {
      console.error("Error updating product:", err);
      const errorMessage =
        err instanceof Error ? err.message : "Failed to update product";
      setError(errorMessage);
      if (errorMessage.includes("Admin privileges required")) {
        navigate("/login");
      }
    }
  };

  const handleDeleteProduct = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this product?"))
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
        throw new Error(`Failed to delete product: ${res.status}`);
      }
      fetchProducts();
    } catch (err: unknown) {
      console.error("Error deleting product:", err);
      const errorMessage =
        err instanceof Error ? err.message : "Failed to delete product";
      setError(errorMessage);
      if (errorMessage.includes("Admin privileges required")) {
        navigate("/login");
      }
    }
  };

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );

  return (
    <motion.div
      className={styles.section}
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h3 className={styles.title}>Manage Products</h3>
      {error && <div className={styles.error}>{error}</div>}

      {/* Search Input */}
      <div className={styles.searchContainer}>
        <input
          type="text"
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={styles.searchInput}
        />
      </div>

      {/* Create Product Form */}
      <div className={styles.formSection}>
        <h4 className={styles.subtitle}>Create New Product</h4>
        <Form onSubmit={handleCreateProduct}>
          <Form.Group className="mb-3">
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="text"
              value={newProduct.name}
              onChange={(e) =>
                setNewProduct({ ...newProduct, name: e.target.value })
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
              value={newProduct.price}
              onChange={(e) =>
                setNewProduct({
                  ...newProduct,
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
              value={newProduct.image}
              onChange={(e) =>
                setNewProduct({ ...newProduct, image: e.target.value })
              }
              required
              className={styles.inputField}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Stock</Form.Label>
            <Form.Control
              type="number"
              value={newProduct.stock}
              onChange={(e) =>
                setNewProduct({
                  ...newProduct,
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
              value={newProduct.category}
              onChange={(e) =>
                setNewProduct({ ...newProduct, category: e.target.value })
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
              value={newProduct.original_price ?? ""}
              onChange={(e) =>
                setNewProduct({
                  ...newProduct,
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
              value={newProduct.discount_percentage ?? ""}
              onChange={(e) =>
                setNewProduct({
                  ...newProduct,
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
            checked={newProduct.featured}
            onChange={(e) =>
              setNewProduct({ ...newProduct, featured: e.target.checked })
            }
            className="mb-3"
          />
          <Form.Check
            type="checkbox"
            label="Accessory"
            checked={newProduct.is_accessory}
            onChange={(e) =>
              setNewProduct({ ...newProduct, is_accessory: e.target.checked })
            }
            className="mb-3"
          />
          <Form.Check
            type="checkbox"
            label="New"
            checked={newProduct.is_new}
            onChange={(e) =>
              setNewProduct({ ...newProduct, is_new: e.target.checked })
            }
            className="mb-3"
          />
          <Button type="submit" className={styles.submitButton}>
            Create Product
          </Button>
        </Form>
      </div>

      {/* Edit Product Form */}
      {editingProduct && (
        <div className={styles.formSection}>
          <h4 className={styles.subtitle}>Edit Product</h4>
          <Form onSubmit={handleUpdateProduct}>
            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                value={editingProduct.name}
                onChange={(e) =>
                  setEditingProduct({ ...editingProduct, name: e.target.value })
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
                value={editingProduct.price}
                onChange={(e) =>
                  setEditingProduct({
                    ...editingProduct,
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
                value={editingProduct.image}
                onChange={(e) =>
                  setEditingProduct({
                    ...editingProduct,
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
                value={editingProduct.stock}
                onChange={(e) =>
                  setEditingProduct({
                    ...editingProduct,
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
                value={editingProduct.category}
                onChange={(e) =>
                  setEditingProduct({
                    ...editingProduct,
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
                value={editingProduct.original_price ?? ""}
                onChange={(e) =>
                  setEditingProduct({
                    ...editingProduct,
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
                value={editingProduct.discount_percentage ?? ""}
                onChange={(e) =>
                  setEditingProduct({
                    ...editingProduct,
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
              checked={editingProduct.featured}
              onChange={(e) =>
                setEditingProduct({
                  ...editingProduct,
                  featured: e.target.checked,
                })
              }
              className="mb-3"
            />
            <Form.Check
              type="checkbox"
              label="Accessory"
              checked={editingProduct.is_accessory}
              onChange={(e) =>
                setEditingProduct({
                  ...editingProduct,
                  is_accessory: e.target.checked,
                })
              }
              className="mb-3"
            />
            <Form.Check
              type="checkbox"
              label="New"
              checked={editingProduct.is_new}
              onChange={(e) =>
                setEditingProduct({
                  ...editingProduct,
                  is_new: e.target.checked,
                })
              }
              className="mb-3"
            />
            <Button type="submit" className={styles.submitButton}>
              Update Product
            </Button>
            <Button
              variant="outline-secondary"
              onClick={() => setEditingProduct(null)}
              className={styles.cancelButton}
            >
              Cancel
            </Button>
          </Form>
        </div>
      )}

      {/* Products Table */}
      <div className={styles.tableSection}>
        <h4 className={styles.subtitle}>All Products</h4>
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
                  <th>Name</th>
                  <th>Price</th>
                  <th>Stock</th>
                  <th>Category</th>
                  <th>Featured</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentProducts.length === 0 ? (
                  <tr>
                    <td colSpan={7} className={styles.noProducts}>
                      No products found.
                    </td>
                  </tr>
                ) : (
                  currentProducts.map((product) => (
                    <motion.tr
                      key={product.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      <td>{product.id}</td>
                      <td>{product.name}</td>
                      <td>${product.price.toFixed(2)}</td>
                      <td>{product.stock}</td>
                      <td>{product.category}</td>
                      <td>{product.featured ? "Yes" : "No"}</td>
                      <td>
                        <Button
                          variant="outline-primary"
                          size="sm"
                          onClick={() => setEditingProduct(product)}
                          className={styles.editButton}
                        >
                          Edit
                        </Button>{" "}
                        <Button
                          variant="outline-danger"
                          size="sm"
                          onClick={() => handleDeleteProduct(product.id)}
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
                {Math.ceil(filteredProducts.length / productsPerPage)}
              </span>
              <Button
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={indexOfLastProduct >= filteredProducts.length}
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

export default ProductManagement;
