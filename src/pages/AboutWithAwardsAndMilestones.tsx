import React, { useState, useEffect } from 'react';
import Hero from '../components/Hero';
import AwardsSection from '../components/AwardsSection';
import MilestonesSection from '../components/MilestonesSection';
import AccordionJourney from '../components/AccordionJourney';
import { getAbout } from '../lib/api';
import { addWebSocketListener } from '../lib/websocket';

const AboutWithAwardsAndMilestones = () => {
  const [aboutData, setAboutData] = useState({
    title: 'About Rotary Club',
    content: 'Founded in 1985, the Rotary Club of Tiruchirappalli Diamond City has been a beacon of hope and service in the heart of Tamil Nadu. Our club was chartered as part of Rotary International District 3000, bringing together business and professional leaders united by the shared values of fellowship, integrity, diversity, service, and leadership.\n\nOver nearly four decades, we have grown from a small group of dedicated individuals to a vibrant community of 75+ active members. Our journey has been marked by countless acts of service, from local community projects to international humanitarian efforts, always guided by our motto "Service Above Self."',
    mission: 'To provide service to others, promote integrity, and advance world understanding, goodwill, and peace through our fellowship of business, professional, and community leaders.',
    vision: 'Together, we see a world where people unite and take action to create lasting change — across the globe, in our communities, and in ourselves.',
    history: ''
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAboutData();
    
    // Listen for WebSocket events
    const removeListener = addWebSocketListener((data) => {
      if (data.type === 'ABOUT_UPDATED' || data.type === 'about_UPDATED') {
        console.log('Received about update via WebSocket:', data);
        fetchAboutData();
      }
    });
    
    return () => removeListener();
  }, []);

  const fetchAboutData = async () => {
    try {
      const response = await getAbout();
      if (response.data && Object.keys(response.data).length > 0) {
        // Handle main about data
        setAboutData({
          title: response.data.title || aboutData.title,
          content: response.data.content || aboutData.content,
          mission: response.data.mission || aboutData.mission,
          vision: response.data.vision || aboutData.vision,
          history: response.data.history || aboutData.history
        });
      }
    } catch (error) {
      console.error('Failed to fetch about data:', error);
      // Keep the default values set in useState
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Hero 
        title="About Us"
        subtitle="Our Mission • Our Vision"
        backgroundImage="https://images.unsplash.com/photo-1517048676732-d65bc937f952?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80"
      />

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-900"></div>
        </div>
      ) : (
        <>
          {/* Main Content */}
          <section className="py-16 bg-white">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">{aboutData.title}</h2>
              <div className="prose prose-lg mx-auto">
                <div className="whitespace-pre-wrap">{aboutData.content}</div>
              </div>
            </div>
          </section>

          {/* Awards Section */}
          <AwardsSection />

          {/* Mission & Vision */}
          <section className="py-16 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <div className="bg-white p-8 rounded-lg shadow-md">
                  <h3 className="text-2xl font-bold text-blue-900 mb-4">Our Mission</h3>
                  <div className="prose">
                    <div className="whitespace-pre-wrap">{aboutData.mission}</div>
                  </div>
                </div>
                <div className="bg-white p-8 rounded-lg shadow-md">
                  <h3 className="text-2xl font-bold text-blue-900 mb-4">Our Vision</h3>
                  <div className="prose">
                    <div className="whitespace-pre-wrap">{aboutData.vision}</div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Our Journey Section */}
          <section className="py-16 bg-white">
            <AccordionJourney />
          </section>

          {/* Milestones Section */}
          <MilestonesSection />


        </>
      )}
    </div>
  );
};

export default AboutWithAwardsAndMilestones;