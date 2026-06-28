import { Pool } from "pg";

// Connects to PostgreSQL using DATABASE_URL env var (set by Railway automatically).
// For local dev, set DATABASE_URL in a .env file or environment.
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false,
});

export default pool;

