
import React, { useEffect, useState } from 'react';
import Hero from '../components/Hero';
import Card from '../components/Card';
import { Badge } from '@/components/ui/badge';
import ProjectsList from '../components/ProjectsList';

const Projects = () => {
  // Using the ProjectsList component which handles its own data fetching

  const staticProjects = [
    {
      title: 'Blood Donation Drive 2024',
      year: '2024',
      status: 'Ongoing',
      location: 'Community Center, Anna Nagar',
      image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
      description: 'Quarterly blood donation camps to support local hospitals and emergency needs.',
      impact: '150+ units collected per camp',
      beneficiaries: '450+ patients helped'
    },
    {
      title: 'Digital Literacy for Seniors',
      year: '2024',
      status: 'Ongoing',
      location: 'Senior Citizens Center, Cantonment',
      image: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
      description: 'Teaching smartphone and internet basics to senior citizens for better connectivity.',
      impact: '200+ seniors trained',
      beneficiaries: '200+ families connected'
    },
    {
      title: 'Clean River Initiative',
      year: '2023',
      status: 'Completed',
      location: 'Kaveri River Banks, Tiruchirappalli',
      image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
      description: 'Community-wide river cleaning and pollution awareness campaign.',
      impact: '5km river stretch cleaned',
      beneficiaries: '50,000+ residents benefited'
    },
    {
      title: 'School Infrastructure Development',
      year: '2023',
      status: 'Completed',
      location: 'Rural Schools, Manachanallur',
      image: 'https://images.unsplash.com/photo-1497486751825-1233686d5d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
      description: 'Renovating classrooms and building computer labs in rural schools.',
      impact: '5 schools renovated',
      beneficiaries: '1,200+ students'
    },
    {
      title: 'Youth Leadership Summit',
      year: '2024',
      status: 'Ongoing',
      location: 'PSG College of Technology',
      image: 'https://images.unsplash.com/photo-1521791136064-7986c2920216?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
      description: 'Annual summit to develop leadership skills among college students.',
      impact: '300+ participants',
      beneficiaries: '300+ future leaders'
    },
    {
      title: 'Community Health Camps',
      year: '2023',
      status: 'Completed',
      location: 'Multiple Villages, Tiruchirappalli District',
      image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
      description: 'Free medical check-ups and treatment in underserved areas.',
      impact: '12 camps conducted',
      beneficiaries: '2,500+ patients treated'
    },
    {
      title: 'Women Empowerment Workshop',
      year: '2024',
      status: 'Ongoing',
      location: 'Holy Cross College',
      image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
      description: 'Skill development and entrepreneurship training for women.',
      impact: '150+ women trained',
      beneficiaries: '150+ families empowered'
    },
    {
      title: 'Tree Plantation Drive',
      year: '2023',
      status: 'Completed',
      location: 'Uyyakondan Thirumalai Hills',
      image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
      description: 'Large-scale tree plantation in urban and rural areas.',
      impact: '5,000+ trees planted',
      beneficiaries: 'Entire community'
    }
  ];

  return (
    <div>
      <Hero 
        title="Our Projects"
        subtitle="Creating Impact • Building Communities • Changing Lives"
        backgroundImage="https://images.unsplash.com/photo-1559027615-cd4628902d4a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80"
      />

      {/* Project Statistics */}
      <section className="py-12 bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-blue-900 mb-2">25+</div>
              <div className="text-gray-600">Projects</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-blue-900 mb-2">50+</div>
              <div className="text-gray-600">Completed</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-blue-900 mb-2">10,000+</div>
              <div className="text-gray-600">People Impacted</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-blue-900 mb-2">₹50L+</div>
              <div className="text-gray-600">Investment</div>
            </div>
          </div>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="py-16 bg-gray-50">
        <ProjectsList />
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-blue-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-6">Join Us in Making a Difference</h2>
          <p className="text-xl text-blue-200 mb-8 max-w-2xl mx-auto">
            Every project starts with a vision and grows through collaboration. 
            Be part of our mission to create positive change in the community.
          </p>
        </div>
      </section>
    </div>
  );
};

export default Projects;
