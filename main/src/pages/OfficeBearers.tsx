
import { useState } from 'react';
import Hero from '../components/Hero';
import Card from '../components/Card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

const OfficeBearers = () => {
  const [selectedYear, setSelectedYear] = useState('2024-25');

  const officeBearers = {
    '2024-25': [
      {
        name: 'Dr. Rajesh Kumar',
        designation: 'President',
        image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
        email: 'president@rotarytrichy.org',
        phone: '+91 98765 43210'
      },
      {
        name: 'Mrs. Priya Sharma',
        designation: 'Secretary',
        image: 'https://images.unsplash.com/photo-1494790108755-2616b612b691?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
        email: 'secretary@rotarytrichy.org',
        phone: '+91 98765 43211'
      },
      {
        name: 'Mr. Suresh Babu',
        designation: 'Treasurer',
        image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
        email: 'treasurer@rotarytrichy.org',
        phone: '+91 98765 43212'
      },
      {
        name: 'Dr. Lakshmi Menon',
        designation: 'Vice President',
        image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
        email: 'vp@rotarytrichy.org',
        phone: '+91 98765 43213'
      },
      {
        name: 'Mr. Arun Krishnan',
        designation: 'Club Service Director',
        image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
        email: 'clubservice@rotarytrichy.org',
        phone: '+91 98765 43214'
      },
      {
        name: 'Mrs. Kavitha Rajan',
        designation: 'Community Service Director',
        image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
        email: 'community@rotarytrichy.org',
        phone: '+91 98765 43215'
      }
    ],
    '2023-24': [
      {
        name: 'Mr. Venkatesh Iyer',
        designation: 'President',
        image: 'https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
        email: 'venkatesh@rotarytrichy.org',
        phone: '+91 98765 43220'
      },
      {
        name: 'Dr. Meera Nair',
        designation: 'Secretary',
        image: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
        email: 'meera@rotarytrichy.org',
        phone: '+91 98765 43221'
      },
      {
        name: 'Mr. Ramesh Gupta',
        designation: 'Treasurer',
        image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
        email: 'ramesh@rotarytrichy.org',
        phone: '+91 98765 43222'
      }
    ]
  };

  const pastPresidents = [
    { name: 'Dr. K. Srinivasan', term: '2022-23', achievement: 'Launched Digital Education Initiative' },
    { name: 'Mrs. R. Malathi', term: '2021-22', achievement: 'COVID-19 Relief Coordination' },
    { name: 'Mr. S. Gopalakrishnan', term: '2020-21', achievement: 'Rural Healthcare Program' },
    { name: 'Dr. P. Vijayalakshmi', term: '2019-20', achievement: 'Women Empowerment Projects' },
    { name: 'Mr. N. Subramanian', term: '2018-19', achievement: 'Environmental Conservation Drive' },
    { name: 'Mrs. L. Radhika', term: '2017-18', achievement: 'Youth Leadership Development' },
    { name: 'Dr. M. Selvakumar', term: '2016-17', achievement: 'Community Health Camps' },
    { name: 'Mr. V. Anandan', term: '2015-16', achievement: 'Education Infrastructure' }
  ];

  return (
    <div>
      <Hero 
        title="Office Bearers"
        subtitle="Leadership • Dedication • Service Excellence"
        backgroundImage="https://images.unsplash.com/photo-1521791136064-7986c2920216?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80"
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

      {/* Current Office Bearers */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Office Bearers {selectedYear}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {officeBearers[selectedYear as keyof typeof officeBearers]?.map((bearer, index) => (
              <Card key={index} className="text-center overflow-hidden group">
                <div className="relative">
                  <img 
                    src={bearer.image} 
                    alt={bearer.name}
                    className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{bearer.name}</h3>
                  <p className="text-blue-900 font-semibold mb-4">{bearer.designation}</p>
                  <p className="text-sm text-gray-600 mb-2">Term: {selectedYear}</p>
                  <div className="space-y-1 text-sm text-gray-600">
                    <p>📧 {bearer.email}</p>
                    <p>📞 {bearer.phone}</p>
                  </div>
                  <div className="flex justify-center space-x-3 mt-4">
                    <a href="#" className="text-blue-600 hover:text-blue-800">LinkedIn</a>
                    <a href="#" className="text-blue-600 hover:text-blue-800">Email</a>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Past Presidents */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Past Presidents</h2>
          <div className="max-w-4xl mx-auto">
            <Accordion type="single" collapsible>
              {pastPresidents.map((president, index) => (
                <AccordionItem key={index} value={`president-${index}`}>
                  <AccordionTrigger className="text-left">
                    <div className="flex justify-between items-center w-full mr-4">
                      <span className="font-bold text-gray-900">{president.name}</span>
                      <span className="text-blue-900 font-semibold">{president.term}</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="pt-4">
                      <p className="text-gray-600">
                        <strong>Key Achievement:</strong> {president.achievement}
                      </p>
                      <p className="text-sm text-gray-500 mt-2">
                        Led the club with distinction during their presidential term, contributing 
                        significantly to our community service initiatives and organizational growth.
                      </p>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>

      {/* Leadership Message */}
      <section className="py-16 bg-blue-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-8">Message from Leadership</h2>
          <div className="max-w-3xl mx-auto">
            <blockquote className="text-xl italic mb-6">
              "Leadership is not about being in charge. Leadership is about taking care of those in your charge. 
              Our office bearers exemplify this principle through their unwavering commitment to service and 
              their dedication to making a positive impact in our community."
            </blockquote>
            <p className="text-blue-200">
              - Rotary Club of Tiruchirappalli Diamond City Leadership Team
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default OfficeBearers;
