import axios from 'axios';

// Single consistent port for all API calls
const PORT = 3031;
const BASE_URL = `http://localhost:${PORT}/api`;

// Create axios instance with proper configuration
const api = axios.create({
  baseURL: BASE_URL,
  timeout: 3000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Journey API
export const getJourney = async () => {
  try {
    const response = await api.get('/journey');
    console.log('Journey data fetched:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching journey data:', error);
    return [];
  }
};