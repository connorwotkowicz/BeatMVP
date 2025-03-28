//TEMPLATE



const db = require('../config/db');  
const bcrypt = require('bcrypt');   


const getUsers = async () => {
  try {
    const result = await db.query('SELECT * FROM users');
    return result.rows;  
  } catch (err) {
    console.error('Error getting users:', err);
    throw err;
  }
};


const createUser = async (username, email, hashedPassword) => {
  const result = await db.query(
    "INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING id, email, username",
    [username, email, hashedPassword]
  );
  return result.rows[0];
};


module.exports = { getUsers, createUser };
