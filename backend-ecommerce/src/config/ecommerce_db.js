require("dotenv").config();
const mysql = require("mysql2/promise");

async function initializeDatabase() {
  let connection;
  try {
    console.log("Attempting to connect to MySQL with:", {
      host: process.env.DB_HOST || "localhost",
      user: process.env.DB_USER || "Ericadesh",
    });

    // Connect without specifying a database
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || "localhost",
      user: process.env.DB_USER || "Ericadesh",
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

    // Create connection pool
    const pool = mysql.createPool({
      host: process.env.DB_HOST || "localhost",
      user: process.env.DB_USER || "Ericadesh",
      password: process.env.DB_PASSWORD || "",
      database: dbName,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
    });

    // Check and create tables
    const tables = [
      {
        name: "users",
        createQuery: `
          CREATE TABLE IF NOT EXISTS users (
            id INT AUTO_INCREMENT PRIMARY KEY,
            email VARCHAR(255) UNIQUE NOT NULL,
            password VARCHAR(255) NOT NULL,
            role ENUM('admin', 'user') DEFAULT 'user',
            first_name VARCHAR(100),
            last_name VARCHAR(100),
            phone_number VARCHAR(20)
          )
        `,
        sampleData: async () => {
          const [count] = await connection.query(
            "SELECT COUNT(*) as count FROM users"
          );
          if (count[0].count === 0) {
            const bcrypt = require("bcrypt");
            const saltRounds = 10;
            const adminPassword = process.env.ADMIN_PASSWORD || "admin@2025";
            const userPassword = process.env.USER_PASSWORD || "password123";
            const hashedAdminPassword = await bcrypt.hash(
              adminPassword,
              saltRounds
            );
            const hashedUserPassword = await bcrypt.hash(
              userPassword,
              saltRounds
            );
            await connection.query(
              `
              INSERT INTO users (email, password, role, first_name, last_name, phone_number) VALUES
              (?, ?, ?, ?, ?, ?),
              (?, ?, ?, ?, ?, ?)
            `,
              [
                "admin@commerce.com",
                hashedAdminPassword,
                "admin",
                "Admin",
                null,
                "+1234567890",
                "jane.smith@example.com",
                hashedUserPassword,
                "user",
                "Jane",
                "Smith",
                "+0987654321",
              ]
            );
            console.log("Inserted sample users");
          }
        },
      },
      {
        name: "products",
        createQuery: `
          CREATE TABLE IF NOT EXISTS products (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            price DECIMAL(10,2) NOT NULL,
            image VARCHAR(255),
            stock INT NOT NULL,
            featured BOOLEAN DEFAULT FALSE,
            is_accessory BOOLEAN DEFAULT FALSE,
            is_new BOOLEAN DEFAULT FALSE,
            category ENUM('womens', 'mens', 'childrens', 'beddings', 'shoes') NOT NULL,
            original_price DECIMAL(10,2),
            discount_percentage INT
          )
        `,
        sampleData: async () => {
          const [count] = await connection.query(
            "SELECT COUNT(*) as count FROM products"
          );
          if (count[0].count === 0) {
            await connection.query(`
              INSERT INTO products (id, name, price, image, stock, featured, is_accessory, is_new, category, original_price, discount_percentage) VALUES
              (1, 'Summer Dress', 49.99, 'https://placehold.co/150x150', 20, TRUE, FALSE, TRUE, 'womens', 59.99, 15),
              (2, 'Men Sneakers', 79.99, 'https://placehold.co/150x150', 15, TRUE, FALSE, TRUE, 'shoes', 89.99, 10),
              (3, 'Kids T-Shirt', 19.99, 'https://placehold.co/150x150', 30, FALSE, FALSE, FALSE, 'childrens', NULL, NULL),
              (4, 'Silk Scarf', 29.99, 'https://placehold.co/150x150', 25, TRUE, TRUE, TRUE, 'womens', 34.99, 14),
              (5, 'Cotton Duvet', 99.99, 'https://placehold.co/150x150', 10, FALSE, FALSE, TRUE, 'beddings', 119.99, 16)
            `);
            console.log("Inserted sample products");
          }
        },
      },
      {
        name: "cart",
        createQuery: `
          CREATE TABLE IF NOT EXISTS cart (
            user_id INT NOT NULL,
            product_id INT NOT NULL,
            quantity INT NOT NULL,
            PRIMARY KEY (user_id, product_id),
            FOREIGN KEY (product_id) REFERENCES products(id)
          )
        `,
        sampleData: async () => {
          const [count] = await connection.query(
            "SELECT COUNT(*) as count FROM cart"
          );
          if (count[0].count === 0) {
            await connection.query(`
              INSERT INTO cart (user_id, product_id, quantity) VALUES
              (1, 1, 1),
              (1, 4, 2)
            `);
            console.log("Inserted sample cart data");
          }
        },
      },
      {
        name: "banners",
        createQuery: `
          CREATE TABLE IF NOT EXISTS banners (
            id INT AUTO_INCREMENT PRIMARY KEY,
            title VARCHAR(255) NOT NULL,
            description TEXT,
            image_url VARCHAR(255) NOT NULL,
            cta_text VARCHAR(50),
            cta_url VARCHAR(255),
            is_active BOOLEAN DEFAULT TRUE
          )
        `,
        sampleData: async () => {
          const [count] = await connection.query(
            "SELECT COUNT(*) as count FROM banners"
          );
          if (count[0].count === 0) {
            await connection.query(`
              INSERT INTO banners (title, description, image_url, cta_text, cta_url, is_active) VALUES
              ('Summer Collection', 'Explore the latest trends!', 'https://placehold.co/1200x400', 'Shop Now', '/products/womens', TRUE),
              ('New Arrivals', 'Fresh styles for all!', 'https://placehold.co/1200x400', 'Discover', '/products', TRUE)
            `);
            console.log("Inserted sample banners");
          }
        },
      },
      {
        name: "promotions",
        createQuery: `
          CREATE TABLE IF NOT EXISTS promotions (
            id INT AUTO_INCREMENT PRIMARY KEY,
            title VARCHAR(255) NOT NULL,
            description TEXT,
            image_url VARCHAR(255) NOT NULL,
            cta_text VARCHAR(50),
            cta_url VARCHAR(255),
            is_active BOOLEAN DEFAULT TRUE
          )
        `,
        sampleData: async () => {
          const [count] = await connection.query(
            "SELECT COUNT(*) as count FROM promotions"
          );
          if (count[0].count === 0) {
            await connection.query(`
              INSERT INTO promotions (title, description, image_url, cta_text, cta_url, is_active) VALUES
              ('Free Shipping', 'On orders over $50', 'https://placehold.co/400x300', 'Shop Now', '/products', TRUE),
              ('Beddings Sale', '20% off all beddings', 'https://placehold.co/400x300', 'Shop Sale', '/products/beddings', TRUE)
            `);
            console.log("Inserted sample promotions");
          }
        },
      },
      {
        name: "reviews",
        createQuery: `
          CREATE TABLE IF NOT EXISTS reviews (
            id INT AUTO_INCREMENT PRIMARY KEY,
            user_id INT NOT NULL,
            product_id INT NOT NULL,
            rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
            comment TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id),
            FOREIGN KEY (product_id) REFERENCES products(id)
          )
        `,
        sampleData: async () => {
          const [count] = await connection.query(
            "SELECT COUNT(*) as count FROM reviews"
          );
          if (count[0].count === 0) {
            await connection.query(`
              INSERT INTO reviews (user_id, product_id, rating, comment) VALUES
              (1, 1, 5, 'Love this dress, perfect fit!'),
              (1, 4, 4, 'Great scarf, vibrant colors.')
            `);
            console.log("Inserted sample reviews");
          }
        },
      },
    ];

    // Create tables and insert sample data if empty
    for (const table of tables) {
      const [tableExists] = await connection.query("SHOW TABLES LIKE ?", [
        table.name,
      ]);
      if (tableExists.length === 0) {
        console.log(`Creating table ${table.name}...`);
        await connection.query(table.createQuery);
        console.log(`Table ${table.name} created`);
      }
      await table.sampleData();
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
