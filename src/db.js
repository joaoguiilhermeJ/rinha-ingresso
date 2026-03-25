import pkg from "pg";
const { Pool } = pkg;

if (!process.env.DATABASE_URL) {
  process.exit(1);
}

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
  ssl: {
    rejectUnauthorized: false,
  },
});

pool.on("error", (err, client) => {
  process.exit(-1);
});
