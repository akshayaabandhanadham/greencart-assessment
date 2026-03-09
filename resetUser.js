// resetUser.js
const bcrypt = require("bcrypt");
const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database("./database.sqlite", (err) => {
  if (err) {
    console.error("❌ Could not open database:", err.message);
    process.exit(1);
  }
  console.log("✅ Connected to database.");
});

(async () => {
  try {
    const hash = await bcrypt.hash("password123", 10);

    db.serialize(() => {
      db.run("DELETE FROM users WHERE email = ?", ["admin@example.com"], (err) => {
        if (err) {
          console.error("❌ Error deleting old user:", err.message);
        } else {
          console.log("✅ Old user deleted (if existed).");
        }
      });

      db.run(
        "INSERT INTO users (email, password) VALUES (?, ?)",
        ["admin@example.com", hash],
        function (err) {
          if (err) {
            console.error("❌ Error inserting user:", err.message);
          } else {
            console.log("✅ New user inserted with email: admin@example.com");
            console.log("   Password: password123");
          }
        }
      );
    });

  } catch (error) {
    console.error("❌ Error creating hash:", error.message);
  } finally {
    db.close((err) => {
      if (err) console.error("❌ Error closing database:", err.message);
      else console.log("✅ Database connection closed.");
    });
  }
})();
