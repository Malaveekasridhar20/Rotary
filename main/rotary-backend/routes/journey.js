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

// Create journey table if it doesn't exist
db.run(`
  CREATE TABLE IF NOT EXISTS journey (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    year TEXT NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )
`);

// Get all journey items
router.get('/', (req, res) => {
  db.all('SELECT * FROM journey ORDER BY year ASC', (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows.map(row => ({ year: row.year, content: row.content })));
  });
});

// Add a new journey item
router.post('/', (req, res) => {
  const { year, content } = req.body;
  if (!year || !content) {
    return res.status(400).json({ error: 'Year and content are required' });
  }

  db.run(
    'INSERT INTO journey (year, content) VALUES (?, ?)',
    [year, content],
    function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      const newItem = { year, content };
      broadcast({ type: 'JOURNEY_ITEM_CREATED', data: newItem });
      res.status(201).json(newItem);
    }
  );
});

// Update all journey items
router.put('/', (req, res) => {
  const { journey } = req.body;
  if (!Array.isArray(journey)) {
    return res.status(400).json({ error: 'Journey must be an array' });
  }

  // Begin transaction
  db.serialize(() => {
    db.run('BEGIN TRANSACTION');
    
    // Delete all existing journey items
    db.run('DELETE FROM journey', (err) => {
      if (err) {
        db.run('ROLLBACK');
        return res.status(500).json({ error: err.message });
      }
      
      // Insert all new journey items
      const stmt = db.prepare('INSERT INTO journey (year, content) VALUES (?, ?)');
      
      journey.forEach((item) => {
        stmt.run(item.year, item.content);
      });
      
      stmt.finalize();
      
      db.run('COMMIT', (err) => {
        if (err) {
          db.run('ROLLBACK');
          return res.status(500).json({ error: err.message });
        }
        
        broadcast({ type: 'JOURNEY_UPDATED', data: journey });
        res.json({ success: true, message: 'Journey timeline updated successfully' });
      });
    });
  });
});

// Delete a journey item by index
router.delete('/:index', (req, res) => {
  const index = parseInt(req.params.index);
  if (isNaN(index)) {
    return res.status(400).json({ error: 'Invalid index' });
  }

  // Get all journey items
  db.all('SELECT * FROM journey ORDER BY year ASC', (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    
    if (index < 0 || index >= rows.length) {
      return res.status(404).json({ error: 'Journey item not found' });
    }
    
    // Delete the item with the specified ID
    db.run('DELETE FROM journey WHERE id = ?', [rows[index].id], function(err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      
      broadcast({ type: 'JOURNEY_ITEM_DELETED', data: { index } });
      res.json({ success: true, message: 'Journey item deleted successfully' });
    });
  });
});

export default router;