import React, { useState, useEffect } from 'react';
import { getAbout } from '../lib/api';
import { getAwards } from '../lib/api-awards';
import { addWebSocketListener } from '../lib/websocket';
import mockAwards from '../lib/mock-awards';

const AwardsSection = () => {
  const [awards, setAwards] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAwards();
    
    // Listen for WebSocket events
    const removeListener = addWebSocketListener((data) => {
      if (data.type === 'AWARD_CREATED' || data.type === 'award_CREATED' || 
          data.type === 'AWARD_DELETED' || data.type === 'award_DELETED') {
        console.log('Received award update via WebSocket:', data);
        fetchAwards();
      }
    });
    
    return () => removeListener();
  }, []);

  const fetchAwards = async () => {
    try {
      // First try to get awards from dedicated API
      const awardsData = await getAwards();
      if (awardsData && awardsData.length > 0) {
        console.log('Using awards from dedicated API');
        setAwards(awardsData);
      } else {
        // Fallback to about API
        const response = await getAbout();
        if (response.data && response.data.awards && response.data.awards.length > 0) {
          console.log('Using awards from about API');
          setAwards(response.data.awards);
        } else {
          // Use mock data if both APIs don't return awards
          console.log('Using mock awards data');
          setAwards(mockAwards);
        }
      }
    } catch (error) {
      console.error('Failed to fetch awards:', error);
      // Use mock data if API calls fail
      setAwards(mockAwards);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading awards...</div>;
  }

  // Always show awards section, even if no awards from API
  if (awards.length === 0) {
    setAwards(mockAwards);
  }

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          ROTARY CLUB OF TIRUCHIRAPPALLI DIAMOND CITY
        </h2>
        <p className="text-xl text-blue-900 font-semibold mb-12">A Proud Recipient of 17 Prestigious Awards</p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {awards.map((award) => (
            <div key={award._id} className="bg-white rounded-lg p-4 shadow-md hover:shadow-lg transition-shadow">
              <div className="flex items-center space-x-3">
                <span className="text-2xl">
                  {award.emoji || '🏆'}
                </span>
                <span className="font-medium text-gray-900">{award.name}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AwardsSection;