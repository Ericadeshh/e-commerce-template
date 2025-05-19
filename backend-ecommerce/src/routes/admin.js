const express = require("express");
const jwt = require("jsonwebtoken");
const router = express.Router();

// Middleware to get pool
router.use((req, res, next) => {
  req.pool = req.app.locals.pool;
  next();
});

// Admin dashboard placeholder
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

// Create a banner (admin)
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

// Get all active promotions (public)
router.get("/promotions", async (req, res) => {
  try {
    const [rows] = await req.pool.query(
      "SELECT id, title, description, image_url, cta_text, cta_url FROM promotions WHERE is_active = TRUE"
    );
    res.json(rows);
  } catch (err) {
    console.error("Error fetching promotions:", err);
    res.status(500).json({ error: "Failed to fetch promotions" });
  }
});

// Get all promotions (admin)
router.get(
  "/admin/promotions",
  authenticateToken,
  requireAdmin,
  async (req, res) => {
    try {
      const [rows] = await req.pool.query(
        "SELECT id, title, description, image_url, cta_text, cta_url, is_active FROM promotions"
      );
      res.json(rows);
    } catch (err) {
      console.error("Error fetching admin promotions:", err);
      res.status(500).json({ error: "Failed to fetch promotions" });
    }
  }
);

// Create a promotion (admin)
router.post(
  "/admin/promotions",
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
      INSERT INTO promotions (title, description, image_url, cta_text, cta_url, is_active)
      VALUES (?, ?, ?, ?, ?, ?)
    `,
        [title, description, image_url, cta_text, cta_url, is_active ?? true]
      );
      res.status(201).json({ message: "Promotion created" });
    } catch (err) {
      console.error("Error creating promotion:", err);
      res.status(500).json({ error: "Failed to create promotion" });
    }
  }
);

// Update a promotion (admin)
router.put(
  "/admin/promotions/:id",
  authenticateToken,
  requireAdmin,
  async (req, res) => {
    const { id } = req.params;
    const { title, description, image_url, cta_text, cta_url, is_active } =
      req.body;

    try {
      const [result] = await req.pool.query(
        `
      UPDATE promotions
      SET title = ?, description = ?, image_url = ?, cta_text = ?, cta_url = ?, is_active = ?
      WHERE id = ?
    `,
        [title, description, image_url, cta_text, cta_url, is_active, id]
      );
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: "Promotion not found" });
      }
      res.json({ message: "Promotion updated" });
    } catch (err) {
      console.error("Error updating promotion:", err);
      res.status(500).json({ error: "Failed to update promotion" });
    }
  }
);

// Delete a promotion (admin)
router.delete(
  "/admin/promotions/:id",
  authenticateToken,
  requireAdmin,
  async (req, res) => {
    const { id } = req.params;

    try {
      const [result] = await req.pool.query(
        "DELETE FROM promotions WHERE id = ?",
        [id]
      );
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: "Promotion not found" });
      }
      res.json({ message: "Promotion deleted" });
    } catch (err) {
      console.error("Error deleting promotion:", err);
      res.status(500).json({ error: "Failed to delete promotion" });
    }
  }
);

// Get accessories (public)
router.get("/accessories", async (req, res) => {
  try {
    const [rows] = await req.pool.query(
      "SELECT id, name, price, image FROM products WHERE is_accessory = TRUE LIMIT 8"
    );
    res.json(rows);
  } catch (err) {
    console.error("Error fetching accessories:", err);
    res.status(500).json({ error: "Failed to fetch accessories" });
  }
});

// Update product accessory status (admin)
router.put(
  "/admin/products/:id/accessory",
  authenticateToken,
  requireAdmin,
  async (req, res) => {
    const { id } = req.params;
    const { is_accessory } = req.body;

    try {
      const [result] = await req.pool.query(
        "UPDATE products SET is_accessory = ? WHERE id = ?",
        [is_accessory, id]
      );
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: "Product not found" });
      }
      res.json({ message: "Product accessory status updated" });
    } catch (err) {
      console.error("Error updating product accessory status:", err);
      res.status(500).json({ error: "Failed to update accessory status" });
    }
  }
);

module.exports = router;
