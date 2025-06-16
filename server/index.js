const express = require('express');
const cors = require("cors");
const dotenv = require('dotenv');
const path = require('path');
const { Pool } = require('pg');

dotenv.config({ path: path.resolve(__dirname, '.env') });

console.log('PORT from env:', process.env.PORT);
console.log('DATABASE_URL:', process.env.DATABASE_URL);

const app = express();


const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
    sslmode: 'require'
  }
});


pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('Database connection error:', err.stack);
  } else {
    console.log('Database connected at:', res.rows[0].now);
  }
});

app.use(cors({
  origin: "http://localhost:3000", 
  credentials: false
}));

app.use(express.json());  


app.use('/api/users', require('./routes/userRoutes.js'));
app.use('/api/beats', require('./routes/beatRoutes.js'));
app.use('/api/auth', require('./routes/authRoutes.js'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});


process.on('SIGINT', () => {
  pool.end(() => {
    console.log('Pool has ended');
    process.exit(0);
  });
});