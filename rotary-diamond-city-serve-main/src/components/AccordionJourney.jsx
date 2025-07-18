import React, { useState, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import { getJourney } from '../lib/api-journey';
import { addWebSocketListener } from '../lib/websocket';

const timelineData = [
  {
    year: '1985',
    content: 'Rotary Club of Tiruchirappalli Diamond City was chartered'
  },
  {
    year: '1990',
    content: 'First major community service project launched'
  },
  {
    year: '1995',
    content: 'Expanded membership to 25 active members'
  },
  {
    year: '2000',
    content: 'Initiated the first international collaboration project'
  },
  {
    year: '2005',
    content: 'Established scholarship program for underprivileged students'
  },
  {
    year: '2010',
    content: 'Celebrated 25 years of service with grand silver jubilee'
  },
  {
    year: '2015',
    content: 'Launched digital transformation initiative'
  },
  {
    year: '2020',
    content: 'Adapted to pandemic challenges with virtual meetings and COVID relief efforts'
  },
  {
    year: '2024',
    content: 'Reached milestone of 75+ active members and expanded service projects'
  }
];

const AccordionJourney = () => {
  const [openItem, setOpenItem] = useState(null);
  const [journeyData, setJourneyData] = useState(timelineData);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchJourney();
    
    // Listen for WebSocket events
    const removeListener = addWebSocketListener((data) => {
      if (data.type === 'JOURNEY_ITEM_CREATED' || 
          data.type === 'JOURNEY_UPDATED' || 
          data.type === 'JOURNEY_ITEM_DELETED') {
        console.log('Received journey update via WebSocket:', data);
        fetchJourney();
      }
    });
    
    return () => removeListener();
  }, []);

  const fetchJourney = async () => {
    try {
      const data = await getJourney();
      if (data && data.length > 0) {
        console.log('Using journey data from API:', data);
        setJourneyData(data);
      } else {
        console.log('Using default journey data');
        setJourneyData(timelineData);
      }
    } catch (error) {
      console.error('Failed to fetch journey data:', error);
      setJourneyData(timelineData);
    } finally {
      setLoading(false);
    }
  };

  const toggleItem = (index) => {
    setOpenItem(openItem === index ? null : index);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">Our Journey</h2>
      
      {loading ? (
        <div className="text-center py-8">Loading journey data...</div>
      ) : (
        <div className="space-y-0">
          {journeyData.map((item, index) => (
          <div key={index} className="border-b border-gray-200">
            <button
              onClick={() => toggleItem(index)}
              className="flex justify-between items-center w-full py-4 px-4 text-left focus:outline-none"
            >
              <span className="text-xl font-medium text-blue-900">{item.year}</span>
              <ChevronDown 
                className={`h-5 w-5 text-gray-500 transition-transform ${openItem === index ? 'transform rotate-180' : ''}`} 
              />
            </button>
            
            {openItem === index && (
              <div className="pb-4 px-4">
                <p className="text-gray-700">{item.content}</p>
              </div>
            )}
          </div>
        ))}
      </div>
      )}
    </div>
  );
};

export default AccordionJourney;