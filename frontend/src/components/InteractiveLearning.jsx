import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Gamepad2, Brain, Trophy, Zap, Target, Lightbulb } from 'lucide-react';

const InteractiveLearning = () => {
  const [activeFeature, setActiveFeature] = useState(0);

  const features = [
    {
      icon: Gamepad2,
      title: "Interactive Games",
      description: "Learning through play with educational games that adapt to your child's pace and skill level.",
      color: "from-blue-400 to-blue-600",
      stats: "50+ Games"
    },
    {
      icon: Brain,
      title: "Adaptive Learning",
      description: "AI-powered personalization that adjusts difficulty and content based on individual progress.",
      color: "from-purple-400 to-purple-600",
      stats: "Smart AI"
    },
    {
      icon: Trophy,
      title: "Achievement System",
      description: "Motivating rewards and badges that celebrate milestones and encourage continued learning.",
      color: "from-yellow-400 to-orange-500",
      stats: "100+ Badges"
    },
    {
      icon: Target,
      title: "Goal Tracking",
      description: "Set learning objectives and track progress with detailed analytics for parents and teachers.",
      color: "from-green-400 to-green-600",
      stats: "Progress Reports"
    }
  ];

  const learningMethods = [
    {
      icon: Zap,
      title: "Quick Lessons",
      description: "Bite-sized learning sessions that fit perfectly into busy schedules.",
      image: "⚡"
    },
    {
      icon: Lightbulb,
      title: "Creative Challenges",
      description: "Open-ended projects that spark imagination and critical thinking.",
      image: "💡"
    },
    {
      icon: Brain,
      title: "Memory Games",
      description: "Fun activities designed to improve memory and cognitive skills.",
      image: "🧠"
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-purple-100 text-purple-600 hover:bg-purple-100">Interactive Learning</Badge>
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-800 mb-6">
            Learning Made
            <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent"> Interactive</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Our innovative approach combines technology with proven educational methods 
            to create engaging experiences that keep children motivated and excited to learn.
          </p>
        </div>

        {/* Main Features */}
        <div className="grid lg:grid-cols-2 gap-12 items-center mb-20">
          {/* Left - Feature Cards */}
          <div className="space-y-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              const isActive = activeFeature === index;
              return (
                <Card 
                  key={index}
                  className={`cursor-pointer transition-all duration-300 transform hover:-translate-y-1 border-0 ${
                    isActive 
                      ? 'shadow-2xl scale-105 bg-white' 
                      : 'shadow-md hover:shadow-xl bg-white/80'
                  }`}
                  onClick={() => setActiveFeature(index)}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className={`w-12 h-12 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center flex-shrink-0`}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="text-lg font-bold text-gray-800">{feature.title}</h3>
                          <Badge variant="secondary" className="text-xs">
                            {feature.stats}
                          </Badge>
                        </div>
                        <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Right - Interactive Preview */}
          <div className="relative">
            <div className="bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 rounded-3xl p-8 relative overflow-hidden">
              {/* Background decorations */}
              <div className="absolute top-4 right-4 w-16 h-16 bg-yellow-300 rounded-full opacity-30 animate-pulse"></div>
              <div className="absolute bottom-4 left-4 w-12 h-12 bg-green-300 rounded-full opacity-30 animate-bounce"></div>
              
              {/* Main content area */}
              <div className="relative z-10">
                <div className="text-center mb-6">
                  <div className={`w-20 h-20 bg-gradient-to-br ${features[activeFeature].color} rounded-3xl flex items-center justify-center mx-auto mb-4`}>
                    {React.createElement(features[activeFeature].icon, { className: "w-10 h-10 text-white" })}
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">{features[activeFeature].title}</h3>
                  <p className="text-gray-600">{features[activeFeature].description}</p>
                </div>

                {/* Interactive demo area */}
                <div className="bg-white rounded-2xl p-6 shadow-inner">
                  <div className="grid grid-cols-2 gap-4">
                    {[1,2,3,4].map((item) => (
                      <div key={item} className="h-16 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl animate-pulse"></div>
                    ))}
                  </div>
                  <Button className="w-full mt-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-xl">
                    Try Demo
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Learning Methods */}
        <div className="grid md:grid-cols-3 gap-8">
          {learningMethods.map((method, index) => {
            const Icon = method.icon;
            return (
              <Card key={index} className="group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border-0 shadow-lg bg-white">
                <CardContent className="p-8 text-center">
                  <div className="text-4xl mb-4">{method.image}</div>
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-blue-600 transition-colors duration-300">
                    {method.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {method.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default InteractiveLearning;