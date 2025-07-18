import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create a new database file
const dbPath = path.join(__dirname, 'rotary_new.db');
const db = new sqlite3.Database(dbPath);

console.log(`Creating new database at: ${dbPath}`);

// Create all tables
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
    year TEXT DEFAULT '2024',
    status TEXT DEFAULT 'upcoming',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);
  console.log('Events table created');

  // Projects table
  db.run(`CREATE TABLE IF NOT EXISTS projects (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT,
    date TEXT,
    location TEXT,
    image TEXT,
    type TEXT,
    status TEXT,
    impact TEXT,
    beneficiaries TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);
  console.log('Projects table created');

  // Members table
  db.run(`CREATE TABLE IF NOT EXISTS members (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    email TEXT,
    phone TEXT,
    position TEXT,
    image TEXT,
    bio TEXT,
    year TEXT,
    linkedin TEXT,
    twitter TEXT,
    facebook TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);
  console.log('Members table created');

  // Messages table
  db.run(`CREATE TABLE IF NOT EXISTS messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT,
    phone TEXT,
    subject TEXT,
    message TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);
  console.log('Messages table created');

  // Gallery table
  db.run(`CREATE TABLE IF NOT EXISTS gallery (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT,
    image TEXT,
    description TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);
  console.log('Gallery table created');

  // About table
  db.run(`CREATE TABLE IF NOT EXISTS about (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    emoji TEXT,
    type TEXT,
    year INTEGER,
    event TEXT,
    institution TEXT,
    programs TEXT,
    established TEXT,
    description TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);
  console.log('About table created');
  
  // Awards table
  db.run(`CREATE TABLE IF NOT EXISTS awards (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    emoji TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )`);
  console.log('Awards table created');
  
  // Journey table
  db.run(`CREATE TABLE IF NOT EXISTS journey (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    year TEXT NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )`);
  console.log('Journey table created');

  // Insert sample project
  db.run(`INSERT INTO projects (title, description, date, location, image, status, impact, beneficiaries) 
          VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
          ['NB', 'NB Project Description', '2025-07-18', 'Tiruchirappalli', 
           'https://images.unsplash.com/photo-1581244277943-fe4a9c777189', 
           'Ongoing', 'Community benefit', '50+ members'],
          function(err) {
            if (err) {
              console.error('Error inserting sample project:', err.message);
            } else {
              console.log('Sample project added successfully');
            }
          });

  // Insert sample award
  db.run(`INSERT INTO awards (name, emoji) VALUES (?, ?)`,
          ['Medical camps', '🥇'],
          function(err) {
            if (err) {
              console.error('Error inserting sample award:', err.message);
            } else {
              console.log('Sample award added successfully');
            }
          });

  // Insert sample journey item
  db.run(`INSERT INTO journey (year, content) VALUES (?, ?)`,
          ['2020', 'Club founded'],
          function(err) {
            if (err) {
              console.error('Error inserting sample journey item:', err.message);
            } else {
              console.log('Sample journey item added successfully');
            }
          });
});

// Close the database connection when done
setTimeout(() => {
  db.close((err) => {
    if (err) {
      console.error('Error closing database:', err.message);
    } else {
      console.log('Database setup completed successfully');
    }
    process.exit(0);
  });
}, 1000);