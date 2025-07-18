import React from 'react';

const SimpleMilestones = () => {
  const milestones = [
    { year: 2023, event: "Completed 100 community service projects" },
    { year: 2020, event: "Celebrated 35 years of service" },
    { year: 2015, event: "Launched the Clean Water Initiative" },
    { year: 2010, event: "Established the Rotary Scholarship Fund" },
    { year: 2005, event: "Opened the Diamond City Community Center" },
    { year: 1995, event: "First international service project in Nepal" },
    { year: 1985, event: "Club chartered with 25 founding members" }
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Club Milestones</h2>
        
        <div className="relative max-w-4xl mx-auto">
          {/* Timeline line */}
          <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-blue-900"></div>
          
          <div className="space-y-16">
            {milestones.map((milestone, index) => (
              <div key={index} className="relative">
                {/* Year bubble */}
                <div className="absolute left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-blue-900 text-white flex items-center justify-center font-bold z-10">
                  {milestone.year}
                </div>
                
                {/* Content box - alternate left and right */}
                <div className={`w-5/12 ml-auto ${index % 2 === 0 ? 'mr-auto ml-0' : ''} bg-white p-6 rounded-lg shadow-md`}>
                  <p className="text-gray-800">{milestone.event}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default SimpleMilestones;