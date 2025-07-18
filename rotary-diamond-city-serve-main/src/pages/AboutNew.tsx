import React, { useState, useEffect } from 'react';
import Hero from '../components/Hero';
import AwardsSection from '../components/AwardsSection';
import { getAbout } from '../lib/api';
import { addWebSocketListener } from '../lib/websocket';

const AboutNew = () => {
  const [aboutData, setAboutData] = useState({
    title: 'About Rotary Club',
    content: '',
    mission: '',
    vision: '',
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
      setAboutData(response.data);
    } catch (error) {
      console.error('Failed to fetch about data:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Hero 
        title="About Us"
        subtitle="Our Mission • Our Vision • Our History"
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

          {/* History */}
          <section className="py-16 bg-white">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
              <h3 className="text-2xl font-bold text-center text-gray-900 mb-8">Our History</h3>
              <div className="prose prose-lg mx-auto">
                <div className="whitespace-pre-wrap">{aboutData.history}</div>
              </div>
            </div>
          </section>
        </>
      )}
    </div>
  );
};

export default AboutNew;