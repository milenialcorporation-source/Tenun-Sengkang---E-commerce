import mysql from 'mysql2/promise';

const pool = mysql.createPool({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  port: process.env.MYSQL_PORT ? parseInt(process.env.MYSQL_PORT) : 3306,
  waitForConnections: true,
  connectionLimit: 10,
  maxIdle: 10, // max idle connections, the default value is the same as `connectionLimit`
  idleTimeout: 60000, // idle connections timeout, in milliseconds, the default value 60000
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0,
});

export async function query(sql: string, values?: any[]) {
  const [results] = await pool.execute(sql, values);
  return results;
}

export async function initializeDatabase() {
  try {
    await query(`
      CREATE TABLE IF NOT EXISTS store_state (
        id INT AUTO_INCREMENT PRIMARY KEY,
        data LONGTEXT NOT NULL,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);
    
    // Seed initial data if table is empty
    const rows = await query("SELECT COUNT(*) as count FROM store_state") as any[];
    if (rows[0].count === 0) {
      await query("INSERT INTO store_state (data) VALUES (?)", ['{}']);
    }
    console.log("MySQL Database initialized successfully.");
  } catch (error) {
    console.error("Error initializing MySQL Database:", error);
  }
}

export { pool };
