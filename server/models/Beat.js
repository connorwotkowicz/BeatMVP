// server/models/Beat.js
const db = require('../config/db');  // Import the PostgreSQL client

// Function to get all beats
const getBeats = async () => {
  const result = await db.query('SELECT * FROM beats');
  return result.rows;  // Return the rows (results)
};

// Function to create a new beat
const createBeat = async (title, audioUrl) => {
  const result = await db.query(
    'INSERT INTO beats (title, audio_url) VALUES ($1, $2) RETURNING *',
    [title, audioUrl]
  );
  return result.rows[0];  // Return the created beat
};

module.exports = { getBeats, createBeat };
