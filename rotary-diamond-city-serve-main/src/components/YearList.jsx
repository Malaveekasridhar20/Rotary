import React, { useState, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import { getAbout } from '../lib/api';
import { addWebSocketListener } from '../lib/websocket';

const YearList = () => {
  const [milestones, setMilestones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openYear, setOpenYear] = useState(null);

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
        // Group milestones by year
        const groupedMilestones = {};
        response.data.milestones.forEach(milestone => {
          const year = milestone.year.toString();
          if (!groupedMilestones[year]) {
            groupedMilestones[year] = [];
          }
          groupedMilestones[year].push(milestone.event);
        });
        
        // Convert to array format for rendering
        const milestonesArray = Object.keys(groupedMilestones)
          .sort((a, b) => b - a) // Sort years in descending order
          .map(year => ({
            year,
            events: groupedMilestones[year]
          }));
        
        setMilestones(milestonesArray);
      } else {
        // Fallback to default milestones if API doesn't return any
        setMilestones(defaultMilestones);
      }
    } catch (error) {
      console.error('Failed to fetch milestones:', error);
      setMilestones(defaultMilestones);
    } finally {
      setLoading(false);
    }
  };

  const toggleYear = (year) => {
    setOpenYear(openYear === year ? null : year);
  };

  // Default milestones to show if API fails
  const defaultMilestones = [
    { year: "1985", events: ["Club chartered with 25 founding members", "First community service project initiated"] },
    { year: "1990", events: ["Established partnership with local schools", "Hosted first annual charity fundraiser"] },
    { year: "1995", events: ["Education support program launched for underprivileged children", "First international service project in Nepal"] },
    { year: "2000", events: ["Membership reached 50 active members", "Initiated clean water project in rural areas"] },
    { year: "2005", events: ["Opened the Diamond City Community Center", "Started annual health camp for underserved communities"] },
    { year: "2010", events: ["Established the Rotary Scholarship Fund", "Celebrated 25 years of service"] },
    { year: "2015", events: ["Launched the Clean Water Initiative", "Partnered with 5 international Rotary clubs"] },
    { year: "2020", events: ["Celebrated 35 years of service", "COVID-19 relief efforts across Tiruchirappalli"] },
    { year: "2024", events: ["Completed 100 community service projects", "Expanded scholarship program to support 50 students annually"] }
  ];

  if (loading) {
    return (
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Club Milestones</h2>
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-900"></div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Club Milestones</h2>
        
        <div className="flex flex-col">
          {milestones.map((milestone) => (
            <div key={milestone.year} className="border-b border-gray-200">
              <button
                className="flex w-full justify-between items-center text-left py-6"
                onClick={() => toggleYear(milestone.year)}
              >
                <h3 className="text-2xl font-bold text-blue-900">{milestone.year}</h3>
                <ChevronDown 
                  className={`h-6 w-6 text-blue-900 transition-transform ${
                    openYear === milestone.year ? 'transform rotate-180' : ''
                  }`} 
                />
              </button>
              
              {openYear === milestone.year && (
                <div className="pb-6">
                  <ul className="list-disc pl-8 space-y-2">
                    {milestone.events.map((event, index) => (
                      <li key={index} className="text-gray-700">{event}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default YearList;