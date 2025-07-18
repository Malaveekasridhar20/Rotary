import axios from 'axios';

const API_URL = 'http://localhost:3031/api/gallery';

export const getGallery = async () => {
  try {
    const response = await axios.get(API_URL);
    // Data fetched successfully
    return response;
  } catch (error) {
    console.log('Error fetching gallery data:', error.message);
    return { data: [] };
  }
};