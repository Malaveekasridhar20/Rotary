const axios = require('axios');

const API_BASE = 'http://localhost:3001/api';

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

async function importData() {
  console.log('🚀 Starting data import...');
  
  try {
    // Import Projects
    console.log('📁 Importing projects...');
    for (const project of projects) {
      await axios.post(`${API_BASE}/projects`, project);
      console.log(`✅ Added project: ${project.title}`);
    }
    
    // Import Events
    console.log('📅 Importing events...');
    for (const event of events) {
      await axios.post(`${API_BASE}/events`, event);
      console.log(`✅ Added event: ${event.title}`);
    }
    
    // Import Gallery
    console.log('🖼️ Importing gallery...');
    for (const item of gallery) {
      await axios.post(`${API_BASE}/gallery`, item);
      console.log(`✅ Added gallery item: ${item.title}`);
    }
    
    // Import Members
    console.log('👥 Importing members...');
    for (const member of members) {
      await axios.post(`${API_BASE}/members`, member);
      console.log(`✅ Added member: ${member.name}`);
    }
    
    console.log('🎉 All data imported successfully!');
    console.log('📊 Summary:');
    console.log(`   - ${projects.length} projects`);
    console.log(`   - ${events.length} events`);
    console.log(`   - ${gallery.length} gallery items`);
    console.log(`   - ${members.length} members`);
    
  } catch (error) {
    console.error('❌ Error importing data:', error.message);
  }
}

// Run the import
importData();