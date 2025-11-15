import mariadb from "mariadb";
import dotenv from "dotenv";

dotenv.config();

const pool = mariadb.createPool({
  host: process.env.DB_HOST || "localhost",
  port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USER || "stuser",
  password: process.env.DB_PASS || "securepass",
  database: process.env.DB_NAME || "stglobal",
  connectionLimit: 5, // Reducido de 10 a 5 para no agotar límite de hosting
  connectTimeout: 5000, // Reducido de 10000 a 5000 ms
  idleTimeout: 30000, // Cierra conexiones inactivas después de 30s
  minDelayMillis: 0,
});

export async function query(sql, params = []) {
  let conn;
  try {
    conn = await pool.getConnection();
    const rows = await conn.query(sql, params);
    return Array.isArray(rows) ? [...rows] : rows; // no tocar rows.meta
  } finally {
    if (conn) conn.release();
  }
}

export async function ping() {
  try {
    const r = await query("SELECT 1 AS ok");
    return r?.[0]?.ok === 1;
  } catch (e) {
    console.error("DB ping error:", e.message);
    return false;
  }
}

// Graceful shutdown
process.on("SIGINT", async () => {
  try {
    await pool.end();
  } catch {}
  process.exit(0);
});
