

const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { getUserByEmail, registerUser } = require("../models/User");
const { authenticateToken } = require("../middleware/authMiddleware"); 

router.post("/register", async (req, res) => {
  const { email, password } = req.body;
  try {
    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      return res
        .status(400)
        .json({ success: false, message: "User already exists." });
    }

    const newUser = await registerUser(email, password);

    const token = jwt.sign({ id: newUser.id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    res.json({
      success: true,
      token,
      user: { id: newUser.id, email: newUser.email },
    });
  } catch (err) {
    console.error("Registration error:", err);
    res.status(500).json({ success: false, message: "Registration failed." });
  }
});



router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await getUserByEmail(email);
    if (!user) {
      return res.status(401).json({ success: false, message: "Invalid credentials." });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ success: false, message: "Invalid credentials." });
    }

    const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: "1d" });
    console.log('Generated Token:', token); 
    res.json({ success: true, token, user: { id: user.id, email: user.email } });
  } catch (err) {
    res.status(500).json({ success: false, message: "Login failed." });
  }
});


router.get("/me", authenticateToken, async (req, res) => {
  try {
 
    const user = await getUserByEmail(req.user.email); 

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    res.json(user); 
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch user data." });
  }
});

module.exports = router;
