// api-server/src/db.js
import pkg from 'pg';
const { Pool } = pkg;
import dotenv from 'dotenv';
dotenv.config();

const connectionString = process.env.DATABASE_URL || (process.env.PGHOST ? undefined : null);

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  host: process.env.PGHOST,
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  database: process.env.PGDATABASE,
  port: process.env.PGPORT ? Number(process.env.PGPORT) : undefined,
  // optional: increase pool size in production
  max: process.env.PG_MAX_CLIENTS ? Number(process.env.PG_MAX_CLIENTS) : 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000
});

// simple test on startup (optional)
pool.on('error', (err) => {
  console.error('Unexpected error on idle pg client', err);
  process.exit(-1);
});

export default pool;
