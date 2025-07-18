import express from 'express';
import cors from 'cors';
import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';
import http from 'http';
import { WebSocketServer } from 'ws';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = http.createServer(app);
const wss = new WebSocketServer({ server });

// Enable CORS
app.use(cors({
  origin: ['http://localhost:8080', 'http://localhost:8081', 'http://localhost:5173'],
  credentials: true
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Logging middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

// WebSocket broadcast function
const broadcast = (data) => {
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
    year TEXT DEFAULT '2024',
    status TEXT DEFAULT 'upcoming',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

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
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  // Members table with proper error handling
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
  )`, (err) => {
    if (err) {
      console.error('Error creating members table:', err.message);
    } else {
      console.log('Members table ready');
    }
  });

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

  // Gallery table
  db.run(`CREATE TABLE IF NOT EXISTS gallery (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT,
    image TEXT,
    description TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

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
  
  // Awards table
  db.run(`CREATE TABLE IF NOT EXISTS awards (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    emoji TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )`);
  
  // Journey table
  db.run(`CREATE TABLE IF NOT EXISTS journey (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    year TEXT NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )`);
});

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
  try {
    console.log('Received event data:', req.body);
    
    // Set default values for missing fields
    const title = req.body.title || 'Untitled Event';
    const description = req.body.description || '';
    const date = req.body.date || new Date().toISOString().split('T')[0];
    const time = req.body.time || '7:00 PM';
    const location = req.body.location || 'Tiruchirappalli';
    const image = req.body.image || 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622';
    const category = req.body.category || 'Fellowship';
    const registration = req.body.registration || 'Members Only';
    const participants = req.body.participants || '';
    const impact = req.body.impact || '';
    
    console.log('Processed event data:', { title, date, time, location, image });
    
    db.run(
      'INSERT INTO events (title, description, date, time, location, image, category, registration, participants, impact) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [title, description, date, time, location, image, category, registration, participants, impact],
      function(err) {
        if (err) {
          console.error('Database error:', err.message);
          res.status(500).json({ error: err.message });
          return;
        }
        console.log('✅ Event added successfully:', title);
        const newEvent = { 
          _id: this.lastID.toString(), 
          title, description, date, time, location, image, category, registration, participants, impact 
        };
        broadcast({ type: 'EVENT_CREATED', data: newEvent });
        res.json(newEvent);
      }
    );
  } catch (error) {
    console.error('Error processing event:', error);
    res.status(500).json({ error: error.message || 'Unknown error' });
  }
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

// Projects API
app.get('/api/projects', (req, res) => {
  db.all('SELECT * FROM projects ORDER BY created_at DESC', (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows.map(row => ({ ...row, _id: row.id.toString() })));
  });
});

app.post('/api/projects', (req, res) => {
  const { title, description, date, location, image, type, status } = req.body;
  db.run(
    'INSERT INTO projects (title, description, date, location, image, type, status) VALUES (?, ?, ?, ?, ?, ?, ?)',
    [title, description, date, location, image, type, status],
    function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      const newProject = { _id: this.lastID.toString(), title, description, date, location, image, type, status };
      broadcast({ type: 'PROJECT_CREATED', data: newProject });
      res.json(newProject);
    }
  );
});

app.delete('/api/projects/:id', (req, res) => {
  db.run('DELETE FROM projects WHERE id = ?', [req.params.id], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    broadcast({ type: 'PROJECT_DELETED', data: { id: req.params.id } });
    res.json({ message: 'Project deleted' });
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
  console.log('Adding member:', name);
  
  if (!name) {
    res.status(400).json({ error: 'Name is required' });
    return;
  }
  
  db.run(
    'INSERT INTO members (name, email, phone, position, image, bio) VALUES (?, ?, ?, ?, ?, ?)',
    [name, email || '', phone || '', position || 'Member', image || '', bio || ''],
    function(err) {
      if (err) {
        console.error('Database error:', err.message);
        res.status(500).json({ error: err.message });
        return;
      }
      console.log('✅ Member saved:', name);
      const newMember = { _id: this.lastID.toString(), name, email, phone, position, image, bio };
      broadcast({ type: 'MEMBER_CREATED', data: newMember });
      res.json(newMember);
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

// About API
app.get('/api/about', (req, res) => {
  db.all('SELECT * FROM about ORDER BY created_at DESC', (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows.map(row => ({ ...row, _id: row.id.toString() })));
  });
});

app.post('/api/about', (req, res) => {
  const { name, emoji, type, year, event, institution, programs, established, description } = req.body;
  db.run(
    'INSERT INTO about (name, emoji, type, year, event, institution, programs, established, description) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
    [name, emoji, type, year, event, institution, JSON.stringify(programs), established, description],
    function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      const newItem = { _id: this.lastID.toString(), name, emoji, type, year, event, institution, programs, established, description };
      broadcast({ type: 'ABOUT_CREATED', data: newItem });
      res.json(newItem);
    }
  );
});

app.delete('/api/about/:id', (req, res) => {
  db.run('DELETE FROM about WHERE id = ?', [req.params.id], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    broadcast({ type: 'ABOUT_DELETED', data: { id: req.params.id } });
    res.json({ message: 'About item deleted' });
  });
});

// Awards API
app.get('/api/awards', (req, res) => {
  db.all('SELECT * FROM awards ORDER BY created_at DESC', (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows.map(row => ({ ...row, _id: row.id.toString() })));
  });
});

app.post('/api/awards', (req, res) => {
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

app.put('/api/awards', (req, res) => {
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

app.delete('/api/awards/:id', (req, res) => {
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

// Journey API
app.get('/api/journey', (req, res) => {
  db.all('SELECT * FROM journey ORDER BY year ASC', (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows.map(row => ({ year: row.year, content: row.content })));
  });
});

app.post('/api/journey', (req, res) => {
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

app.put('/api/journey', (req, res) => {
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

app.delete('/api/journey/:index', (req, res) => {
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

// Test endpoint
app.get('/test', (req, res) => {
  res.json({ message: 'Database backend is working!', timestamp: new Date() });
});

// Database viewer endpoint
app.get('/db-status', (req, res) => {
  const queries = [
    'SELECT COUNT(*) as count FROM events',
    'SELECT COUNT(*) as count FROM projects', 
    'SELECT COUNT(*) as count FROM members',
    'SELECT COUNT(*) as count FROM messages',
    'SELECT COUNT(*) as count FROM gallery',
    'SELECT COUNT(*) as count FROM about',
    'SELECT COUNT(*) as count FROM awards',
    'SELECT COUNT(*) as count FROM journey'
  ];
  
  const results = {};
  let completed = 0;
  
  queries.forEach((query, index) => {
    const table = ['events', 'projects', 'members', 'messages', 'gallery', 'about', 'awards', 'journey'][index];
    db.get(query, (err, row) => {
      if (!err) results[table] = row ? row.count : 0;
      completed++;
      if (completed === queries.length) {
        res.json({
          message: 'Database Status',
          timestamp: new Date(),
          tables: results,
          database_file: 'rotary.db'
        });
      }
    });
  });
});

const PORT = 3031;
server.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Complete API server running on port ${PORT}`);
  console.log(`✅ API endpoints available at http://localhost:${PORT}/api/`);
  console.log(`✅ SQLite database: ${dbPath}`);
  console.log(`✅ Test endpoint: http://localhost:${PORT}/test`);
});

// Graceful shutdown
process.on('SIGINT', () => {
  db.close((err) => {
    if (err) {
      console.error(err.message);
    }
    console.log('Database connection closed.');
    process.exit(0);
  });
});