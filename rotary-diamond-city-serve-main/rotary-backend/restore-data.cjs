const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, 'rotary.db');
const backupPath = path.join(__dirname, 'data-backup.json');

console.log('🔄 Starting data restore...');

if (!fs.existsSync(backupPath)) {
  console.log('❌ Backup file not found');
  process.exit(1);
}

const backup = JSON.parse(fs.readFileSync(backupPath, 'utf8'));
const db = new sqlite3.Database(dbPath);

console.log('📊 Restoring data...');

// Restore events
if (backup.events && backup.events.length > 0) {
  backup.events.forEach(event => {
    db.run(
      'INSERT INTO events (title, description, date, time, location, image, category, registration, participants, impact) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [event.title, event.description, event.date, event.time, event.location, event.image, event.category, event.registration, event.participants, event.impact],
      function(err) {
        if (!err) console.log(`✅ Restored event: ${event.title}`);
      }
    );
  });
}

// Restore projects
if (backup.projects && backup.projects.length > 0) {
  backup.projects.forEach(project => {
    db.run(
      'INSERT INTO projects (title, description, date, location, image, type, status) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [project.title, project.description, project.date, project.location, project.image, project.type, project.status],
      function(err) {
        if (!err) console.log(`✅ Restored project: ${project.title}`);
      }
    );
  });
}

// Restore members (basic fields only)
if (backup.members && backup.members.length > 0) {
  backup.members.forEach(member => {
    db.run(
      'INSERT INTO members (name, email, phone, position, image, bio) VALUES (?, ?, ?, ?, ?, ?)',
      [member.name, member.email, member.phone, member.position, member.image, member.bio],
      function(err) {
        if (!err) console.log(`✅ Restored member: ${member.name}`);
      }
    );
  });
}

// Restore messages
if (backup.messages && backup.messages.length > 0) {
  backup.messages.forEach(message => {
    db.run(
      'INSERT INTO messages (name, email, phone, subject, message) VALUES (?, ?, ?, ?, ?)',
      [message.name, message.email, message.phone, message.subject, message.message],
      function(err) {
        if (!err) console.log(`✅ Restored message from: ${message.name}`);
      }
    );
  });
}

// Restore gallery
if (backup.gallery && backup.gallery.length > 0) {
  backup.gallery.forEach(item => {
    db.run(
      'INSERT INTO gallery (title, image, description) VALUES (?, ?, ?)',
      [item.title, item.image, item.description],
      function(err) {
        if (!err) console.log(`✅ Restored gallery: ${item.title}`);
      }
    );
  });
}

setTimeout(() => {
  console.log('🎉 Data restore completed!');
  db.close();
  process.exit(0);
}, 2000);