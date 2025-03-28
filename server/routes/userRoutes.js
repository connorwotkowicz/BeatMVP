// server/routes/userRoutes.js
const express = require('express');
const router = express.Router();

// Placeholder - update when you have getUsers in your model
router.get('/', async (req, res) => {
  try {
    // Example: return a mock array or "Not implemented"
    res.status(200).json({ message: "User listing not implemented yet." });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
