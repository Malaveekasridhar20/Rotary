import React, { useState, useEffect } from 'react';
import { getAbout } from '../lib/api';
import { addWebSocketListener } from '../lib/websocket';

const MilestonesSection = () => {
  const [milestones, setMilestones] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMilestones();
    
    // Listen for WebSocket events
    const removeListener = addWebSocketListener((data) => {
      if (data.type === 'MILESTONE_CREATED' || data.type === 'milestone_CREATED' || 
          data.type === 'MILESTONE_DELETED' || data.type === 'milestone_DELETED') {
        console.log('Received milestone update via WebSocket:', data);
        fetchMilestones();
      }
    });
    
    return () => removeListener();
  }, []);

  const fetchMilestones = async () => {
    try {
      const response = await getAbout();
      if (response.data && response.data.milestones) {
        setMilestones(response.data.milestones);
      } else {
        setMilestones([]);
      }
    } catch (error) {
      console.error('Failed to fetch milestones:', error);
      setMilestones([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading milestones...</div>;
  }

  if (milestones.length === 0) {
    return null;
  }

  // Sort milestones by year (descending)
  const sortedMilestones = [...milestones].sort((a, b) => b.year - a.year);

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Club Milestones</h2>
        
        <div className="relative max-w-4xl mx-auto">
          {/* Timeline line */}
          <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-blue-900"></div>
          
          <div className="space-y-16">
            {sortedMilestones.map((milestone, index) => (
              <div key={milestone._id || index} className="relative">
                {/* Year bubble */}
                <div className="absolute left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-blue-900 text-white flex items-center justify-center font-bold z-10">
                  {milestone.year}
                </div>
                
                {/* Content box - alternate left and right */}
                <div className={`w-5/12 ml-auto ${index % 2 === 0 ? 'mr-auto ml-0' : ''} bg-white p-6 rounded-lg shadow-md`}>
                  <p className="text-gray-800">{milestone.event}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default MilestonesSection;