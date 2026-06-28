import pool from "../src/db";

async function migrate() {
  console.log("Running migration...");

  await pool.query(`
    CREATE TABLE IF NOT EXISTS items (
      access_token TEXT NOT NULL,
      item_id      TEXT NOT NULL,
      name         TEXT NOT NULL,
      checked      BOOLEAN NOT NULL DEFAULT false,
      created_at   TEXT NOT NULL,
      PRIMARY KEY (access_token, item_id)
    )
  `);

  console.log("Migration complete: table 'items' ready.");
  await pool.end();
}

migrate().catch((err) => {
  console.error("Migration failed:", err);
  process.exit(1);
});
