// test-db.cjs
// Simple script to test database connection and retrieve data

const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Initialize SQLite database
const dbPath = path.join(__dirname, 'rotary.db');
console.log(`Testing database connection to: ${dbPath}`);

const db = new sqlite3.Database(dbPath, sqlite3.OPEN_READONLY, (err) => {
  if (err) {
    console.error('❌ Error opening database:', err.message);
    process.exit(1);
  }
  console.log('✅ Connected to the SQLite database');
});

// Test queries
console.log('📊 Testing database queries...');

// Check events table
db.all('SELECT COUNT(*) as count FROM events', (err, rows) => {
  if (err) {
    console.error('❌ Error querying events table:', err.message);
  } else {
    console.log(`✅ Events table: ${rows[0].count} records`);
  }
  
  // Check projects table
  db.all('SELECT COUNT(*) as count FROM projects', (err, rows) => {
    if (err) {
      console.error('❌ Error querying projects table:', err.message);
    } else {
      console.log(`✅ Projects table: ${rows[0].count} records`);
    }
    
    // Check members table
    db.all('SELECT COUNT(*) as count FROM members', (err, rows) => {
      if (err) {
        console.error('❌ Error querying members table:', err.message);
      } else {
        console.log(`✅ Members table: ${rows[0].count} records`);
      }
      
      // Check gallery table
      db.all('SELECT COUNT(*) as count FROM gallery', (err, rows) => {
        if (err) {
          console.error('❌ Error querying gallery table:', err.message);
        } else {
          console.log(`✅ Gallery table: ${rows[0].count} records`);
        }
        
        // Close the database connection
        db.close((err) => {
          if (err) {
            console.error('❌ Error closing database:', err.message);
          } else {
            console.log('✅ Database connection closed');
          }
        });
      });
    });
  });
});