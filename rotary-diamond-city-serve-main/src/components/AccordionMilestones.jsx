import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const AccordionMilestones = () => {
  const milestones = [
    { year: 1985, events: ["Club chartered with 25 founding members", "First community service project initiated"] },
    { year: 1990, events: ["Established partnership with local schools", "Hosted first annual charity fundraiser"] },
    { year: 1995, events: ["Education support program launched for underprivileged children", "First international service project in Nepal"] },
    { year: 2000, events: ["Membership reached 50 active members", "Initiated clean water project in rural areas"] },
    { year: 2005, events: ["Opened the Diamond City Community Center", "Started annual health camp for underserved communities"] },
    { year: 2010, events: ["Established the Rotary Scholarship Fund", "Celebrated 25 years of service"] },
    { year: 2015, events: ["Launched the Clean Water Initiative", "Partnered with 5 international Rotary clubs"] },
    { year: 2020, events: ["Celebrated 35 years of service", "COVID-19 relief efforts across Tiruchirappalli"] },
    { year: 2024, events: ["Completed 100 community service projects", "Expanded scholarship program to support 50 students annually"] }
  ];

  const [openYear, setOpenYear] = useState(null);

  const toggleYear = (year) => {
    setOpenYear(openYear === year.toString() ? null : year.toString());
  };

  return (
    <section className="py-16 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Club Milestones</h2>
        
        <div>
          {milestones.map((milestone) => (
            <div key={milestone.year} className="border-b border-gray-200">
              <button
                className="flex w-full justify-between items-center text-left py-6"
                onClick={() => toggleYear(milestone.year)}
              >
                <h3 className="text-2xl font-bold text-blue-900">{milestone.year}</h3>
                <ChevronDown 
                  className={`h-6 w-6 text-blue-900 transition-transform ${
                    openYear === milestone.year.toString() ? 'transform rotate-180' : ''
                  }`} 
                />
              </button>
              
              {openYear === milestone.year.toString() && (
                <div className="pb-6">
                  <ul className="list-disc pl-8 space-y-2">
                    {milestone.events.map((event, index) => (
                      <li key={index} className="text-gray-700">{event}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AccordionMilestones;