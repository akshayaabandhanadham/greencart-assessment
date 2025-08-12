require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");
const sqlite3 = require("sqlite3").verbose();

const authMiddleware = require("./middleware/authMiddleware");

// Import routers
const authRoutes = require("./routes/auth");
const driverRoutes = require("./routes/drivers");
const routeRoutes = require("./routes/routes");
const orderRoutes = require("./routes/orders");
const simulationRoutes = require("./routes/simulation");

const app = express();
const db = new sqlite3.Database("./database.sqlite");

app.use(cors());
app.use(express.json());

// Create tables & default user
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS drivers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      current_shift_hours INTEGER DEFAULT 0
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS routes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      distance_km REAL NOT NULL,
      traffic_level TEXT NOT NULL,
      base_time_min INTEGER NOT NULL
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS orders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      value_rs REAL NOT NULL,
      route_id INTEGER NOT NULL,
      delivery_time TEXT NOT NULL
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS simulation_history (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      drivers_used INTEGER,
      total_profit REAL,
      efficiency_score INTEGER,
      on_time_deliveries INTEGER,
      late_deliveries INTEGER,
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Insert default admin if none exists
  db.get("SELECT COUNT(*) AS count FROM users", async (err, row) => {
    if (!err && row.count === 0) {
      const hashedPassword = await bcrypt.hash("password123", 10);
      db.run(
        "INSERT INTO users (email, password) VALUES (?, ?)",
        ["admin@example.com", hashedPassword],
        (err) => {
          if (!err) {
            console.log("✅ Default user created: admin@example.com / password123");
          }
        }
      );
    }
  });
});

// Routes
app.use("/auth", authRoutes);
app.use("/drivers", authMiddleware, driverRoutes);
app.use("/routes", authMiddleware, routeRoutes);
app.use("/orders", authMiddleware, orderRoutes);
app.use("/", authMiddleware, simulationRoutes); // ✅ Simulation routes with history

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log("✅ Connected to SQLite database");
});
