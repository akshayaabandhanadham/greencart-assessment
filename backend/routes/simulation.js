const express = require("express");
const router = express.Router();
const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("./database.sqlite");

// Run simulation
router.post("/simulate", (req, res) => {
  const { driversAvailable, startTime, maxHoursPerDay } = req.body;

  if (!driversAvailable || !startTime || !maxHoursPerDay) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  // Example calculation (replace with real logic)
  const totalProfit = Math.random() * 100000;
  const efficiencyScore = 100;
  const onTimeDeliveries = 50;
  const lateDeliveries = 0;

  db.run(
    `INSERT INTO simulation_history 
    (drivers_used, total_profit, efficiency_score, on_time_deliveries, late_deliveries) 
    VALUES (?, ?, ?, ?, ?)`,
    [driversAvailable, totalProfit, efficiencyScore, onTimeDeliveries, lateDeliveries],
    function (err) {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: "Failed to save simulation" });
      }

      res.json({
        drivers_used: driversAvailable,
        total_profit: totalProfit,
        efficiency_score: efficiencyScore,
        on_time_deliveries: onTimeDeliveries,
        late_deliveries: lateDeliveries,
      });
    }
  );
});

// Fetch simulation history
router.get("/simulation-history", (req, res) => {
  db.all(
    "SELECT * FROM simulation_history ORDER BY timestamp DESC",
    [],
    (err, rows) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: "Failed to fetch history" });
      }
      res.json(rows);
    }
  );
});

module.exports = router;
