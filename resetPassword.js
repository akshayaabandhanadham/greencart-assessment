// resetPassword.js
const bcrypt = require("bcrypt");
const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database("./database.sqlite", (err) => {
  if (err) {
    console.error("❌ Could not open database:", err.message);
    return;
  }
  console.log("✅ Connected to database.");
});

(async () => {
  try {
    const hash = await bcrypt.hash("password123", 10);

    db.run(
      "UPDATE users SET password = ? WHERE email = ?",
      [hash, "admin@example.com"],
      function (err) {
        if (err) {
          console.error("❌ Error updating password:", err.message);
        } else {
          console.log(`✅ Password reset for admin@example.com`);
        }
        db.close((err) => {
          if (err) {
            console.error("❌ Error closing database:", err.message);
          } else {
            console.log("✅ Database connection closed.");
          }
        });
      }
    );
  } catch (error) {
    console.error("❌ Error hashing password:", error.message);
    db.close();
  }
})();
