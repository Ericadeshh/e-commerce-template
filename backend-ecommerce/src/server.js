const express = require("express");
const cors = require("cors");
const { initializeDatabase } = require("./config/ecommerce_db");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

// Routes
const productRoutes = require("./routes/products");
app.use("/products", productRoutes);

// Start server after database initialization
const startServer = async () => {
  await initializeDatabase();
  const port = process.env.PORT || 5000;
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
};

startServer();
