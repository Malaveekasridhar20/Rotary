import axios from 'axios';

// Single consistent port for all API calls
const PORT = 3031;
const BASE_URL = `http://localhost:${PORT}/api`;

// Create axios instance with proper configuration
const api = axios.create({
  baseURL: BASE_URL,
  timeout: 3000, // Short timeout for faster fallback
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add response interceptor for better error handling
api.interceptors.response.use(
  response => {
    console.log(`API Success: ${response.config.url}`);
    return response;
  },
  error => {
    console.error(`API Error: ${error.config?.url || 'unknown endpoint'} - ${error.message}`);
    // Return empty data instead of rejecting
    if (error.config && error.config.url) {
      if (error.config.url.includes('/events')) {
        return Promise.resolve({ data: [] });
      } else if (error.config.url.includes('/members')) {
        return Promise.resolve({ data: [] });
      } else if (error.config.url.includes('/gallery')) {
        return Promise.resolve({ data: [] });
      } else if (error.config.url.includes('/messages')) {
        return Promise.resolve({ data: [] });
      } else if (error.config.url.includes('/about')) {
        return Promise.resolve({ data: [] });
      }
    }
    return Promise.reject(error);
  }
);

// Events API
export const getEvents = () => api.get('/events');

// Members API
export const getMembers = () => api.get('/members');

// Gallery API
export const getGallery = () => api.get('/gallery');

// Messages API
export const getMessages = () => api.get('/messages');
export const createMessage = (data) => api.post('/messages', data);

// About API
export const getAbout = () => api.get('/about');

// Content API for projects
export const getContent = async () => {
  try {
    // Use axios instead of fetch to maintain consistency
    const response = await api.get('/content');
    return response.data;
  } catch (error) {
    console.error('Failed to fetch content:', error);
    return [];
  }
};

export { api };

// WebSocket connection for live updates
let ws = null;

export const connectWebSocket = (onUpdate) => {
  try {
    if (ws) ws.close();
    ws = new WebSocket(`ws://localhost:${PORT}`);
    
    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        onUpdate(data);
      } catch (error) {
        console.error('WebSocket message parsing error:', error);
      }
    };
    
    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };
    
    return ws;
  } catch (error) {
    console.error('WebSocket connection error:', error);
    return null;
  }
};

export const disconnectWebSocket = () => {
  if (ws) {
    try {
      ws.close();
    } catch (error) {
      console.error('WebSocket disconnect error:', error);
    } finally {
      ws = null;
    }
  }
};


