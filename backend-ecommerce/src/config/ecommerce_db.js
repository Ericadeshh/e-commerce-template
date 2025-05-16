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

    // Create products table with featured and description columns
    await connection.query(`
      CREATE TABLE IF NOT EXISTS products (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        price DECIMAL(10, 2) NOT NULL,
        image VARCHAR(255),
        stock INT NOT NULL,
        description TEXT,
        featured BOOLEAN DEFAULT FALSE
      )
    `);

    // Create cart table with composite key
    await connection.query(`
      CREATE TABLE IF NOT EXISTS cart (
        user_id INT NOT NULL,
        product_id INT NOT NULL,
        quantity INT NOT NULL,
        PRIMARY KEY (user_id, product_id),
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
        INSERT INTO products (name, price, image, stock, description, featured)
        VALUES 
          ('Sample Product 1', 29.99, 'https://via.placeholder.com/150', 10, 'A great product', TRUE),
          ('Sample Product 2', 49.99, 'https://via.placeholder.com/150', 5, 'Another great product', TRUE),
          ('Sample Product 3', 39.99, 'https://via.placeholder.com/150', 8, 'Yet another product', FALSE)
      `);
    }

    // Insert sample cart items if table is empty
    const [cartRows] = await connection.query(
      "SELECT COUNT(*) AS count FROM cart"
    );
    if (cartRows[0].count === 0) {
      await connection.query(`
        INSERT INTO cart (user_id, product_id, quantity)
        VALUES 
          (1, 1, 2),
          (1, 2, 1)
      `);
    }

    console.log("E-commerce database and tables initialized");
  } catch (err) {
    console.error("Error initializing database:", err);
    throw err;
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
