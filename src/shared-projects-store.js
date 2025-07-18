// shared-projects-store.js
import axios from 'axios';

// Cache for projects data
let projectsCache = [];
let lastFetchTime = 0;
const CACHE_TTL = 5000; // 5 seconds

export const getProjectsForWebsite = async () => {
  const now = Date.now();
  
  // If cache is fresh, return it
  if (projectsCache.length > 0 && now - lastFetchTime < CACHE_TTL) {
    return projectsCache;
  }
  
  try {
    // Fetch from API
    const response = await axios.get('http://localhost:3031/api/projects');
    projectsCache = response.data;
    lastFetchTime = now;
    return projectsCache;
  } catch (error) {
    console.error('Error fetching projects:', error);
    // If API fails but we have cache, return it
    if (projectsCache.length > 0) {
      return projectsCache;
    }
    // Otherwise return empty array
    return [];
  }
};