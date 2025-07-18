// Mock gallery data storage
let galleryItems = [
  {
    _id: '1',
    title: 'Community Volunteering',
    image: 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
    description: 'Members volunteering at local community center'
  },
  {
    _id: '2',
    title: 'Blood Donation Drive',
    image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
    description: 'Annual blood donation camp 2024'
  },
  {
    _id: '3',
    title: 'Charity Gala Evening',
    image: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
    description: 'Annual fundraising gala event'
  }
];

// Load gallery data from localStorage
const loadFromStorage = () => {
  try {
    const stored = localStorage.getItem('rotaryGalleryItems');
    if (stored) {
      galleryItems = JSON.parse(stored);
      console.log('Loaded', galleryItems.length, 'gallery items from localStorage');
    }
  } catch (error) {
    console.error('Error loading from localStorage:', error);
  }
};

// Load data on module initialization
loadFromStorage();

// Check for updates every 2 seconds
setInterval(loadFromStorage, 2000);

// Mock API functions
export const getGallery = async () => {
  console.log('Getting gallery items from localStorage');
  loadFromStorage(); // Always reload from storage when requested
  return { data: galleryItems };
};