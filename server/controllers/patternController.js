
const BeatModel = require("../models/Beat");

const savePattern = async (req, res) => {
  const userId = req.user?.id; 
  const { name, data } = req.body;

  try {
    const saved = await BeatModel.savePattern(userId, name, data);
    res.status(201).json(saved);
  } catch (err) {
    console.error("Error saving pattern:", err);
    res.status(500).json({ error: "Failed to save pattern" });
  }
};

const getUserPatterns = async (req, res) => {
  const userId = req.user?.id;

  try {
    const patterns = await BeatModel.getPatternsByUserId(userId);
    res.json(patterns);
  } catch (err) {
    console.error("Error fetching patterns:", err);
    res.status(500).json({ error: "Failed to retrieve patterns" });
  }
};

module.exports = {
  savePattern,
  getUserPatterns,
};
