const db = require('../config/db');

// Get user by email
const getUserByEmail = async (email) => {
  const result = await db.query(
    "SELECT * FROM users WHERE email = $1",
    [email]
  );
  return result.rows[0];
};

// Register a new user
const registerUser = async (email, hashedPassword) => {
  const result = await db.query(
    "INSERT INTO users (email, password) VALUES ($1, $2) RETURNING id, email",
    [email, hashedPassword]
  );
  return result.rows[0];
};

module.exports = {
  getUserByEmail,
  registerUser,
};
