const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

// Initialize SQLite database
const dbPath = path.join(__dirname, 'rotary.db');

// Check if database exists
if (fs.existsSync(dbPath)) {
  console.log(`Database exists at ${dbPath}`);
  fs.unlinkSync(dbPath);
  console.log('Old database deleted');
}

// Create new database
const db = new sqlite3.Database(dbPath);

// Create tables
db.serialize(() => {
  // Events table
  db.run(`CREATE TABLE IF NOT EXISTS events (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT,
    description TEXT,
    date TEXT,
    time TEXT,
    location TEXT,
    image TEXT,
    category TEXT,
    registration TEXT,
    participants TEXT,
    impact TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  console.log('Events table created');
  
  // Insert sample event
  db.run(
    'INSERT INTO events (title, description, date, time, location, image, category, registration) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
    [
      'Sample Event', 
      'This is a test event', 
      '2024-05-01', 
      '7:00 PM', 
      'Tiruchirappalli', 
      'http://localhost:3002/uploads/image-1752596710594-586994300.jpg', 
      'Fellowship', 
      'Members Only'
    ],
    function(err) {
      if (err) {
        console.error('Error inserting sample event:', err.message);
      } else {
        console.log('Sample event inserted with ID:', this.lastID);
      }
    }
  );
});

// Close database
setTimeout(() => {
  db.close((err) => {
    if (err) {
      console.error(err.message);
    }
    console.log('Database connection closed.');
  });
}, 1000);