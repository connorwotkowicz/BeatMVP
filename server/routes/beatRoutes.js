//TEMPLATE



// server/routes/beatRoutes.js
const express = require('express');
const router = express.Router();
const { getBeats, createBeat } = require('../models/Beat');

// Get all beats
router.get('/', async (req, res) => {
  try {
    const beats = await getBeats();
    res.json(beats);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create a new beat
router.post('/', async (req, res) => {
  const { title, audioUrl } = req.body;
  try {
    const newBeat = await createBeat(title, audioUrl);
    res.status(201).json(newBeat);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
