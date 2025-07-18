// setup-database.cjs
// This script will create the database schema and import sample data

const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Initialize SQLite database
const dbPath = path.join(__dirname, 'rotary.db');
const db = new sqlite3.Database(dbPath);

console.log('🔧 Creating database schema...');

// Create tables
db.serialize(() => {
  // Events table
  db.run(`CREATE TABLE IF NOT EXISTS events (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
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
});

// Static Projects Data
const projects = [
  {
    title: 'Blood Donation Drive 2024',
    description: 'Quarterly blood donation camps to support local hospitals and emergency needs.',
    date: '2024-03-15',
    location: 'Community Center, Anna Nagar',
    image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
    type: 'Community Service',
    status: 'active'
  },
  {
    title: 'Digital Literacy for Seniors',
    description: 'Teaching smartphone and internet basics to senior citizens for better connectivity.',
    date: '2024-04-20',
    location: 'Senior Citizens Center, Cantonment',
    image: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
    type: 'Education',
    status: 'active'
  },
  {
    title: 'Clean River Initiative',
    description: 'Community-wide river cleaning and pollution awareness campaign.',
    date: '2023-12-10',
    location: 'Kaveri River Banks, Tiruchirappalli',
    image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
    type: 'Environmental',
    status: 'completed'
  },
  {
    title: 'School Infrastructure Development',
    description: 'Renovating classrooms and building computer labs in rural schools.',
    date: '2023-11-15',
    location: 'Rural Schools, Manachanallur',
    image: 'https://images.unsplash.com/photo-1497486751825-1233686d5d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
    type: 'Education',
    status: 'completed'
  }
];

// Static Events Data
const events = [
  {
    title: 'Annual Rotary Charity Gala',
    description: 'Exclusive fundraising event for Rotary members and distinguished guests.',
    date: '2024-04-15',
    time: '7:00 PM',
    location: 'Grand Hotel, Tiruchirappalli',
    image: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
    category: 'Fundraising',
    registration: 'Members Only'
  },
  {
    title: 'Rotary Leadership Seminar',
    description: 'Advanced leadership training exclusively for Rotary club members.',
    date: '2024-05-05',
    time: '10:00 AM',
    location: 'Rotary Hall, Anna Nagar',
    image: 'https://images.unsplash.com/photo-1521791136064-7986c2920216?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
    category: 'Education',
    registration: 'Members Only'
  },
  {
    title: 'Monthly Fellowship Meeting',
    description: 'Regular fellowship meeting for all Rotary club members.',
    date: '2024-04-25',
    time: '6:30 PM',
    location: 'Hotel Sangam',
    image: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
    category: 'Fellowship',
    registration: 'Members Only'
  }
];

// Static Gallery Data
const gallery = [
  {
    title: 'Community Volunteering',
    image: 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
    description: 'Members volunteering at local community center'
  },
  {
    title: 'Blood Donation Drive',
    image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
    description: 'Annual blood donation camp 2024'
  },
  {
    title: 'Charity Gala Evening',
    image: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
    description: 'Annual fundraising gala event'
  },
  {
    title: 'School Visit Program',
    image: 'https://images.unsplash.com/photo-1497486751825-1233686d5d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
    description: 'Educational support program in rural schools'
  }
];

// Static Members Data
const members = [
  {
    name: 'Dr. Rajesh Kumar',
    email: 'rajesh@rotarytrichy.org',
    phone: '+91 98765 43210',
    position: 'President',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
    bio: 'Chief Cardiologist, Apollo Hospital'
  },
  {
    name: 'Mrs. Priya Sharma',
    email: 'priya@rotarytrichy.org',
    phone: '+91 98765 43211',
    position: 'Secretary',
    image: 'https://images.unsplash.com/photo-1494790108755-2616b612b691?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
    bio: 'Senior Partner, Sharma & Associates Law Firm'
  },
  {
    name: 'Mr. Suresh Babu',
    email: 'suresh@rotarytrichy.org',
    phone: '+91 98765 43212',
    position: 'Treasurer',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
    bio: 'Managing Director, Trichy Steel Industries'
  },
  {
    name: 'Dr. Lakshmi Menon',
    email: 'lakshmi@rotarytrichy.org',
    phone: '+91 98765 43213',
    position: 'Vice President',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
    bio: 'Head of Pediatrics, Government Medical College'
  }
];

// Import data directly to the database
console.log('📥 Importing sample data...');

// Import Projects
console.log('📁 Importing projects...');
projects.forEach((project, index) => {
  db.run(
    'INSERT INTO projects (title, description, date, location, image, type, status) VALUES (?, ?, ?, ?, ?, ?, ?)',
    [project.title, project.description, project.date, project.location, project.image, project.type, project.status],
    function(err) {
      if (err) {
        console.error(`❌ Error adding project ${project.title}:`, err.message);
      } else {
        console.log(`✅ Added project: ${project.title}`);
      }
      
      // Close database when all projects are imported
      if (index === projects.length - 1) {
        importEvents();
      }
    }
  );
});

// Import Events
function importEvents() {
  console.log('📅 Importing events...');
  events.forEach((event, index) => {
    db.run(
      'INSERT INTO events (title, description, date, time, location, image, category, registration) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [event.title, event.description, event.date, event.time, event.location, event.image, event.category, event.registration],
      function(err) {
        if (err) {
          console.error(`❌ Error adding event ${event.title}:`, err.message);
        } else {
          console.log(`✅ Added event: ${event.title}`);
        }
        
        // Import gallery when all events are imported
        if (index === events.length - 1) {
          importGallery();
        }
      }
    );
  });
}

// Import Gallery
function importGallery() {
  console.log('🖼️ Importing gallery...');
  gallery.forEach((item, index) => {
    db.run(
      'INSERT INTO gallery (title, image, description) VALUES (?, ?, ?)',
      [item.title, item.image, item.description],
      function(err) {
        if (err) {
          console.error(`❌ Error adding gallery item ${item.title}:`, err.message);
        } else {
          console.log(`✅ Added gallery item: ${item.title}`);
        }
        
        // Import members when all gallery items are imported
        if (index === gallery.length - 1) {
          importMembers();
        }
      }
    );
  });
}

// Import Members
function importMembers() {
  console.log('👥 Importing members...');
  members.forEach((member, index) => {
    db.run(
      'INSERT INTO members (name, email, phone, position, image, bio) VALUES (?, ?, ?, ?, ?, ?)',
      [member.name, member.email, member.phone, member.position, member.image, member.bio],
      function(err) {
        if (err) {
          console.error(`❌ Error adding member ${member.name}:`, err.message);
        } else {
          console.log(`✅ Added member: ${member.name}`);
        }
        
        // Close database when all members are imported
        if (index === members.length - 1) {
          console.log('🎉 All data imported successfully!');
          console.log('📊 Summary:');
          console.log(`   - ${projects.length} projects`);
          console.log(`   - ${events.length} events`);
          console.log(`   - ${gallery.length} gallery items`);
          console.log(`   - ${members.length} members`);
          
          // Close the database connection
          db.close((err) => {
            if (err) {
              console.error('Error closing database:', err.message);
            } else {
              console.log('✅ Database setup complete and connection closed.');
              console.log('✅ You can now start the server with: node database-server.cjs');
            }
          });
        }
      }
    );
  });
}