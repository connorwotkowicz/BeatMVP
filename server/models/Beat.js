//TEMPLATE


const db = require('../config/db'); 
const uuid = require('uuid');


const getBeats = async () => {
  const result = await db.query('SELECT * FROM beats');
  return result.rows;  
};


const createBeat = async (title, audioUrl) => {
  const result = await db.query(
    'INSERT INTO beats (title, audio_url) VALUES ($1, $2) RETURNING *',
    [uuid.v4(), title, audioUrl]
  );
  return result.rows[0];  
};


const savePattern = async (userId, patternName, patternData) => {
  const result = await db.query(
    "INSERT INTO patterns (user_id, name, data) VALUES ($1, $2, $3) RETURNING *",
    [userId, patternName, patternData]
  );
  return result.rows[0]; 
};

const getPatternsByUserId = async (userId) => {
  const result = await db.query(
    "SELECT * FROM patterns WHERE user_id = $1 ORDER BY created_at DESC",
    [userId]
  );
  return result.rows; 
};

module.exports = { getBeats, createBeat, savePattern, getPatternsByUserId };
