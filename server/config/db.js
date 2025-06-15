require('dotenv').config();
const { Pool } = require('pg');

console.log('DATABASE_URL:', process.env.DATABASE_URL);

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: false, 
});

(async () => {
  try {
    const client = await pool.connect();
    console.log('Connected via Supabase Pooler');
    client.release();
  } catch (err) {
    console.error('Connection error:', err.message);
    process.exit(1);
  }
})();

module.exports = {
  query: (text, params) => pool.query(text, params),
  end: () => pool.end(),
};
