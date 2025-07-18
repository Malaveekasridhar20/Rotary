import axios from 'axios';

const API_URL = 'http://localhost:3031/api/projects';

// Mock data for fallback
const mockProjects = [
  {
    id: '1',
    title: 'Blood Donation Drive',
    description: 'Quarterly blood donation camps to support local hospitals and blood banks.',
    date: '2024-01-15',
    location: 'Community Center, Anna Nagar',
    image: 'https://images.unsplash.com/photo-1615461066841-6116e61058f4?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
    status: 'Ongoing',
    impact: '150+ units collected per camp',
    beneficiaries: '450+ patients helped'
  },
  {
    id: '2',
    title: 'Clean Water Initiative',
    description: 'Installing water purification systems in rural schools and communities.',
    date: '2024-02-20',
    location: 'Rural Schools, Tiruchirappalli District',
    image: 'https://images.unsplash.com/photo-1581244277943-fe4a9c777189?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
    status: 'Ongoing',
    impact: '15 schools equipped',
    beneficiaries: '3000+ students'
  },
  {
    id: '3',
    title: 'Literacy Program',
    description: 'Adult literacy program focusing on basic reading, writing and digital skills.',
    date: '2024-03-10',
    location: 'Rotary Community Hall',
    image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
    status: 'Completed',
    impact: '200+ adults trained',
    beneficiaries: 'Local community members'
  }
];

export const getProjects = async () => {
  try {
    const response = await axios.get(API_URL);
    return response;
  } catch (error) {
    console.log('Using mock projects data');
    return { data: mockProjects };
  }
};

export const createProject = async (data) => {
  try {
    const response = await axios.post(API_URL, data);
    return response;
  } catch (error) {
    console.log('Mock create project');
    const newProject = {
      ...data,
      id: Date.now().toString()
    };
    mockProjects.unshift(newProject);
    return { data: newProject };
  }
};

export const deleteProject = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/${id}`);
    return response;
  } catch (error) {
    console.log('Mock delete project');
    const index = mockProjects.findIndex(project => project.id === id);
    if (index !== -1) {
      mockProjects.splice(index, 1);
    }
    return { data: { id } };
  }
};