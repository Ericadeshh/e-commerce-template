const express = require("express");
const router = express.Router();

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

// Get all products or featured products
router.get("/products", async (req, res) => {
  console.log(`GET /api/products called with query:`, req.query);
  try {
    const featured = req.query.featured === "true";
    const query = featured
      ? "SELECT * FROM products WHERE featured = true"
      : "SELECT * FROM products";
    const [rows] = await req.pool.query(query);
    console.log("Products query result:", rows);
    if (rows.length === 0) {
      return res.status(404).json({ error: "No products found" });
    }
    res.json(rows);
  } catch (err) {
    console.error("Error fetching products:", err);
    res.status(500).json({ error: "Failed to fetch products" });
  }
});

// Get cart items for a user
router.get("/cart", async (req, res) => {
  console.log("GET /api/cart called with query:", req.query);
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
    console.log("Cart fetched for user", userId, ":", rows);
    res.json(rows);
  } catch (err) {
    console.error("Error fetching cart:", err);
    res.status(500).json({ error: "Failed to fetch cart" });
  }
});

// Add to cart
router.post("/cart", async (req, res) => {
  console.log("POST /api/cart called with body:", req.body);
  const { productId, userId } = req.body;
  if (!productId || !userId) {
    return res.status(400).json({ error: "productId and userId are required" });
  }
  try {
    const [product] = await req.pool.query(
      "SELECT stock FROM products WHERE id = ?",
      [productId]
    );
    if (product.length === 0 || product[0].stock <= 0) {
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
  console.log("DELETE /api/cart called with body:", req.body);
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
