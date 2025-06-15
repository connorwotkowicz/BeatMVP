const express = require("express");
const router = express.Router();
const db = require("../config/db");
const { authenticateToken } = require("../middleware/authMiddleware");

router.post("/", authenticateToken, async (req, res) => {
  const { title, data } = req.body;

  if (!title || !data) {
    return res.status(400).json({ message: "Title and data are required." });
  }

  try {
    const jsonData = JSON.stringify(data);
    console.log("Saving beat with:", { user_id: req.user.id, title, data });

    const result = await db.query(
      "INSERT INTO beats (user_id, title, data) VALUES ($1, $2, $3) RETURNING *",
      [req.user.id, title, jsonData]
    );

    console.log("Insert result:", result.rows[0]);
    res.status(201).json({ beat: result.rows[0] });
  } catch (err) {
    console.error("Error saving beat:", err);
    res.status(500).json({ message: "Failed to save beat.", error: err.message });
  }
});

router.get("/", authenticateToken, async (req, res) => {
  try {
    const result = await db.query(
      "SELECT * FROM beats WHERE user_id = $1 ORDER BY created_at DESC",
      [req.user.id]
    );
    res.json({ beats: result.rows });
  } catch (err) {
    console.error("Error fetching beats:", err);
    res.status(500).json({ message: "Failed to fetch beats." });
  }
});

router.get("/:id", authenticateToken, async (req, res) => {
  const { id } = req.params;
  try {
    const result = await db.query(
      "SELECT * FROM beats WHERE id = $1 AND user_id = $2",
      [id, req.user.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ message: "Beat not found" });
    res.json({ beat: result.rows[0] });
  } catch (err) {
    console.error("Error fetching beat:", err);
    res.status(500).json({ message: "Failed to fetch beat" });
  }
});

module.exports = router;
