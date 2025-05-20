const bcrypt = require("bcrypt");
const db = require('../config/db');

const getUserByEmail = async (email) => {
  const result = await db.query(
    "SELECT * FROM users WHERE email = $1",
    [email]
  );
  return result.rows[0];
};

const getUserById = async (id) => {
  const result = await db.query(
    "SELECT * FROM users WHERE id = $1",
    [id]
  );
  return result.rows[0];
};

const registerUser = async (email, password) => {
  const hashedPassword = await bcrypt.hash(password, 10);
  const result = await db.query(
    "INSERT INTO users (email, password) VALUES ($1, $2) RETURNING id, email",
    [email, hashedPassword]
  );
  return result.rows[0];
};

module.exports = {
  getUserByEmail,
  getUserById,
  registerUser,
};
