//TEMPLATE


// server/models/User.js
const db = require('../config/db');  // Import the PostgreSQL client
const bcrypt = require('bcrypt');    // Import bcrypt for hashing passwords

// Function to get all users
const getUsers = async () => {
  try {
    const result = await db.query('SELECT * FROM users');
    return result.rows;  // Return the rows (results)
  } catch (err) {
    console.error('Error getting users:', err);
    throw err;
  }
};

// Function to create a new user
const createUser = async (username, email, password) => {
  try {
    // Hash the password before storing it
    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await db.query(
      'INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING *',
      [username, email, hashedPassword]
    );
    return result.rows[0];  // Return the created user
  } catch (err) {
    console.error('Error creating user:', err);
    throw err;
  }
};

module.exports = { getUsers, createUser };
