const mysql = require("mysql2/promise");
const bcrypt = require("bcrypt");
require("dotenv").config();

const initializeDatabase = async () => {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
  });

  try {
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
        stock INT NOT NULL,
        description TEXT,
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

    // Create orders table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS orders (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT,
        total DECIMAL(10, 2) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create users table for authentication
    await connection.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        email VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        role ENUM('user', 'admin') NOT NULL DEFAULT 'user',
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
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Seed sample products
    const [productRows] = await connection.query(
      "SELECT COUNT(*) AS count FROM products"
    );
    if (productRows[0].count === 0) {
      await connection.query(`
        INSERT INTO products (name, price, image, stock, description, featured)
        VALUES 
          ('Sample Product 1', 29.99, 'https://via.placeholder.com/150', 10, 'A great product', TRUE),
          ('Sample Product 2', 49.99, 'https://via.placeholder.com/150', 5, 'Another great product', TRUE),
          ('Sample Product 3', 39.99, 'https://via.placeholder.com/150', 8, 'Yet another product', FALSE)
      `);
    }

    // Seed sample cart items
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

    // Seed or update admin user
    const [userRows] = await connection.query(
      "SELECT COUNT(*) AS count FROM users"
    );
    if (userRows[0].count === 0) {
      const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD, 10);
      await connection.query(
        `
        INSERT INTO users (email, password, role)
        VALUES (?, ?, 'admin')
      `,
        [process.env.ADMIN_EMAIL, hashedPassword]
      );
    } else {
      // Update admin user if email or password has changed
      const [existingAdmin] = await connection.query(
        "SELECT email, password FROM users WHERE role = 'admin' LIMIT 1"
      );
      if (existingAdmin.length > 0) {
        const admin = existingAdmin[0];
        const isPasswordValid = await bcrypt.compare(
          process.env.ADMIN_PASSWORD,
          admin.password
        );
        if (admin.email !== process.env.ADMIN_EMAIL || !isPasswordValid) {
          const hashedPassword = await bcrypt.hash(
            process.env.ADMIN_PASSWORD,
            10
          );
          await connection.query(
            `
            UPDATE users
            SET email = ?, password = ?
            WHERE role = 'admin'
          `,
            [process.env.ADMIN_EMAIL, hashedPassword]
          );
        }
      }
    }

    // Seed sample banners
    const [bannerRows] = await connection.query(
      "SELECT COUNT(*) AS count FROM banners"
    );
    if (bannerRows[0].count === 0) {
      await connection.query(`
        INSERT INTO banners (title, description, image_url, cta_text, cta_url, is_active)
        VALUES 
          ('Welcome to Our Store', 'Discover the best deals on electronics!', '/promo-electronics.jpg', 'Shop Now', '/products', TRUE),
          ('Summer Sale', 'Up to 50% off on fashion items!', '/promo-fashion.jpg', 'Explore Deals', '/products', TRUE)
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
