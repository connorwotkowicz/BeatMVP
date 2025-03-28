// server/controllers/authController.js
const UserModel = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require("../config/db");
const { jwtSecret } = require("../config/authConfig");

const registerUser = async (req, res) => {
    const { username, email, password } = req.body;
    try {
      const hashed = await bcrypt.hash(password, 10);
      const user = await UserModel.createUser(username, email, hashed);
      const token = console.log("JWT Secret:", jwtSecret);
      jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: "1d" });
      res.json({ user, token });
    } catch (err) {
        console.error("Registration error:", err);
      
        if (err.code === '23505') {
          return res.status(400).json({ error: "Email or username already exists." });
        }
      
        res.status(500).json({ error: "Registration failed" });
      }
      
    
  };
  

const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const result = await db.query("SELECT * FROM users WHERE email = $1", [email]);
    const user = result.rows[0];
    if (!user) return res.status(401).json({ error: "Invalid credentials" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ error: "Invalid credentials" });

    const token = jwt.sign({ id: user.id }, jwtSecret, { expiresIn: "1d" });
    res.json({ user: { id: user.id, email: user.email }, token });
  } catch (err) {
    res.status(500).json({ error: "Login failed" });
  }
};

module.exports = { registerUser, loginUser };
