
const express = require('express');
const router = express.Router();


router.get('/', async (req, res) => {
  try {
 
    res.status(200).json({ message: "User listing not implemented yet." });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
