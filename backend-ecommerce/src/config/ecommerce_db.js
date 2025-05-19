require("dotenv").config();
const mysql = require("mysql2/promise");

async function initializeDatabase() {
  let connection;
  try {
    console.log("Attempting to connect to MySQL with:", {
      host: process.env.DB_HOST || "localhost",
      user: process.env.DB_USER || "root",
    });

    // Connect without specifying a database
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || "localhost",
      user: process.env.DB_USER || "root",
      password: process.env.DB_PASSWORD || "",
    });
    console.log("Connected to MySQL server");

    const dbName = process.env.DB_NAME || "ecommerce_db";

    // Check if database exists
    const [databases] = await connection.query("SHOW DATABASES LIKE ?", [
      dbName,
    ]);
    if (databases.length === 0) {
      console.log(`Database ${dbName} does not exist, creating...`);
      await connection.query(`CREATE DATABASE ${dbName}`);
      console.log(`Database ${dbName} created`);
    }

    // Switch to the database
    await connection.query(`USE ${dbName}`);
    console.log(`Using database ${dbName}`);

    // Create connection pool for subsequent queries
    const pool = mysql.createPool({
      host: process.env.DB_HOST || "localhost",
      user: process.env.DB_USER || "root",
      password: process.env.DB_PASSWORD || "",
      database: dbName,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
    });

    // Create products table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS products (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        price DECIMAL(10, 2) NOT NULL,
        image VARCHAR(255),
        stock INT NOT NULL,
        featured BOOLEAN DEFAULT FALSE
      )
    `);

    // Create cart table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS cart (
        user_id INT NOT NULL,
        product_id INT NOT NULL,
        quantity INT NOT NULL,
        PRIMARY KEY (user_id, product_id),
        FOREIGN KEY (product_id) REFERENCES products(id)
      )
    `);

    // Create users table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        first_name VARCHAR(50) NOT NULL,
        last_name VARCHAR(50),
        email VARCHAR(255) NOT NULL UNIQUE,
        phone_number VARCHAR(20) NOT NULL,
        password VARCHAR(255) NOT NULL,
        role ENUM('user', 'admin') DEFAULT 'user',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create banners table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS banners (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        image_url VARCHAR(255) NOT NULL,
        cta_text VARCHAR(50),
        cta_url VARCHAR(255),
        is_active BOOLEAN DEFAULT TRUE
      )
    `);

    // Insert sample products if table is empty
    const [products] = await connection.query(
      "SELECT COUNT(*) as count FROM products"
    );
    if (products[0].count === 0) {
      await connection.query(`
        INSERT INTO products (id, name, price, image, stock, featured) VALUES
        (1, 'Sample Product 1', 29.99, 'https://via.placeholder.com/150', 10, TRUE),
        (2, 'Sample Product 2', 19.99, 'https://via.placeholder.com/150', 15, TRUE),
        (3, 'Sample Product 3', 39.99, 'https://via.placeholder.com/150', 8, FALSE)
      `);
      console.log("Inserted sample products");
    }

    // Insert sample cart data if table is empty
    const [cart] = await connection.query("SELECT COUNT(*) as count FROM cart");
    if (cart[0].count === 0) {
      await connection.query(`
        INSERT INTO cart (user_id, product_id, quantity) VALUES
        (1, 1, 1),
        (1, 3, 1)
      `);
      console.log("Inserted sample cart data");
    }

    // Insert sample user if table is empty
    const [users] = await connection.query(
      "SELECT COUNT(*) as count FROM users"
    );
    if (users[0].count === 0) {
      const bcrypt = require("bcrypt");
      const saltRounds = 10;
      const adminPassword = process.env.ADMIN_PASSWORD || "admin@2025";
      const hashedPassword = await bcrypt.hash(adminPassword, saltRounds);
      await connection.query(
        `
        INSERT INTO users (first_name, last_name, email, phone_number, password, role) VALUES
        (?, ?, ?, ?, ?, ?)
      `,
        [
          process.env.ADMIN_FIRST_NAME || "Admin",
          process.env.ADMIN_LAST_NAME || "User",
          process.env.ADMIN_EMAIL || "admin@commerce.com",
          process.env.ADMIN_PHONE_NUMBER || "+1234567890",
          hashedPassword,
          "admin",
        ]
      );
      console.log("Inserted sample admin user");
    }

    // Insert sample banner if table is empty
    const [banners] = await connection.query(
      "SELECT COUNT(*) as count FROM banners"
    );
    if (banners[0].count === 0) {
      await connection.query(`
        INSERT INTO banners (title, description, image_url, cta_text, cta_url, is_active) VALUES
        ('Welcome to Our Store', 'Shop the latest trends!', 'https://via.placeholder.com/1200x400', 'Shop Now', '/products', TRUE)
      `);
      console.log("Inserted sample banner");
    }

    console.log("E-commerce database and tables initialized");
    connection.end();
    return { pool };
  } catch (err) {
    console.error("Database initialization error:", err);
    if (connection) connection.end();
    throw err;
  }
}

module.exports = { initializeDatabase };
