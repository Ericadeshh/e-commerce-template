const express = require("express");
const cors = require("cors");
const { initializeDatabase } = require("./config/ecommerce_db");
const productsRouter = require("./routes/products");
const authRouter = require("./routes/auth");
const adminRouter = require("./routes/admin");
const app = express();
const port = process.env.PORT || 5000;

// Enable CORS for all origins, methods, and headers
app.use(
  cors({
    origin: "*", // Allow all origins
    methods: "*", // Allow all methods (GET, POST, PUT, DELETE, OPTIONS, etc.)
    allowedHeaders: "*", // Allow all headers (Content-Type, Authorization, Cache-Control, etc.)
  })
);
app.use(express.json());

// Log router mounting
console.log("Mounting routers...");
app.use("/api/products", productsRouter);
console.log("Mounted productsRouter at /api/products");
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
async function startServer() {
  try {
    const { pool } = await initializeDatabase();
    app.locals.pool = pool;
    app.listen(port, () => {
      console.log(`Server running at http://localhost:${port}`);
    });
  } catch (err) {
    console.error("Failed to start server:", err);
    process.exit(1);
  }
}

startServer();

// Error handling for uncaught exceptions
process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err);
});
