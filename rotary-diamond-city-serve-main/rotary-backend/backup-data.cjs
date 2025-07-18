const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, 'rotary.db');
const backupPath = path.join(__dirname, 'data-backup.json');

console.log('🔄 Starting database backup...');

if (!fs.existsSync(dbPath)) {
  console.log('❌ Database file not found');
  process.exit(1);
}

const db = new sqlite3.Database(dbPath);
const backup = {};

const tables = ['events', 'projects', 'members', 'messages', 'gallery'];

let completed = 0;

tables.forEach(table => {
  db.all(`SELECT * FROM ${table}`, (err, rows) => {
    if (err) {
      console.log(`⚠️ Error reading ${table}:`, err.message);
      backup[table] = [];
    } else {
      backup[table] = rows || [];
      console.log(`✅ Backed up ${table}: ${rows ? rows.length : 0} records`);
    }
    
    completed++;
    if (completed === tables.length) {
      // Save backup
      fs.writeFileSync(backupPath, JSON.stringify(backup, null, 2));
      console.log('💾 Backup saved to data-backup.json');
      console.log('📊 Summary:');
      tables.forEach(table => {
        console.log(`   - ${table}: ${backup[table].length} records`);
      });
      
      db.close();
      process.exit(0);
    }
  });
});

setTimeout(() => {
  console.log('⏰ Backup timeout - closing database');
  db.close();
  process.exit(1);
}, 5000);