const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const db = require('./db');

// Create tables if not exist
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS drivers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    current_shift_hours REAL,
    past_week_hours REAL
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS routes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    distance_km REAL,
    traffic_level TEXT,
    base_time_min INTEGER
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    value_rs REAL,
    route_id INTEGER,
    delivery_time INTEGER
  )`);
});

// Function to import CSV into a table
function importCSV(table, columns, filePath) {
  return new Promise((resolve, reject) => {
    const stmt = db.prepare(
      `INSERT INTO ${table} (${columns.join(',')}) VALUES (${columns.map(() => '?').join(',')})`
    );
    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (row) => {
        const values = columns.map(col => row[col]);
        stmt.run(values);
      })
      .on('end', () => {
        stmt.finalize();
        console.log(`Imported data into ${table}`);
        resolve();
      })
      .on('error', reject);
  });
}

// Main function
async function main() {
  try {
    await importCSV(
      'drivers',
      ['name', 'current_shift_hours', 'past_week_hours'],
      path.join(__dirname, 'data', 'drivers.csv')
    );
    await importCSV(
      'routes',
      ['distance_km', 'traffic_level', 'base_time_min'],
      path.join(__dirname, 'data', 'routes.csv')
    );
    await importCSV(
      'orders',
      ['value_rs', 'route_id', 'delivery_time'],
      path.join(__dirname, 'data', 'orders.csv')
    );
    console.log('All CSVs imported successfully.');
  } catch (err) {
    console.error('Error importing CSVs:', err);
  } finally {
    db.close();
  }
}

main();
