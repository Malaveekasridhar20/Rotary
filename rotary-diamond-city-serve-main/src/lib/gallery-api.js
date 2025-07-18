import axios from 'axios';

// Use port 3032 for the gallery server
const API_URL = 'http://localhost:3032/api/gallery';

export const getGallery = async () => {
  try {
    const response = await axios.get(API_URL);
    console.log('Gallery data fetched:', response.data.length, 'items');
    return response;
  } catch (error) {
    console.log('Error fetching gallery data:', error.message);
    return { data: [] };
  }
};