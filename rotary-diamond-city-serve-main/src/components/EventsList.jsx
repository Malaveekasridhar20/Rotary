import React, { useEffect, useState } from 'react';
import { getEvents } from '../lib/api';
import { useLiveData } from '../hooks/useLiveData';
import { Calendar, Clock, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const EventsList = () => {
  const [events, setEvents] = useLiveData([], 'event');
  const [filter, setFilter] = useState('upcoming'); // 'upcoming', 'past', 'all'

  useEffect(() => {
    getEvents().then(res => setEvents(res.data));
  }, []);

  // Filter events based on date
  const filteredEvents = events.filter(event => {
    const eventDate = new Date(event.date);
    const today = new Date();
    
    if (filter === 'upcoming') {
      return eventDate >= today;
    } else if (filter === 'past') {
      return eventDate < today;
    }
    return true; // 'all'
  });

  // Sort events by date
  const sortedEvents = [...filteredEvents].sort((a, b) => {
    if (filter === 'upcoming') {
      return new Date(a.date) - new Date(b.date); // Ascending for upcoming
    }
    return new Date(b.date) - new Date(a.date); // Descending for past/all
  });

  const formatDate = (dateString) => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-6">Events</h2>
      
      {/* Filter buttons */}
      <div className="flex space-x-2 mb-6">
        <Button 
          variant={filter === 'upcoming' ? 'default' : 'outline'} 
          onClick={() => setFilter('upcoming')}
        >
          Upcoming Events
        </Button>
        <Button 
          variant={filter === 'past' ? 'default' : 'outline'} 
          onClick={() => setFilter('past')}
        >
          Past Events
        </Button>
        <Button 
          variant={filter === 'all' ? 'default' : 'outline'} 
          onClick={() => setFilter('all')}
        >
          All Events
        </Button>
      </div>
      
      {sortedEvents.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No {filter} events found.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedEvents.map(event => (
            <div key={event._id} className="bg-white rounded-lg shadow-md overflow-hidden">
              {event.image && (
                <img 
                  src={event.image} 
                  alt={event.title} 
                  className="w-full h-48 object-cover"
                  onError={(e) => {
                    e.target.src = 'https://placehold.co/600x400?text=Event+Image';
                  }}
                />
              )}
              <div className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-bold text-gray-900">{event.title}</h3>
                  <Badge variant={filter === 'upcoming' ? 'default' : 'outline'}>
                    {filter === 'upcoming' ? 'Upcoming' : 'Past'}
                  </Badge>
                </div>
                
                <div className="flex items-center text-gray-600 mb-2">
                  <Calendar className="h-4 w-4 mr-2" />
                  <span>{formatDate(event.date)}</span>
                </div>
                
                {event.time && (
                  <div className="flex items-center text-gray-600 mb-2">
                    <Clock className="h-4 w-4 mr-2" />
                    <span>{event.time}</span>
                  </div>
                )}
                
                {event.location && (
                  <div className="flex items-center text-gray-600 mb-4">
                    <MapPin className="h-4 w-4 mr-2" />
                    <span>{event.location}</span>
                  </div>
                )}
                
                <p className="text-gray-700 mb-4">{event.description}</p>
                
                {event.category && (
                  <Badge variant="outline" className="mb-4">
                    {event.category}
                  </Badge>
                )}
                
                {filter === 'upcoming' && event.registration && (
                  <Button className="w-full">
                    Register Now
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default EventsList;