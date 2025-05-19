const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const router = express.Router();

// Middleware to get pool from app.locals
router.use((req, res, next) => {
  req.pool = req.app.locals.pool;
  next();
});

// Signup route
router.post("/signup", async (req, res) => {
  console.log("POST /api/auth/signup called with body:", req.body);
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }
  try {
    // Check if user exists
    const [existingUsers] = await req.pool.query(
      "SELECT id FROM users WHERE email = ?",
      [email]
    );
    if (existingUsers.length > 0) {
      return res.status(409).json({ error: "Email already registered" });
    }
    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    // Insert user
    const [result] = await req.pool.query(
      'INSERT INTO users (email, password, role) VALUES (?, ?, "user")',
      [email, hashedPassword]
    );
    // Generate JWT
    const token = jwt.sign(
      { userId: result.insertId, email, role: "user" },
      process.env.JWT_SECRET || "your_jwt_secret",
      { expiresIn: "1h" }
    );
    console.log(`User signed up: ${email}`);
    res.status(201).json({ message: "User created", token, role: "user" });
  } catch (err) {
    console.error("Error during signup:", err);
    res.status(500).json({ error: "Failed to sign up" });
  }
});

// Login route
router.post("/login", async (req, res) => {
  console.log("POST /api/auth/login called with body:", req.body);
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }
  try {
    const [users] = await req.pool.query(
      "SELECT id, email, password, role FROM users WHERE email = ?",
      [email]
    );
    if (users.length === 0) {
      return res.status(401).json({ error: "Invalid credentials" });
    }
    const user = users[0];
    // Verify password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }
    // Generate JWT
    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET || "your_jwt_secret",
      { expiresIn: "1h" }
    );
    console.log(`User logged in: ${email}, Role: ${user.role}`);
    res.status(200).json({ token, role: user.role });
  } catch (err) {
    console.error("Error during login:", err);
    res.status(500).json({ error: "Failed to login" });
  }
});

module.exports = router;
