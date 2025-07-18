// WebSocket connection for real-time updates
let ws = null;
let reconnectTimer = null;
const listeners = [];

export const connectWebSocket = () => {
  if (ws) return;
  
  try {
    ws = new WebSocket('ws://localhost:3031');
    // Expose WebSocket globally
    window.ws = ws;
    
    ws.onopen = () => {
      console.log('WebSocket connected');
      clearTimeout(reconnectTimer);
    };
    
    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log('WebSocket message received:', data);
        
        // Notify all listeners
        listeners.forEach(listener => listener(data));
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    };
    
    ws.onclose = () => {
      console.log('WebSocket disconnected, reconnecting...');
      ws = null;
      
      // Reconnect after 3 seconds
      reconnectTimer = setTimeout(() => {
        connectWebSocket();
      }, 3000);
    };
    
    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };
  } catch (error) {
    console.error('Failed to connect WebSocket:', error);
    ws = null;
    
    // Try to reconnect after 3 seconds
    reconnectTimer = setTimeout(() => {
      connectWebSocket();
    }, 3000);
  }
};

export const addWebSocketListener = (callback) => {
  listeners.push(callback);
  return () => {
    const index = listeners.indexOf(callback);
    if (index !== -1) {
      listeners.splice(index, 1);
    }
  };
};

// Connect WebSocket when this module is imported
connectWebSocket();