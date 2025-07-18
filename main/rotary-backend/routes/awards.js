import express from 'express';
import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';
import { broadcast } from '../index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbPath = path.join(__dirname, '..', 'rotary.db');

const router = express.Router();
const db = new sqlite3.Database(dbPath);

// Create awards table if it doesn't exist
db.run(`
  CREATE TABLE IF NOT EXISTS awards (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    emoji TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )
`);

// Get all awards
router.get('/', (req, res) => {
  db.all('SELECT * FROM awards ORDER BY created_at DESC', (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows.map(row => ({ ...row, _id: row.id.toString() })));
  });
});

// Add a new award
router.post('/', (req, res) => {
  const { name, emoji } = req.body;
  if (!name || !emoji) {
    return res.status(400).json({ error: 'Name and emoji are required' });
  }

  db.run(
    'INSERT INTO awards (name, emoji) VALUES (?, ?)',
    [name, emoji],
    function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      const newAward = { _id: this.lastID.toString(), name, emoji };
      broadcast({ type: 'AWARD_CREATED', data: newAward });
      res.status(201).json(newAward);
    }
  );
});

// Update all awards
router.put('/', (req, res) => {
  const { awards } = req.body;
  if (!Array.isArray(awards)) {
    return res.status(400).json({ error: 'Awards must be an array' });
  }

  // Begin transaction
  db.serialize(() => {
    db.run('BEGIN TRANSACTION');
    
    // Delete all existing awards
    db.run('DELETE FROM awards', (err) => {
      if (err) {
        db.run('ROLLBACK');
        return res.status(500).json({ error: err.message });
      }
      
      // Insert all new awards
      const stmt = db.prepare('INSERT INTO awards (id, name, emoji) VALUES (?, ?, ?)');
      
      awards.forEach((award) => {
        stmt.run(award._id, award.name, award.emoji);
      });
      
      stmt.finalize();
      
      db.run('COMMIT', (err) => {
        if (err) {
          db.run('ROLLBACK');
          return res.status(500).json({ error: err.message });
        }
        
        broadcast({ type: 'AWARDS_UPDATED', data: awards });
        res.json({ success: true, message: 'Awards updated successfully' });
      });
    });
  });
});

// Delete an award
router.delete('/:id', (req, res) => {
  db.run('DELETE FROM awards WHERE id = ?', [req.params.id], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Award not found' });
    }
    broadcast({ type: 'AWARD_DELETED', data: { _id: req.params.id } });
    res.json({ success: true, message: 'Award deleted successfully' });
  });
});

export default router;