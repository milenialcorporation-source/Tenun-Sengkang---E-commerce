import mysql from 'mysql2/promise';

let pool: any = null;

if (process.env.MYSQL_HOST) {
  pool = mysql.createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    port: process.env.MYSQL_PORT ? parseInt(process.env.MYSQL_PORT) : 3306,
    waitForConnections: true,
    connectionLimit: 10,
    maxIdle: 10, 
    idleTimeout: 60000,
    connectTimeout: 5000, // Add timeout to prevent hanging forever
    queueLimit: 0,
    enableKeepAlive: true,
    keepAliveInitialDelay: 0,
  });
}

// In-memory fallback if no DB configured
let inMemoryState: any = null;

export async function query(sql: string, values?: any[]) {
  if (!pool) {
    // Basic in-memory mock for state
    if (sql.includes('SELECT data FROM store_state')) {
      return inMemoryState ? [{ data: inMemoryState }] : [];
    }
    if (sql.includes('UPDATE store_state') || sql.includes('INSERT INTO store_state')) {
      inMemoryState = values?.[0];
      return [{ affectedRows: 1 }];
    }
    if (sql.includes('SELECT COUNT(*)')) {
      return [{ count: inMemoryState ? 1 : 0 }];
    }
    return [];
  }
  
  try {
    const [results] = await pool.execute(sql, values);
    return results;
  } catch (error) {
    console.error(`Database query failed: ${sql}`, error);
    // If we're failing to query, we should probably throw so the caller knows,
    // or return a safe fallback if it's a critical read like state.
    throw error;
  }
}

let isInitialized = false;

export async function initializeDatabase() {
  if (isInitialized) return;
  if (!pool) {
    console.log('MySQL not configured, using in-memory fallback.');
    isInitialized = true;
    return;
  }
  try {
    await query(`
      CREATE TABLE IF NOT EXISTS store_state (
        id INT AUTO_INCREMENT PRIMARY KEY,
        data LONGTEXT NOT NULL,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    await query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    await query(`
      CREATE TABLE IF NOT EXISTS wishlist (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_email VARCHAR(255) NOT NULL,
        product_id VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE KEY user_product (user_email, product_id)
      )
    `);

    await query(`
      CREATE TABLE IF NOT EXISTS orders (
        id VARCHAR(255) PRIMARY KEY,
        user_email VARCHAR(255) NOT NULL,
        total DECIMAL(10, 2) NOT NULL,
        status VARCHAR(50) NOT NULL,
        items TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    const rows = await query("SELECT COUNT(*) as count FROM store_state") as any[];
    if (rows[0].count === 0) {
      await query("INSERT INTO store_state (data) VALUES (?)", ['{}']);
    }
    console.log("MySQL Database initialized successfully.");
    isInitialized = true;
  } catch (error) {
    console.error("Error initializing MySQL Database:", error);
  }
}

export { pool };
