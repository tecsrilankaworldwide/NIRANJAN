import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from './ui/button';
import { Play, Star, Users, BookOpen, Sparkles } from 'lucide-react';

const Hero = () => {
  const [isVisible, setIsVisible] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const stats = [
    { icon: Users, value: '10K+', label: 'Happy Students' },
    { icon: BookOpen, value: '500+', label: 'Courses' },
    { icon: Star, value: '4.9', label: 'Rating' }
  ];

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 min-h-screen flex items-center">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-yellow-300 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute top-1/4 -left-10 w-32 h-32 bg-pink-300 rounded-full opacity-20 animate-bounce"></div>
        <div className="absolute bottom-1/4 right-1/4 w-24 h-24 bg-blue-300 rounded-full opacity-20 animate-pulse"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className={`transition-all duration-1000 ${isVisible ? 'translate-x-0 opacity-100' : '-translate-x-10 opacity-0'}`}>
            <div className="flex items-center space-x-2 mb-6">
              <div className="flex items-center space-x-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <span className="text-gray-600 font-medium">Rated #1 by Parents</span>
            </div>

            <h1 className="text-5xl lg:text-6xl font-bold leading-tight mb-6">
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                Fun Learning
              </span>
              <br />
              <span className="text-gray-800">
                Adventures for
              </span>
              <br />
              <span className="bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
                Bright Minds
              </span>
            </h1>

            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Join thousands of children on an exciting educational journey filled with 
              interactive games, creative activities, and personalized learning experiences 
              designed to spark curiosity and build confidence.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <Button 
                onClick={() => navigate('/age-selector')}
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold py-4 px-8 rounded-full text-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                <Play className="w-5 h-5 mr-2" />
                Kids Platform (4-12)
              </Button>
              <Button 
                onClick={() => navigate('/teen-selector')}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-4 px-8 rounded-full text-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                <Play className="w-5 h-5 mr-2" />
                Teen Platform (12-17)
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6">
              {stats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <div key={index} className="text-center">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
                      <Icon className="w-6 h-6 text-blue-600" />
                    </div>
                    <div className="text-2xl font-bold text-gray-800">{stat.value}</div>
                    <div className="text-sm text-gray-600">{stat.label}</div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Content - Animated Illustration */}
          <div className={`relative transition-all duration-1000 delay-300 ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-10 opacity-0'}`}>
            <div className="relative">
              {/* Main illustration container */}
              <div className="relative w-full h-96 bg-gradient-to-br from-yellow-200 via-orange-200 to-pink-200 rounded-3xl p-8 overflow-hidden">
                {/* Floating elements */}
                <div className="absolute top-8 right-8 w-16 h-16 bg-yellow-400 rounded-2xl flex items-center justify-center animate-bounce">
                  <Sparkles className="w-8 h-8 text-white" />
                </div>
                <div className="absolute bottom-8 left-8 w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center animate-pulse">
                  <BookOpen className="w-6 h-6 text-white" />
                </div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center shadow-2xl">
                    <Play className="w-16 h-16 text-blue-600" />
                  </div>
                </div>
              </div>

              {/* Floating cards */}
              <div className="absolute -top-4 -left-4 bg-white rounded-2xl p-4 shadow-xl animate-float">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-green-500 rounded-full"></div>
                  <div>
                    <div className="text-sm font-semibold">Math Games</div>
                    <div className="text-xs text-gray-500">Level 1</div>
                  </div>
                </div>
              </div>

              <div className="absolute -bottom-4 -right-4 bg-white rounded-2xl p-4 shadow-xl animate-float" style={{animationDelay: '0.5s'}}>
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-purple-500 rounded-full"></div>
                  <div>
                    <div className="text-sm font-semibold">Science Fun</div>
                    <div className="text-xs text-gray-500">New!</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>
    </section>
  );
};

export default Hero;