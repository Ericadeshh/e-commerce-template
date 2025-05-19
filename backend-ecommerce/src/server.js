require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { initializeDatabase } = require("./config/ecommerce_db.js");
const productsRouter = require("./routes/products.js");
const authRouter = require("./routes/auth.js");
const adminRouter = require("./routes/admin.js");
const app = express();
const port = process.env.PORT || 5000;

app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.json());

// Log router mounting
console.log("Mounting routers...");
app.use("/api", productsRouter);
console.log("Mounted productsRouter at /api");
app.use("/api/auth", authRouter);
console.log("Mounted authRouter at /api/auth");
app.use("/api/admin", adminRouter);
console.log("Mounted adminRouter at /api/admin");

// Health check endpoint
app.get("/health", (req, res) => {
  console.log("GET /health called");
  res.status(200).json({ status: "OK" });
});

// Catch-all route for debugging (must be last)
app.use((req, res) => {
  console.log(`Unmatched route: ${req.method} ${req.originalUrl}`);
  res.status(404).json({ error: "Route not found" });
});

// Initialize database and start server
initializeDatabase()
  .then(({ pool }) => {
    // Make pool available to routers
    app.locals.pool = pool;
    app.listen(port, () => {
      console.log(`Server running at http://localhost:${port}`);
    });
  })
  .catch((err) => {
    console.error("Failed to initialize database:", err);
    process.exit(1);
  });

// Error handling for uncaught exceptions
process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err);
});
