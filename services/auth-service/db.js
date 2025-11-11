// db.js
import mysql from "mysql2/promise";
import dotenv from 'dotenv';

const envFile = process.env.NODE_ENV === 'test' ? '.env.test' : '.env';
dotenv.config({ path: envFile });

console.log(`Using env file: ${envFile}`);


const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Test connection
(async () => {
  try {
    const conn = await pool.getConnection();
    console.log("✅ MySQL connected successfully!");
    conn.release(); // release the connection back to pool
  } catch (err) {
    console.error("❌ MySQL connection error:", err);
  }
})();

export default pool;
