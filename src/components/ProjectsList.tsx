import React, { useEffect, useState } from 'react';
import { getProjects } from '../lib/apiProjects';
import { addWebSocketListener } from '../lib/websocket';

interface Content {
  id: number;
  title: string;
  description: string;
  image_url: string;
  created_at: string;
}

const ProjectsList = () => {
  const [projects, setProjects] = useState<Content[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProjects = async () => {
    try {
      const response = await getProjects();
      setProjects(response.data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching projects:', err);
      setError('Failed to load projects. Please try again later.');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
    
    // Listen for WebSocket events
    const removeListener = addWebSocketListener((data) => {
      if (data.type === 'PROJECT_CREATED' || data.type === 'PROJECT_UPDATED' || data.type === 'PROJECT_DELETED') {
        console.log('Received project update via WebSocket:', data);
        fetchProjects();
      }
    });
    
    return () => removeListener();
  }, []);

  if (loading) return <div className="text-center p-8">Loading projects...</div>;
  if (error) return <div className="text-center p-8 text-red-500">{error}</div>;

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-6">Our Projects</h2>
      
      {projects.length === 0 ? (
        <p className="text-center text-gray-500">No projects available.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <div key={project.id || project._id} className="bg-white rounded-lg shadow-lg overflow-hidden relative">
              <img 
                src={project.image || project.image_url || 'https://placehold.co/600x400?text=No+Image'} 
                alt={project.title} 
                className="w-full h-64 object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://placehold.co/600x400?text=No+Image';
                }}
              />
              <div className="absolute top-4 left-4">
                <span className={`px-3 py-1 rounded text-sm font-medium ${project.status === 'Completed' ? 'bg-gray-500 text-white' : 'bg-green-600 text-white'}`}>
                  {project.status || 'Ongoing'}
                </span>
              </div>
              
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">{project.title}</h3>
                <p className="text-gray-600 text-sm mb-3">{new Date(project.date || project.created_at).getFullYear()}</p>
                <p className="text-pink-500 text-sm mb-4 flex items-center">
                  <span className="mr-1">📍</span> {project.location || 'Tiruchirappalli'}
                </p>
                
                <p className="text-gray-600 text-sm mb-6">{project.description}</p>
                
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Impact:</span>
                    <span className="font-semibold text-blue-600">{project.impact || 'Community benefit'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Beneficiaries:</span>
                    <span className="font-semibold text-blue-600">{project.beneficiaries || '50+ members'}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProjectsList;