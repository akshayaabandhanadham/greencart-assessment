const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("./database.sqlite");

const router = express.Router();

// Get all routes
router.get("/", (req, res) => {
  db.all("SELECT * FROM routes", [], (err, rows) => {
    if (err) return res.status(500).json({ message: "Database error" });
    res.json(rows);
  });
});

// Add a route
router.post("/", (req, res) => {
  const { distance_km, traffic_level, base_time_min } = req.body;
  if (!distance_km || !traffic_level || !base_time_min) {
    return res.status(400).json({ message: "All fields required" });
  }

  db.run(
    "INSERT INTO routes (distance_km, traffic_level, base_time_min) VALUES (?, ?, ?)",
    [distance_km, traffic_level, base_time_min],
    function (err) {
      if (err) return res.status(500).json({ message: "Database error" });
      res.json({
        id: this.lastID,
        distance_km,
        traffic_level,
        base_time_min
      });
    }
  );
});

module.exports = router;
