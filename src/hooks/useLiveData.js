import { useState, useEffect } from 'react';
import { connectWebSocket, disconnectWebSocket } from '../lib/api';

export const useLiveData = (initialData = [], dataType) => {
  const [data, setData] = useState(initialData);
  const [error, setError] = useState(null);

  useEffect(() => {
    const handleUpdate = (update) => {
      try {
        if (!update || !update.type) return;
        
        const { type, data: updateData } = update;
        
        switch (type) {
          case `${dataType.toUpperCase()}_CREATED`:
            setData(prev => [...prev, updateData]);
            break;
          case `${dataType.toUpperCase()}_UPDATED`:
            setData(prev => prev.map(item => 
              item._id === updateData._id ? updateData : item
            ));
            break;
          case `${dataType.toUpperCase()}_DELETED`:
            setData(prev => prev.filter(item => item._id !== updateData.id));
            break;
        }
      } catch (err) {
        console.error('Error handling WebSocket update:', err);
        setError(err);
      }
    };

    try {
      // WebSocket connection is now optional
      connectWebSocket(handleUpdate);
    } catch (err) {
      console.error('Error connecting to WebSocket:', err);
      // Don't set error here as WebSocket is optional
    }

    return () => {
      try {
        disconnectWebSocket();
      } catch (err) {
        console.error('Error disconnecting WebSocket:', err);
      }
    };
  }, [dataType]);

  return [data, setData, error];
};