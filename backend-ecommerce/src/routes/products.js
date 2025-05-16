const express = require("express");
const { pool } = require("../config/ecommerce_db");
const router = express.Router();

// Get all products or featured products
router.get("/", async (req, res) => {
  try {
    const featured = req.query.featured === "true";
    const query = featured
      ? "SELECT * FROM products WHERE featured = true"
      : "SELECT * FROM products";
    const [rows] = await pool.query(query);
    if (rows.length === 0) {
      return res.status(404).json({ error: "No products found" });
    }
    console.log("Products fetched:", rows); // Debug log
    res.json(rows);
  } catch (err) {
    console.error("Error fetching products:", err);
    res.status(500).json({ error: "Failed to fetch products" });
  }
});

// Get cart items for a user
router.get("/cart", async (req, res) => {
  const userId = req.query.user_id;
  if (!userId) {
    return res.status(400).json({ error: "user_id is required" });
  }
  try {
    const [rows] = await pool.query(
      `
      SELECT c.product_id, c.quantity, p.name, p.price, p.image
      FROM cart c
      JOIN products p ON c.product_id = p.id
      WHERE c.user_id = ?
    `,
      [userId]
    );
    console.log("Cart fetched for user", userId, ":", rows); // Debug log
    res.json(rows);
  } catch (err) {
    console.error("Error fetching cart:", err);
    res.status(500).json({ error: "Failed to fetch cart" });
  }
});

// Add to cart
router.post("/cart", async (req, res) => {
  const { productId, userId } = req.body;
  if (!productId || !userId) {
    return res.status(400).json({ error: "productId and userId are required" });
  }
  try {
    const [product] = await pool.query(
      "SELECT stock FROM products WHERE id = ?",
      [productId]
    );
    if (product.length === 0 || product[0].stock <= 0) {
      return res.status(400).json({ error: "Product out of stock" });
    }
    await pool.query(
      "INSERT INTO cart (user_id, product_id, quantity) VALUES (?, ?, 1) ON DUPLICATE KEY UPDATE quantity = quantity + 1",
      [userId, productId]
    );
    await pool.query("UPDATE products SET stock = stock - 1 WHERE id = ?", [
      productId,
    ]);
    console.log(`Added product ${productId} to cart for user ${userId}`); // Debug log
    res.status(200).json({ message: "Added to cart" });
  } catch (err) {
    console.error("Error adding to cart:", err);
    res.status(500).json({ error: "Failed to add to cart" });
  }
});

// Remove from cart
router.delete("/cart", async (req, res) => {
  const { productId, userId } = req.body;
  if (!productId || !userId) {
    return res.status(400).json({ error: "productId and userId are required" });
  }
  try {
    const [cartItem] = await pool.query(
      "SELECT quantity FROM cart WHERE user_id = ? AND product_id = ?",
      [userId, productId]
    );
    if (cartItem.length === 0) {
      return res.status(404).json({ error: "Item not in cart" });
    }
    await pool.query("DELETE FROM cart WHERE user_id = ? AND product_id = ?", [
      userId,
      productId,
    ]);
    await pool.query("UPDATE products SET stock = stock + ? WHERE id = ?", [
      cartItem[0].quantity,
      productId,
    ]);
    console.log(`Removed product ${productId} from cart for user ${userId}`); // Debug log
    res.status(200).json({ message: "Removed from cart" });
  } catch (err) {
    console.error("Error removing from cart:", err);
    res.status(500).json({ error: "Failed to remove from cart" });
  }
});

module.exports = router;
