// lib/db.js
import pkg from "pg";
const { Pool } = pkg;

// Make sure DATABASE_URL exists in your .env file
export const pool = new Pool({
  
  // user: process.env.PG_USER,
  // password: process.env.PG_PASSWORD,
  // host: process.env.PG_HOST,
  // port: process.env.PG_PORT,
  // database: process.env.PG_DATABASE,

  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

// helper function to query the database
export async function query(text, params) {
  try {
    const res = await pool.query(text, params);
    return res.rows;
  } catch (error) {
    console.error("[db.js] query error:", error);
    throw error;
  }
}

