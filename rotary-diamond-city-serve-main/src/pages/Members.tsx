import { useState, useEffect } from 'react';
import { Linkedin, Twitter, Facebook } from 'lucide-react';
import Hero from '../components/Hero';
import Card from '../components/Card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { getMembers } from '../lib/api';
import { addWebSocketListener } from '../lib/websocket';

const Members = () => {
  const [selectedYear, setSelectedYear] = useState('2024-25');
  const [currentMembers, setCurrentMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  const staticMembers = [
    {
      name: 'Dr. Rajesh Kumar',
      designation: 'President',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
      occupation: 'Chief Cardiologist, Apollo Hospital',
      linkedin: 'https://linkedin.com/in/rajeshkumar',
      twitter: 'https://twitter.com/dr_rajesh',
      facebook: 'https://facebook.com/rajesh.kumar',
      isPST: true
    },
    {
      name: 'Mrs. Priya Sharma',
      designation: 'Secretary',
      image: 'https://images.unsplash.com/photo-1494790108755-2616b612b691?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
      occupation: 'Senior Partner, Sharma & Associates Law Firm',
      linkedin: 'https://linkedin.com/in/priyasharma',
      twitter: 'https://twitter.com/priya_sharma_law',
      facebook: 'https://facebook.com/priya.sharma',
      isPST: true
    },
    {
      name: 'Mr. Suresh Babu',
      designation: 'Treasurer',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
      occupation: 'Managing Director, Trichy Steel Industries',
      linkedin: 'https://linkedin.com/in/sureshbabu',
      twitter: 'https://twitter.com/suresh_steel',
      facebook: 'https://facebook.com/suresh.babu',
      isPST: true
    },
    {
      name: 'Dr. Lakshmi Menon',
      designation: 'Vice President',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
      occupation: 'Head of Pediatrics, Government Medical College',
      linkedin: 'https://linkedin.com/in/lakshmimenon',
      twitter: 'https://twitter.com/dr_lakshmi',
      facebook: 'https://facebook.com/lakshmi.menon',
      isPST: false
    },
    {
      name: 'Mr. Arun Krishnan',
      designation: 'Club Service Director',
      image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
      occupation: 'CEO, Krishnan Technologies',
      linkedin: 'https://linkedin.com/in/arunkrishnan',
      twitter: 'https://twitter.com/arun_tech',
      facebook: 'https://facebook.com/arun.krishnan',
      isPST: false
    },
    {
      name: 'Mrs. Kavitha Rajan',
      designation: 'Community Service Director',
      image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
      occupation: 'Principal, St. Mary\'s Higher Secondary School',
      linkedin: 'https://linkedin.com/in/kavitharajan',
      twitter: 'https://twitter.com/kavitha_education',
      facebook: 'https://facebook.com/kavitha.rajan',
      isPST: false
    },
    {
      name: 'Dr. Ramesh Gupta',
      designation: 'Member',
      image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
      occupation: 'Orthopedic Surgeon, JIPMER',
      linkedin: 'https://linkedin.com/in/rameshgupta',
      twitter: 'https://twitter.com/dr_ramesh_ortho',
      facebook: 'https://facebook.com/ramesh.gupta',
      isPST: false
    },
    {
      name: 'Ms. Meera Nair',
      designation: 'Member',
      image: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
      occupation: 'District Collector, Tiruchirappalli',
      linkedin: 'https://linkedin.com/in/meeranair',
      twitter: 'https://twitter.com/meera_collector',
      facebook: 'https://facebook.com/meera.nair',
      isPST: false
    }
  ];

  const fetchMembers = async () => {
    try {
      const response = await getMembers();
      const apiMembers = (response.data || []).map((member: any) => ({
        name: member.name || 'Member Name',
        designation: member.position || 'Member',
        image: member.image || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
        occupation: member.bio || 'Rotary Club Member',
        linkedin: member.linkedin || '#',
        twitter: member.twitter || '#',
        facebook: member.facebook || '#',
        isPST: member.position === 'President' || member.position === 'Secretary' || member.position === 'Treasurer',
        year: member.year || '2024-25'
      }));
      // Filter members by selected year
      const filteredApiMembers = apiMembers.filter((member: any) => member.year === selectedYear);
      setCurrentMembers([...filteredApiMembers, ...staticMembers]);
    } catch (error) {
      console.error('Failed to fetch members:', error);
      setCurrentMembers(staticMembers);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
    
    // Listen for WebSocket events
    const removeListener = addWebSocketListener((data) => {
      if (data.type === 'MEMBER_CREATED' || data.type === 'member_CREATED' || 
          data.type === 'MEMBER_UPDATED' || data.type === 'member_UPDATED' || 
          data.type === 'MEMBER_DELETED' || data.type === 'member_DELETED') {
        console.log('Received member update via WebSocket:', data);
        fetchMembers();
      }
    });
    
    return () => removeListener();
  }, [selectedYear]);

  const pstMembers = currentMembers.filter(member => member.isPST);
  const otherMembers = currentMembers.filter(member => !member.isPST);

  return (
    <div>
      <Hero 
        title="PSTs"
        subtitle="Leadership • Dedication • Service Excellence"
        backgroundImage="https://images.unsplash.com/photo-1559027615-cd4628902d4a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80"
      />

      {/* Year Filter */}
      <section className="py-8 bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center">
            <Select value={selectedYear} onValueChange={setSelectedYear}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Select Year" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2024-25">2024-25</SelectItem>
                <SelectItem value="2023-24">2023-24</SelectItem>
                <SelectItem value="2022-23">2022-23</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </section>

      {/* PST Members - President, Secretary, Treasurer */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            PSTs {selectedYear}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {pstMembers.map((member, index) => (
              <Card key={index} className="text-center overflow-hidden group">
                <div className="relative">
                  <img 
                    src={member.image} 
                    alt={member.name}
                    className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{member.name}</h3>
                  <p className="text-blue-900 font-semibold mb-3">{member.designation}</p>
                  <p className="text-sm text-gray-600 mb-4 leading-tight">{member.occupation}</p>
                  
                  {/* Social Media Links */}
                  <div className="flex justify-center space-x-4">
                    <a 
                      href={member.linkedin} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 transition-colors"
                    >
                      <Linkedin size={20} />
                    </a>
                    <a 
                      href={member.twitter} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-black hover:text-gray-800 transition-colors"
                    >
                      <Twitter size={20} />
                    </a>
                    <a 
                      href={member.facebook} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 transition-colors"
                    >
                      <Facebook size={20} />
                    </a>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Other Members */}
          <h3 className="text-2xl font-bold text-center text-gray-900 mb-8">Other Members</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {otherMembers.map((member, index) => (
              <Card key={index} className="text-center overflow-hidden group">
                <div className="relative">
                  <img 
                    src={member.image} 
                    alt={member.name}
                    className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-bold text-gray-900 mb-1">{member.name}</h3>
                  <p className="text-blue-900 font-semibold mb-2 text-sm">{member.designation}</p>
                  <p className="text-xs text-gray-600 mb-3 leading-tight">{member.occupation}</p>
                  
                  {/* Social Media Links */}
                  <div className="flex justify-center space-x-3">
                    <a 
                      href={member.linkedin} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 transition-colors"
                    >
                      <Linkedin size={16} />
                    </a>
                    <a 
                      href={member.twitter} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-black hover:text-gray-800 transition-colors"
                    >
                      <Twitter size={16} />
                    </a>
                    <a 
                      href={member.facebook} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 transition-colors"
                    >
                      <Facebook size={16} />
                    </a>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Leadership Message */}
      <section className="py-16 bg-blue-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-8">Message from Our PSTs</h2>
          <div className="max-w-3xl mx-auto">
            <blockquote className="text-xl italic mb-6">
              "Together, we are committed to creating positive change in our community. 
              Each member brings unique skills, experience, and passion to our mission of 
              'Service Above Self.' Through collaboration and dedication, we continue to 
              make a meaningful impact in Tiruchirappalli and beyond."
            </blockquote>
            <p className="text-blue-200">
              - Rotary Club of Tiruchirappalli Diamond City PSTs
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Members;