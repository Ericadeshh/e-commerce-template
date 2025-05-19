const express = require("express");
const jwt = require("jsonwebtoken");
const router = express.Router();

// Middleware to get pool from app.locals
router.use((req, res, next) => {
  req.pool = req.app.locals.pool;
  next();
});

// Placeholder admin route
router.get("/", (req, res) => {
  res.status(200).json({ message: "Admin route" });
});

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

const requireAdmin = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ error: "Admin access required" });
  }
  next();
};

// Get all active banners (public)
router.get("/banners", async (req, res) => {
  try {
    const [rows] = await req.pool.query(
      "SELECT id, title, description, image_url, cta_text, cta_url FROM banners WHERE is_active = TRUE"
    );
    res.json(rows);
  } catch (err) {
    console.error("Error fetching banners:", err);
    res.status(500).json({ error: "Failed to fetch banners" });
  }
});

// Get all banners (admin)
router.get(
  "/admin/banners",
  authenticateToken,
  requireAdmin,
  async (req, res) => {
    try {
      const [rows] = await req.pool.query(
        "SELECT id, title, description, image_url, cta_text, cta_url, is_active FROM banners"
      );
      res.json(rows);
    } catch (err) {
      console.error("Error fetching admin banners:", err);
      res.status(500).json({ error: "Failed to fetch banners" });
    }
  }
);

// Create a new banner (admin)
router.post(
  "/admin/banners",
  authenticateToken,
  requireAdmin,
  async (req, res) => {
    const { title, description, image_url, cta_text, cta_url, is_active } =
      req.body;
    if (!title || !image_url) {
      return res
        .status(400)
        .json({ error: "Title and image URL are required" });
    }

    try {
      await req.pool.query(
        `
      INSERT INTO banners (title, description, image_url, cta_text, cta_url, is_active)
      VALUES (?, ?, ?, ?, ?, ?)
    `,
        [title, description, image_url, cta_text, cta_url, is_active ?? true]
      );
      res.status(201).json({ message: "Banner created" });
    } catch (err) {
      console.error("Error creating banner:", err);
      res.status(500).json({ error: "Failed to create banner" });
    }
  }
);

// Update a banner (admin)
router.put(
  "/admin/banners/:id",
  authenticateToken,
  requireAdmin,
  async (req, res) => {
    const { id } = req.params;
    const { title, description, image_url, cta_text, cta_url, is_active } =
      req.body;

    try {
      const [result] = await req.pool.query(
        `
      UPDATE banners
      SET title = ?, description = ?, image_url = ?, cta_text = ?, cta_url = ?, is_active = ?
      WHERE id = ?
    `,
        [title, description, image_url, cta_text, cta_url, is_active, id]
      );
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: "Banner not found" });
      }
      res.json({ message: "Banner updated" });
    } catch (err) {
      console.error("Error updating banner:", err);
      res.status(500).json({ error: "Failed to update banner" });
    }
  }
);

// Delete a banner (admin)
router.delete(
  "/admin/banners/:id",
  authenticateToken,
  requireAdmin,
  async (req, res) => {
    const { id } = req.params;

    try {
      const [result] = await req.pool.query(
        "DELETE FROM banners WHERE id = ?",
        [id]
      );
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: "Banner not found" });
      }
      res.json({ message: "Banner deleted" });
    } catch (err) {
      console.error("Error deleting banner:", err);
      res.status(500).json({ error: "Failed to delete banner" });
    }
  }
);

module.exports = router;
