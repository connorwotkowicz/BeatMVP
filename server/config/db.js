
const { Client } = require('pg');

const client = new Client({
  user: 'roro',
  host: 'localhost',
  database: 'beat_mvp_db',
  password: 'your-database-password',
  port: 5432,
});

client.connect();

module.exports = client;
