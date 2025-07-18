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

// Awards API
export const getAwards = async () => {
  try {
    const response = await api.get('/awards');
    console.log('Awards fetched:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching awards:', error);
    return [];
  }
};