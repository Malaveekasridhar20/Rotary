/**
 * Local storage based events API for the main website
 */

// Get all events from localStorage
export const getEvents = async () => {
  try {
    const events = JSON.parse(localStorage.getItem('events') || '[]');
    return { data: events };
  } catch (error) {
    console.error('Error getting events from localStorage:', error);
    return { data: [] };
  }
};