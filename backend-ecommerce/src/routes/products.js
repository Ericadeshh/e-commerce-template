const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");

console.log("Initializing products routes...");

// Middleware to get pool from app.locals
router.use((req, res, next) => {
  if (!req.app.locals.pool) {
    console.error("Database pool not available in products router");
    return res.status(500).json({ error: "Database connection unavailable" });
  }
  req.pool = req.app.locals.pool;
  console.log(
    `Products middleware: Pool set for ${req.method} ${req.originalUrl}`
  );
  next();
});

// Authentication middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Access token required" });

  jwt.verify(
    token,
    process.env.JWT_SECRET || "your_jwt_secret",
    (err, user) => {
      if (err) return res.status(403).json({ error: "Invalid token" });
      req.user = user;
      next();
    }
  );
};

// Admin access middleware
const requireAdmin = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ error: "Admin access required" });
  }
  next();
};

// Get all products with optional filters (public)
router.get("/", async (req, res) => {
  console.log(`GET /api/products called with query:`, req.query);
  try {
    const { featured, category, new: isNew, accessory } = req.query;
    let query =
      "SELECT id, name, price, image, stock, featured, is_accessory, is_new, category, original_price, discount_percentage FROM products";
    const params = [];

    const conditions = [];
    if (featured === "true") {
      conditions.push("featured = true");
    }
    if (category) {
      conditions.push("category = ?");
      params.push(category);
    }
    if (isNew === "true") {
      conditions.push("is_new = true");
    }
    if (accessory === "true") {
      conditions.push("is_accessory = true");
    }

    if (conditions.length > 0) {
      query += " WHERE " + conditions.join(" AND ");
    }

    const [rows] = await req.pool.query(query, params);
    console.log("Products query result:", rows);
    res.json(rows);
  } catch (err) {
    console.error("Error fetching products:", err);
    res.status(500).json({ error: "Failed to fetch products" });
  }
});

// Get all products (admin)
router.get("/admin", authenticateToken, requireAdmin, async (req, res) => {
  try {
    const [rows] = await req.pool.query(
      "SELECT id, name, price, image, stock, featured, is_accessory, is_new, category, original_price, discount_percentage FROM products"
    );
    res.json(rows);
  } catch (err) {
    console.error("Error fetching admin products:", err);
    res.status(500).json({ error: "Failed to fetch products" });
  }
});

// Create a product (admin)
router.post("/admin", authenticateToken, requireAdmin, async (req, res) => {
  const {
    name,
    price,
    image,
    stock,
    featured,
    is_accessory,
    is_new,
    category,
    original_price,
    discount_percentage,
  } = req.body;

  if (!name || !price || !image || !category) {
    return res
      .status(400)
      .json({ error: "Name, price, image, and category are required" });
  }

  try {
    await req.pool.query(
      `
      INSERT INTO products (name, price, image, stock, featured, is_accessory, is_new, category, original_price, discount_percentage)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
      [
        name,
        price,
        image,
        stock ?? 0,
        featured ?? false,
        is_accessory ?? false,
        is_new ?? false,
        category,
        original_price ?? null,
        discount_percentage ?? null,
      ]
    );
    res.status(201).json({ message: "Product created" });
  } catch (err) {
    console.error("Error creating product:", err);
    res.status(500).json({ error: "Failed to create product" });
  }
});

// Update a product (admin)
router.put("/admin/:id", authenticateToken, requireAdmin, async (req, res) => {
  const { id } = req.params;
  const {
    name,
    price,
    image,
    stock,
    featured,
    is_accessory,
    is_new,
    category,
    original_price,
    discount_percentage,
  } = req.body;

  try {
    const [result] = await req.pool.query(
      `
      UPDATE products
      SET name = ?, price = ?, image = ?, stock = ?, featured = ?, is_accessory = ?, is_new = ?, category = ?, original_price = ?, discount_percentage = ?
      WHERE id = ?
    `,
      [
        name,
        price,
        image,
        stock,
        featured,
        is_accessory,
        is_new,
        category,
        original_price,
        discount_percentage,
        id,
      ]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Product not found" });
    }
    res.json({ message: "Product updated" });
  } catch (err) {
    console.error("Error updating product:", err);
    res.status(500).json({ error: "Failed to update product" });
  }
});

// Delete a product (admin)
router.delete(
  "/admin/:id",
  authenticateToken,
  requireAdmin,
  async (req, res) => {
    const { id } = req.params;

    try {
      const [result] = await req.pool.query(
        "DELETE FROM products WHERE id = ?",
        [id]
      );
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: "Product not found" });
      }
      res.json({ message: "Product deleted" });
    } catch (err) {
      console.error("Error deleting product:", err);
      res.status(500).json({ error: "Failed to delete product" });
    }
  }
);

// Get cart items for a user
router.get("/cart", async (req, res) => {
  console.log("GET /api/products/cart called with query:", req.query);
  const userId = req.query.user_id;
  if (!userId) {
    return res.status(400).json({ error: "user_id is required" });
  }
  try {
    const [rows] = await req.pool.query(
      `
      SELECT c.product_id, c.quantity, p.name, p.price, p.image
      FROM cart c
      JOIN products p ON c.product_id = p.id
      WHERE c.user_id = ?
    `,
      [userId]
    );
    console.log(`Cart fetched for user ${userId}:`, rows);
    res.json(rows);
  } catch (err) {
    console.error("Error fetching cart:", err);
    res.status(500).json({ error: "Failed to fetch cart" });
  }
});

// Add to cart
router.post("/cart", async (req, res) => {
  console.log("POST /api/products/cart called with body:", req.body);
  const { productId, userId } = req.body;
  if (!productId || !userId) {
    return res.status(400).json({ error: "productId and userId are required" });
  }
  try {
    const [product] = await req.pool.query(
      "SELECT stock FROM products WHERE id = ?",
      [productId]
    );
    if (product.length === 0) {
      return res.status(404).json({ error: "Product not found" });
    }
    if (product[0].stock <= 0) {
      return res.status(400).json({ error: "Product out of stock" });
    }
    await req.pool.query(
      "INSERT INTO cart (user_id, product_id, quantity) VALUES (?, ?, 1) ON DUPLICATE KEY UPDATE quantity = quantity + 1",
      [userId, productId]
    );
    await req.pool.query("UPDATE products SET stock = stock - 1 WHERE id = ?", [
      productId,
    ]);
    console.log(`Added product ${productId} to cart for user ${userId}`);
    res.status(200).json({ message: "Added to cart" });
  } catch (err) {
    console.error("Error adding to cart:", err);
    res.status(500).json({ error: "Failed to add to cart" });
  }
});

// Remove from cart
router.delete("/cart", async (req, res) => {
  console.log("DELETE /api/products/cart called with body:", req.body);
  const { productId, userId } = req.body;
  if (!productId || !userId) {
    return res.status(400).json({ error: "productId and userId are required" });
  }
  try {
    const [cartItem] = await req.pool.query(
      "SELECT quantity FROM cart WHERE user_id = ? AND product_id = ?",
      [userId, productId]
    );
    if (cartItem.length === 0) {
      return res.status(404).json({ error: "Item not in cart" });
    }
    await req.pool.query(
      "DELETE FROM cart WHERE user_id = ? AND product_id = ?",
      [userId, productId]
    );
    await req.pool.query("UPDATE products SET stock = stock + ? WHERE id = ?", [
      cartItem[0].quantity,
      productId,
    ]);
    console.log(`Removed product ${productId} from cart for user ${userId}`);
    res.status(200).json({ message: "Removed from cart" });
  } catch (err) {
    console.error("Error removing from cart:", err);
    res.status(500).json({ error: "Failed to remove from cart" });
  }
});

console.log("Products routes initialized");

module.exports = router;
