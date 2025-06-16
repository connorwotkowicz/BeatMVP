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


const allowedOrigins = [
  'https://beatseq.vercel.app', 
  'http://localhost:3000'      
];

app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));

app.use(express.json());  


app.use('/api/users', require('./routes/userRoutes.js'));
app.use('/api/beats', require('./routes/beatRoutes.js'));
app.use('/api/auth', require('./routes/authRoutes.js'));


app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'healthy',
    server: 'EC2 backend',
    time: new Date().toISOString()
  });
});


app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});


const PORT = process.env.PORT || 5000;

const startServer = () => {
  const server = app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
  });

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.error(`FATAL ERROR: Port ${PORT} is already in use`);
      console.log('Trying to restart in 5 seconds...');
      setTimeout(() => {
        console.log('Restarting server...');
        startServer();
      }, 5000);
    } else {
      throw err;
    }
  });
};


startServer();


process.on('SIGINT', () => {
  console.log('Shutting down server...');
  pool.end(() => {
    console.log('Database pool closed');
    process.exit(0);
  });
});