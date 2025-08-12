const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("./database.sqlite");

const router = express.Router();

// Get all orders
router.get("/", (req, res) => {
  db.all("SELECT * FROM orders", [], (err, rows) => {
    if (err) return res.status(500).json({ message: "Database error" });
    res.json(rows);
  });
});

// Add an order
router.post("/", (req, res) => {
  const { value_rs, route_id, delivery_time } = req.body;
  if (!value_rs || !route_id || !delivery_time) {
    return res.status(400).json({ message: "All fields required" });
  }

  db.run(
    "INSERT INTO orders (value_rs, route_id, delivery_time) VALUES (?, ?, ?)",
    [value_rs, route_id, delivery_time],
    function (err) {
      if (err) return res.status(500).json({ message: "Database error" });
      res.json({
        id: this.lastID,
        value_rs,
        route_id,
        delivery_time
      });
    }
  );
});

module.exports = router;
