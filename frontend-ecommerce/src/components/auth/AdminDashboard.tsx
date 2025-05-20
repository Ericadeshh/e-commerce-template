import { useState, useEffect, useCallback } from "react";
import { Routes, Route, NavLink, useNavigate } from "react-router-dom";
import {
  Button,
  Card,
  Form,
  Table,
  Container,
  Navbar,
  Offcanvas,
  Nav,
} from "react-bootstrap";
import {
  FaChartLine,
  FaBox,
  FaUsers,
  FaComments,
  FaDollarSign,
  FaExclamationTriangle,
  FaStar,
  FaImage,
  FaTag,
  FaBoxOpen,
  FaUserCog,
  FaShoppingCart,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import styles from "./AdminDashboard.module.css";

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
  }, [fetchStats, navigate]);

  if (error) return <div className={styles.error}>{error}</div>;
  if (!stats) return <div>Loading...</div>;

  return (
    <motion.div
      className={styles.overview}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <h3>Dashboard Overview</h3>
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
    </motion.div>
  );
};

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
  const navigate = useNavigate();

  const fetchProducts = useCallback(async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("Please log in as an admin");
      navigate("/login");
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
    }
  }, [navigate]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts, navigate]);

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
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
    if (!editingProduct) return;
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
    } finally {
      setEditingProduct(null);
      fetchProducts();
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

  return (
    <motion.div
      className={styles.section}
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
    >
      <h3>Manage Products</h3>
      {error && <div className={styles.error}>{error}</div>}

      {/* Create Product Form */}
      <div className={styles.formSection}>
        <h4>Create New Product</h4>
        <Form onSubmit={handleCreateProduct}>
          <Form.Group className="mb-2">
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="text"
              value={newProduct.name}
              onChange={(e) =>
                setNewProduct({ ...newProduct, name: e.target.value })
              }
              required
            />
          </Form.Group>
          <Form.Group className="mb-2">
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
            />
          </Form.Group>
          <Form.Group className="mb-2">
            <Form.Label>Image URL</Form.Label>
            <Form.Control
              type="text"
              value={newProduct.image}
              onChange={(e) =>
                setNewProduct({ ...newProduct, image: e.target.value })
              }
              required
            />
          </Form.Group>
          <Form.Group className="mb-2">
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
            />
          </Form.Group>
          <Form.Group className="mb-2">
            <Form.Label>Category</Form.Label>
            <Form.Control
              as="select"
              value={newProduct.category}
              onChange={(e) =>
                setNewProduct({ ...newProduct, category: e.target.value })
              }
              required
            >
              <option value="">Select Category</option>
              <option value="womens">Womens</option>
              <option value="mens">Mens</option>
              <option value="childrens">Childrens</option>
              <option value="beddings">Beddings</option>
              <option value="shoes">Shoes</option>
            </Form.Control>
          </Form.Group>
          <Form.Group className="mb-2">
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
            />
          </Form.Group>
          <Form.Group className="mb-2">
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
            />
          </Form.Group>
          <Form.Check
            type="checkbox"
            label="Featured"
            checked={newProduct.featured}
            onChange={(e) =>
              setNewProduct({ ...newProduct, featured: e.target.checked })
            }
            className="mb-2"
          />
          <Form.Check
            type="checkbox"
            label="Accessory"
            checked={newProduct.is_accessory}
            onChange={(e) =>
              setNewProduct({
                ...newProduct,
                is_accessory: e.target.checked,
              })
            }
            className="mb-2"
          />
          <Form.Check
            type="checkbox"
            label="New"
            checked={newProduct.is_new}
            onChange={(e) =>
              setNewProduct({ ...newProduct, is_new: e.target.checked })
            }
            className="mb-2"
          />
          <Button type="submit" className={styles.submitButton}>
            Create Product
          </Button>
        </Form>
      </div>

      {/* Edit Product Form */}
      {editingProduct && (
        <div className={styles.formSection}>
          <h4>Edit Product</h4>
          <Form onSubmit={handleUpdateProduct}>
            <Form.Group className="mb-2">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                value={editingProduct.name}
                onChange={(e) =>
                  setEditingProduct({
                    ...editingProduct,
                    name: e.target.value,
                  })
                }
                required
              />
            </Form.Group>
            <Form.Group className="mb-2">
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
              />
            </Form.Group>
            <Form.Group className="mb-2">
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
              />
            </Form.Group>
            <Form.Group className="mb-2">
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
              />
            </Form.Group>
            <Form.Group className="mb-2">
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
              >
                <option value="">Select Category</option>
                <option value="womens">Womens</option>
                <option value="mens">Mens</option>
                <option value="childrens">Childrens</option>
                <option value="beddings">Beddings</option>
                <option value="shoes">Shoes</option>
              </Form.Control>
            </Form.Group>
            <Form.Group className="mb-2">
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
              />
            </Form.Group>
            <Form.Group className="mb-2">
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
              className="mb-2"
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
              className="mb-2"
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
              className="mb-2"
            />
            <Button type="submit" className={styles.submitButton}>
              Update Product
            </Button>
            <Button
              variant="outline-secondary"
              onClick={() => setEditingProduct(null)}
              className="ms-2"
            >
              Cancel
            </Button>
          </Form>
        </div>
      )}

      {/* Products Table */}
      <div className={styles.tableSection}>
        <h4>All Products</h4>
        <Table striped bordered hover responsive size="sm">
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
            {products.map((product) => (
              <tr key={product.id}>
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
                  >
                    Edit
                  </Button>{" "}
                  <Button
                    variant="outline-danger"
                    size="sm"
                    onClick={() => handleDeleteProduct(product.id)}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    </motion.div>
  );
};

const BannerManagement: React.FC = () => {
  return (
    <motion.div
      className={styles.section}
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
    >
      <h3>Banner Management</h3>
      <p>Placeholder for banner management (add forms/tables as needed).</p>
    </motion.div>
  );
};

const PromotionManagement: React.FC = () => {
  return (
    <motion.div
      className={styles.section}
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
    >
      <h3>Promotion Management</h3>
      <p>Placeholder for promotion management (add forms/tables as needed).</p>
    </motion.div>
  );
};

const AccessoryManagement: React.FC = () => {
  return (
    <motion.div
      className={styles.section}
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
    >
      <h3>Accessory Management</h3>
      <p>
        Placeholder for accessory management (filter products by is_accessory).
      </p>
    </motion.div>
  );
};

const UserManagement: React.FC = () => {
  return (
    <motion.div
      className={styles.section}
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
    >
      <h3>User Management</h3>
      <p>Placeholder for user management (add user list/edit forms).</p>
    </motion.div>
  );
};

const OrderManagement: React.FC = () => {
  return (
    <motion.div
      className={styles.section}
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
    >
      <h3>Order Management</h3>
      <p>Placeholder for order management (add order list/status updates).</p>
    </motion.div>
  );
};

export default function AdminDashboard() {
  const [showSidebar, setShowSidebar] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className={styles.dashboard}>
      {/* Mobile Navbar */}
      <Navbar
        bg="dark"
        variant="dark"
        expand={false}
        className={styles.mobileNav}
      >
        <Container fluid>
          <Navbar.Brand>Admin Dashboard</Navbar.Brand>
          <Navbar.Toggle onClick={() => setShowSidebar(true)} />
        </Container>
      </Navbar>

      {/* Mobile Sidebar */}
      <Offcanvas
        show={showSidebar}
        onHide={() => setShowSidebar(false)}
        placement="start"
        className={styles.offcanvas}
      >
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Admin Menu</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <motion.div
            initial={{ x: -100 }}
            animate={{ x: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Nav className={styles.nav}>
              <h5>Overview</h5>
              <NavLink
                to="/admin/dashboard"
                end
                className={({ isActive }) =>
                  isActive ? styles.activeLink : styles.navLink
                }
                onClick={() => setShowSidebar(false)}
              >
                <FaChartLine /> Dashboard
              </NavLink>
              <h5>Hero Section Updates</h5>
              <NavLink
                to="/admin/dashboard/banners"
                className={({ isActive }) =>
                  isActive ? styles.activeLink : styles.navLink
                }
                onClick={() => setShowSidebar(false)}
              >
                <FaImage /> Banner Update
              </NavLink>
              <NavLink
                to="/admin/dashboard/promotions"
                className={({ isActive }) =>
                  isActive ? styles.activeLink : styles.navLink
                }
                onClick={() => setShowSidebar(false)}
              >
                <FaTag /> Promotion Update
              </NavLink>
              <h5>Product Management</h5>
              <NavLink
                to="/admin/dashboard/products"
                className={({ isActive }) =>
                  isActive ? styles.activeLink : styles.navLink
                }
                onClick={() => setShowSidebar(false)}
              >
                <FaBox /> Featured Products
              </NavLink>
              <NavLink
                to="/admin/dashboard/accessories"
                className={({ isActive }) =>
                  isActive ? styles.activeLink : styles.navLink
                }
                onClick={() => setShowSidebar(false)}
              >
                <FaBoxOpen /> Accessories
              </NavLink>
              <h5>Other Tasks</h5>
              <NavLink
                to="/admin/dashboard/users"
                className={({ isActive }) =>
                  isActive ? styles.activeLink : styles.navLink
                }
                onClick={() => setShowSidebar(false)}
              >
                <FaUsers /> User Management
              </NavLink>
              <NavLink
                to="/admin/dashboard/orders"
                className={({ isActive }) =>
                  isActive ? styles.activeLink : styles.navLink
                }
                onClick={() => setShowSidebar(false)}
              >
                <FaShoppingCart /> Order Management
              </NavLink>
              <Button
                variant="outline-danger"
                onClick={handleLogout}
                className={styles.logoutButton}
              >
                <FaUserCog /> Logout
              </Button>
            </Nav>
          </motion.div>
        </Offcanvas.Body>
      </Offcanvas>

      <div className={styles.layout}>
        {/* PC Sidebar */}
        <motion.div
          className={styles.sidebar}
          initial={{ x: -200 }}
          animate={{ x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h3 className={styles.sidebarTitle}>Admin Panel</h3>
          <Nav className={styles.nav}>
            <h5>Overview</h5>
            <NavLink
              to="/admin/dashboard"
              end
              className={({ isActive }) =>
                isActive ? styles.activeLink : styles.navLink
              }
            >
              <FaChartLine /> Dashboard
            </NavLink>
            <h5>Hero Section Updates</h5>
            <NavLink
              to="/admin/dashboard/banners"
              className={({ isActive }) =>
                isActive ? styles.activeLink : styles.navLink
              }
            >
              <FaImage /> Banner Update
            </NavLink>
            <NavLink
              to="/admin/dashboard/promotions"
              className={({ isActive }) =>
                isActive ? styles.activeLink : styles.navLink
              }
            >
              <FaTag /> Promotion Update
            </NavLink>
            <h5>Product Management</h5>
            <NavLink
              to="/admin/dashboard/products"
              className={({ isActive }) =>
                isActive ? styles.activeLink : styles.navLink
              }
            >
              <FaBox /> Featured Products
            </NavLink>
            <NavLink
              to="/admin/dashboard/accessories"
              className={({ isActive }) =>
                isActive ? styles.activeLink : styles.navLink
              }
            >
              <FaBoxOpen /> Accessories
            </NavLink>
            <h5>Other Tasks</h5>
            <NavLink
              to="/admin/dashboard/users"
              className={({ isActive }) =>
                isActive ? styles.activeLink : styles.navLink
              }
            >
              <FaUsers /> User Management
            </NavLink>
            <NavLink
              to="/admin/dashboard/orders"
              className={({ isActive }) =>
                isActive ? styles.activeLink : styles.navLink
              }
            >
              <FaShoppingCart /> Order Management
            </NavLink>
          </Nav>
        </motion.div>

        {/* Main Content */}
        <div className={styles.main}>
          <motion.div
            className={styles.topBar}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <h2>Admin Dashboard</h2>
            <div className={styles.adminInfo}>
              <span>Welcome, Admin</span>
              <Button
                variant="outline-danger"
                onClick={handleLogout}
                className={styles.logoutButton}
              >
                <FaUserCog /> Logout
              </Button>
            </div>
          </motion.div>

          <AnimatePresence mode="wait">
            <Routes>
              <Route index element={<DashboardOverview />} />
              <Route path="products" element={<ProductManagement />} />
              <Route path="banners" element={<BannerManagement />} />
              <Route path="promotions" element={<PromotionManagement />} />
              <Route path="accessories" element={<AccessoryManagement />} />
              <Route path="users" element={<UserManagement />} />
              <Route path="orders" element={<OrderManagement />} />
            </Routes>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
