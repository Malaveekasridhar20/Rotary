import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { WebSocketServer } from 'ws';
import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';
import awardsRoutes from './routes/awards.js';
import journeyRoutes from './routes/journey.js';

// Get current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = createServer(app);
const wss = new WebSocketServer({ server });

app.use(cors({
  origin: ['http://localhost:8080', 'http://localhost:5173'],
  credentials: true
}));
app.use(express.json());

// Use routes
app.use('/api/awards', awardsRoutes);
app.use('/api/journey', journeyRoutes);

// WebSocket broadcast function
export const broadcast = (data) => {
  wss.clients.forEach(client => {
    if (client.readyState === 1) {
      client.send(JSON.stringify(data));
    }
  });
};

wss.on('connection', (ws) => {
  console.log('Client connected');
  ws.on('close', () => console.log('Client disconnected'));
});

// Initialize SQLite database
const dbPath = path.join(__dirname, 'rotary.db');
const db = new sqlite3.Database(dbPath);

// Create API routes
// Events API
app.get('/api/events', (req, res) => {
  db.all('SELECT * FROM events ORDER BY created_at DESC', (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows.map(row => ({ ...row, _id: row.id.toString() })));
  });
});

app.post('/api/events', (req, res) => {
  const { title, description, date, time, location, image, category, registration } = req.body;
  db.run(
    'INSERT INTO events (title, description, date, time, location, image, category, registration) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
    [title, description, date, time, location, image, category, registration],
    function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      const newEvent = { _id: this.lastID.toString(), title, description, date, time, location, image, category, registration };
      broadcast({ type: 'EVENT_CREATED', data: newEvent });
      res.json(newEvent);
    }
  );
});

app.put('/api/events/:id', (req, res) => {
  const { title, description, date, time, location, image, category, registration } = req.body;
  db.run(
    'UPDATE events SET title = ?, description = ?, date = ?, time = ?, location = ?, image = ?, category = ?, registration = ? WHERE id = ?',
    [title, description, date, time, location, image, category, registration, req.params.id],
    function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      const updatedEvent = { _id: req.params.id, title, description, date, time, location, image, category, registration };
      broadcast({ type: 'EVENT_UPDATED', data: updatedEvent });
      res.json(updatedEvent);
    }
  );
});

app.delete('/api/events/:id', (req, res) => {
  db.run('DELETE FROM events WHERE id = ?', [req.params.id], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    broadcast({ type: 'EVENT_DELETED', data: { id: req.params.id } });
    res.json({ message: 'Event deleted' });
  });
});

// Members API
app.get('/api/members', (req, res) => {
  db.all('SELECT * FROM members ORDER BY created_at DESC', (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows.map(row => ({ ...row, _id: row.id.toString() })));
  });
});

app.post('/api/members', (req, res) => {
  const { name, email, phone, position, image, bio } = req.body;
  db.run(
    'INSERT INTO members (name, email, phone, position, image, bio) VALUES (?, ?, ?, ?, ?, ?)',
    [name, email, phone, position, image, bio],
    function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      const newMember = { _id: this.lastID.toString(), name, email, phone, position, image, bio };
      broadcast({ type: 'MEMBER_CREATED', data: newMember });
      res.json(newMember);
    }
  );
});

app.put('/api/members/:id', (req, res) => {
  const { name, email, phone, position, image, bio } = req.body;
  db.run(
    'UPDATE members SET name = ?, email = ?, phone = ?, position = ?, image = ?, bio = ? WHERE id = ?',
    [name, email, phone, position, image, bio, req.params.id],
    function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      const updatedMember = { _id: req.params.id, name, email, phone, position, image, bio };
      broadcast({ type: 'MEMBER_UPDATED', data: updatedMember });
      res.json(updatedMember);
    }
  );
});

app.delete('/api/members/:id', (req, res) => {
  db.run('DELETE FROM members WHERE id = ?', [req.params.id], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    broadcast({ type: 'MEMBER_DELETED', data: { id: req.params.id } });
    res.json({ message: 'Member deleted' });
  });
});

// Gallery API
app.get('/api/gallery', (req, res) => {
  db.all('SELECT * FROM gallery ORDER BY created_at DESC', (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows.map(row => ({ ...row, _id: row.id.toString() })));
  });
});

app.post('/api/gallery', (req, res) => {
  const { title, image, description } = req.body;
  db.run(
    'INSERT INTO gallery (title, image, description) VALUES (?, ?, ?)',
    [title, image, description],
    function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      const newItem = { _id: this.lastID.toString(), title, image, description };
      broadcast({ type: 'GALLERY_CREATED', data: newItem });
      res.json(newItem);
    }
  );
});

app.put('/api/gallery/:id', (req, res) => {
  const { title, image, description } = req.body;
  db.run(
    'UPDATE gallery SET title = ?, image = ?, description = ? WHERE id = ?',
    [title, image, description, req.params.id],
    function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      const updatedItem = { _id: req.params.id, title, image, description };
      broadcast({ type: 'GALLERY_UPDATED', data: updatedItem });
      res.json(updatedItem);
    }
  );
});

app.delete('/api/gallery/:id', (req, res) => {
  db.run('DELETE FROM gallery WHERE id = ?', [req.params.id], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    broadcast({ type: 'GALLERY_DELETED', data: { id: req.params.id } });
    res.json({ message: 'Gallery item deleted' });
  });
});

// Messages API
app.get('/api/messages', (req, res) => {
  db.all('SELECT * FROM messages ORDER BY created_at DESC', (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows.map(row => ({ ...row, _id: row.id.toString() })));
  });
});

app.post('/api/messages', (req, res) => {
  const { name, email, phone, subject, message } = req.body;
  db.run(
    'INSERT INTO messages (name, email, phone, subject, message) VALUES (?, ?, ?, ?, ?)',
    [name, email, phone, subject, message],
    function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      const newMessage = { _id: this.lastID.toString(), name, email, phone, subject, message };
      broadcast({ type: 'MESSAGE_CREATED', data: newMessage });
      res.json(newMessage);
    }
  );
});

app.delete('/api/messages/:id', (req, res) => {
  db.run('DELETE FROM messages WHERE id = ?', [req.params.id], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    broadcast({ type: 'MESSAGE_DELETED', data: { id: req.params.id } });
    res.json({ message: 'Message deleted' });
  });
});

const PORT = process.env.PORT || 3031;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
