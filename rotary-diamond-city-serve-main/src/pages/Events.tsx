
import React, { useEffect, useState } from 'react';
import Hero from '../components/Hero';
import Card from '../components/Card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { getEvents, connectWebSocket, disconnectWebSocket } from '../lib/api';

// Add console logs for debugging
console.log('Events component loaded');

// Add console logs for debugging
console.log('Events component loaded');

const Events = () => {
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [completedEvents, setCompletedEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await getEvents();
        const apiEvents = (response.data || []).map((event: any) => ({
          title: event.title || 'Untitled Event',
          date: event.date || new Date().toISOString().split('T')[0],
          time: event.time || '6:00 PM',
          location: event.location || 'Tiruchirappalli',
          image: event.image || 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
          description: event.description || 'Rotary club event.',
          category: event.category || 'Fellowship',
          registration: event.registration || 'Members Only',
          participants: event.participants || '50+ members',
          impact: event.impact || 'Community benefit'
        }));
        
        // Separate upcoming and completed events based on date
        const today = new Date();
        const upcoming = apiEvents.filter((event: any) => new Date(event.date) >= today);
        const completed = apiEvents.filter((event: any) => new Date(event.date) < today);
        
        setUpcomingEvents(upcoming.length > 0 ? upcoming : staticUpcomingEvents);
        setCompletedEvents(completed.length > 0 ? completed : staticCompletedEvents);
      } catch (error) {
        console.error('Failed to fetch events:', error);
        // Fallback to static data if API fails
        setUpcomingEvents(staticUpcomingEvents);
        setCompletedEvents(staticCompletedEvents);
      } finally {
        setLoading(false);
      }
    };
    
    fetchEvents();
    
    // Set up WebSocket for real-time updates
    let ws;
    try {
      ws = new WebSocket('ws://localhost:3031');
      ws.onopen = () => console.log('WebSocket connected');
      ws.onmessage = (event) => {
        console.log('WebSocket message received:', event.data);
        const data = JSON.parse(event.data);
        console.log('Parsed data:', data);
        if (data.type === 'EVENT_CREATED') {
          console.log('Refreshing events...');
          fetchEvents(); // Refresh events when new event is created
        }
      };
      ws.onerror = (error) => console.log('WebSocket error:', error);
    } catch (error) {
      console.log('WebSocket connection failed:', error);
    }
    
    return () => {
      if (ws) ws.close();
    };
  }, []);

  const staticUpcomingEvents = [
    {
      title: 'Annual Rotary Charity Gala',
      date: '2024-04-15',
      time: '7:00 PM',
      location: 'Grand Hotel, Tiruchirappalli',
      image: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
      description: 'Exclusive fundraising event for Rotary members and distinguished guests.',
      category: 'Fundraising',
      registration: 'Members Only'
    },
    {
      title: 'Rotary Leadership Seminar',
      date: '2024-05-05',
      time: '10:00 AM',
      location: 'Rotary Hall, Anna Nagar',
      image: 'https://images.unsplash.com/photo-1521791136064-7986c2920216?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
      description: 'Advanced leadership training exclusively for Rotary club members.',
      category: 'Education',
      registration: 'Members Only'
    },
    {
      title: 'Monthly Fellowship Meeting',
      date: '2024-04-25',
      time: '6:30 PM',
      location: 'Hotel Sangam',
      image: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
      description: 'Regular fellowship meeting for all Rotary club members.',
      category: 'Fellowship',
      registration: 'Members Only'
    }
  ];

  const staticCompletedEvents = [
    {
      title: 'Rotary District Conference 2024',
      date: '2024-03-10',
      location: 'Coimbatore Convention Center',
      image: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
      description: 'Annual district-wide conference with Rotary clubs from across Tamil Nadu.',
      category: 'Conference',
      participants: '500+ Rotarians',
      impact: 'Network strengthening achieved'
    },
    {
      title: 'Rotary Youth Exchange Program',
      date: '2024-02-25',
      location: 'Club Hall',
      image: 'https://images.unsplash.com/photo-1521791136064-7986c2920216?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
      description: 'Orientation for young Rotarians participating in international exchange.',
      category: 'Youth',
      participants: '25+ youth',
      impact: 'International exposure provided'
    },
    {
      title: 'Rotary Foundation Dinner',
      date: '2024-02-15',
      location: 'Grand Hotel',
      image: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
      description: 'Fundraising dinner exclusively for Rotary members and donors.',
      category: 'Fundraising',
      participants: '100+ members',
      impact: '₹5 lakh raised for Foundation'
    },
    {
      title: 'Rotary Installation Ceremony',
      date: '2024-01-28',
      location: 'Club Hall',
      image: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
      description: 'Installation of new office bearers for the year 2024-25.',
      category: 'Ceremony',
      participants: '80+ members',
      impact: 'Leadership transition completed'
    },
    {
      title: 'Rotary Member Orientation',
      date: '2024-01-15',
      location: 'Club Hall',
      image: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
      description: 'Comprehensive orientation program for new Rotary members.',
      category: 'Orientation',
      participants: '15+ new members',
      impact: 'Member integration achieved'
    },
    {
      title: 'Rotary Fellowship Night',
      date: '2024-01-07',
      location: 'Hotel Sangam',
      image: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
      description: 'New Year fellowship gathering with Rotary members and families.',
      category: 'Fellowship',
      participants: '80+ members',
      impact: 'Community bonding strengthened'
    }
  ];

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      'Fellowship': 'bg-yellow-100 text-yellow-800',
      'Education': 'bg-blue-100 text-blue-800',
      'Conference': 'bg-purple-100 text-purple-800',
      'Youth': 'bg-green-100 text-green-800',
      'Fundraising': 'bg-orange-100 text-orange-800',
      'Ceremony': 'bg-red-100 text-red-800',
      'Orientation': 'bg-indigo-100 text-indigo-800'
    };
    return colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div>
      <Hero 
        title="Rotary Events"
        subtitle="Members Only • Fellowship • Leadership • Service"
        backgroundImage="https://images.unsplash.com/photo-1511795409834-ef04bbd61622?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80"
      />

      {/* Upcoming Events */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Upcoming Rotary Events</h2>
          <div className="space-y-8">
            {upcomingEvents.map((event, index) => (
              <Card key={index} className="overflow-hidden">
                <div className="md:flex">
                  <div className="md:w-1/3">
                    <img 
                      src={event.image} 
                      alt={event.title}
                      className="w-full h-64 md:h-full object-cover"
                    />
                  </div>
                  <div className="md:w-2/3 p-8">
                    <div className="flex items-center justify-between mb-4">
                      <Badge className={getCategoryColor(event.category)}>
                        {event.category}
                      </Badge>
                      <Badge variant="outline" className="border-red-500 text-red-700">
                        {event.registration}
                      </Badge>
                    </div>
                    
                    <h3 className="text-2xl font-bold text-gray-900 mb-3">{event.title}</h3>
                    
                    <div className="space-y-2 mb-4 text-gray-600">
                      <p>📅 {formatDate(event.date)}</p>
                      <p>🕒 {event.time}</p>
                      <p>📍 {event.location}</p>
                    </div>
                    
                    <p className="text-gray-600 mb-6">{event.description}</p>
                    
                    <div className="flex space-x-4">
                      <Button className="bg-blue-900 hover:bg-blue-800">
                        Register Now
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Completed Events */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Recent Rotary Events</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {completedEvents.map((event, index) => (
              <Card key={index} className="overflow-hidden">
                <img 
                  src={event.image} 
                  alt={event.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <Badge className={`${getCategoryColor(event.category)} mb-3`}>
                    {event.category}
                  </Badge>
                  
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{event.title}</h3>
                  <p className="text-sm text-gray-500 mb-3">{formatDate(event.date)}</p>
                  <p className="text-sm text-gray-600 mb-3">📍 {event.location}</p>
                  <p className="text-gray-600 mb-4">{event.description}</p>
                  
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Participants:</span>
                      <span className="font-semibold text-blue-900">{event.participants}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Impact:</span>
                      <span className="font-semibold text-blue-900">{event.impact}</span>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Calendar View */}
      <section className="py-16 bg-white text-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Event Calendar</h2>
          <p className="text-lg text-gray-600 mb-8">
            View all Rotary events in calendar format with R badges for easy identification.
          </p>
          <Button className="bg-blue-900 hover:bg-blue-800 text-white px-8 py-3 text-lg">
            View Calendar
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Events;
