const express = require("express");
const router = express.Router();
const { pool } = require("../config/ecommerce_db");

// Get all products
router.get("/", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM products");
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add to cart
router.post("/cart", async (req, res) => {
  const { productId, userId = 1, quantity = 1 } = req.body; // Default userId for testing
  try {
    const [product] = await pool.query(
      "SELECT stock FROM products WHERE id = ?",
      [productId]
    );
    if (!product[0] || product[0].stock < quantity) {
      return res.status(400).json({ error: "Out of stock or invalid product" });
    }

    await pool.query("UPDATE products SET stock = stock - ? WHERE id = ?", [
      quantity,
      productId,
    ]);
    await pool.query(
      "INSERT INTO cart (user_id, product_id, quantity) VALUES (?, ?, ?)",
      [userId, productId, quantity]
    );
    res.json({ message: "Added to cart" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
