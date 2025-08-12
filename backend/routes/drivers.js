const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("./database.sqlite");

const router = express.Router();

// Get all drivers
router.get("/", (req, res) => {
  db.all("SELECT * FROM drivers", [], (err, rows) => {
    if (err) return res.status(500).json({ message: "Database error" });
    res.json(rows);
  });
});

// Add a driver
router.post("/", (req, res) => {
  const { name } = req.body;
  if (!name) return res.status(400).json({ message: "Name required" });

  db.run("INSERT INTO drivers (name) VALUES (?)", [name], function (err) {
    if (err) return res.status(500).json({ message: "Database error" });
    res.json({ id: this.lastID, name });
  });
});

module.exports = router;
