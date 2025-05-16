const mysql = require("mysql2/promise");
require("dotenv").config();

const initializeDatabase = async () => {
  // Connect without database to check/create DB
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
  });

  try {
    // Create database if it doesn't exist
    await connection.query(
      `CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME}`
    );
    await connection.query(`USE ${process.env.DB_NAME}`);

    // Create products table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS products (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        price DECIMAL(10, 2) NOT NULL,
        image VARCHAR(255),
        stock INT NOT NULL
      )
    `);

    // Create cart table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS cart (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT,
        product_id INT,
        quantity INT NOT NULL,
        FOREIGN KEY (product_id) REFERENCES products(id)
      )
    `);

    // Create orders table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS orders (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT,
        total DECIMAL(10, 2) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Insert sample products if table is empty
    const [rows] = await connection.query(
      "SELECT COUNT(*) AS count FROM products"
    );
    if (rows[0].count === 0) {
      await connection.query(`
        INSERT INTO products (name, price, image, stock)
        VALUES 
          ('Sample Product 1', 29.99, 'https://via.placeholder.com/150', 10),
          ('Sample Product 2', 49.99, 'https://via.placeholder.com/150', 5)
      `);
    }

    console.log("E-commerce database and tables initialized");
  } catch (err) {
    console.error("Error initializing database:", err);
  } finally {
    await connection.end();
  }
};

// Connection pool for routes
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

module.exports = { initializeDatabase, pool };
