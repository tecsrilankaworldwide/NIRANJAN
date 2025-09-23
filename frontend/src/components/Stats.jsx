import React, { useEffect, useState } from 'react';
import { Users, BookOpen, Trophy, Globe } from 'lucide-react';

const Stats = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [counts, setCounts] = useState({
    students: 0,
    courses: 0,
    achievements: 0,
    countries: 0
  });

  const finalCounts = {
    students: 15000,
    courses: 500,
    achievements: 25000,
    countries: 45
  };

  const stats = [
    {
      icon: Users,
      count: counts.students,
      label: 'Happy Students',
      color: 'from-blue-500 to-blue-600',
      suffix: '+'
    },
    {
      icon: BookOpen,
      count: counts.courses,
      label: 'Learning Courses',
      color: 'from-green-500 to-green-600',
      suffix: '+'
    },
    {
      icon: Trophy,
      count: counts.achievements,
      label: 'Achievements Unlocked',
      color: 'from-yellow-500 to-orange-500',
      suffix: '+'
    },
    {
      icon: Globe,
      count: counts.countries,
      label: 'Countries Worldwide',
      color: 'from-purple-500 to-purple-600',
      suffix: ''
    }
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.3 }
    );

    const element = document.getElementById('stats-section');
    if (element) observer.observe(element);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (isVisible) {
      const duration = 2000; // 2 seconds
      const steps = 60;
      const interval = duration / steps;

      const counters = Object.keys(finalCounts).map(key => ({
        key,
        increment: finalCounts[key] / steps,
        current: 0
      }));

      const timer = setInterval(() => {
        const newCounts = {};
        let allComplete = true;

        counters.forEach(counter => {
          counter.current += counter.increment;
          if (counter.current < finalCounts[counter.key]) {
            newCounts[counter.key] = Math.floor(counter.current);
            allComplete = false;
          } else {
            newCounts[counter.key] = finalCounts[counter.key];
          }
        });

        setCounts(newCounts);

        if (allComplete) {
          clearInterval(timer);
        }
      }, interval);

      return () => clearInterval(timer);
    }
  }, [isVisible]);

  return (
    <section id="stats-section" className="py-20 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0">
        <div className="absolute top-10 left-10 w-32 h-32 bg-white bg-opacity-10 rounded-full animate-pulse"></div>
        <div className="absolute bottom-10 right-10 w-24 h-24 bg-white bg-opacity-10 rounded-full animate-bounce"></div>
        <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-white bg-opacity-10 rounded-full animate-ping"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
            Trusted by Families
            <span className="block text-yellow-300">Worldwide</span>
          </h2>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto">
            Join thousands of families who have made learning fun and effective with TecaiKids
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div 
                key={index}
                className="text-center group"
              >
                <div className={`w-20 h-20 bg-gradient-to-br ${stat.color} rounded-3xl flex items-center justify-center mx-auto mb-6 transform group-hover:scale-110 transition-all duration-300 shadow-2xl`}>
                  <Icon className="w-10 h-10 text-white" />
                </div>
                <div className="text-4xl lg:text-5xl font-bold text-white mb-2">
                  {stat.count.toLocaleString()}{stat.suffix}
                </div>
                <div className="text-lg text-blue-100 font-medium">
                  {stat.label}
                </div>
              </div>
            );
          })}
        </div>

        {/* Achievement highlights */}
        <div className="mt-16 grid md:grid-cols-3 gap-8">
          {[
            { title: "Award Winning", description: "Best Educational App 2024" },
            { title: "Parent Approved", description: "98% Parent Satisfaction Rate" },
            { title: "Educator Endorsed", description: "Recommended by 1000+ Teachers" }
          ].map((achievement, index) => (
            <div key={index} className="text-center">
              <div className="w-16 h-16 bg-yellow-400 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Trophy className="w-8 h-8 text-yellow-800" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">{achievement.title}</h3>
              <p className="text-blue-100">{achievement.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Stats;