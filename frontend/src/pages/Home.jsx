import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import Hero from '../components/Hero';
import InteractiveLearning from '../components/InteractiveLearning';
import CourseCards from '../components/CourseCards';

const Home = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <Hero />
      
      {/* Unified Age Levels Section */}
      <section className="py-16 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white">
              One Platform, All Ages
            </Badge>
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-800 mb-6">
              Complete Learning Journey
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> Ages 4-18</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our unified TecaiKids platform grows with your child, providing age-appropriate 
              content from preschool basics to advanced technology skills.
            </p>
          </div>

          {/* Age Level Cards */}
          <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-6 mb-12">
            {[
              {
                level: "4-6",
                name: "Little Learners",
                emoji: "🌟",
                color: "from-yellow-400 to-orange-500",
                skills: ["Numbers & Letters", "Colors & Shapes", "Basic Logic"],
                description: "Fun fundamentals for early learners"
              },
              {
                level: "7-9", 
                name: "Young Explorers",
                emoji: "🚀",
                color: "from-blue-500 to-purple-600",
                skills: ["Math & Reading", "Science Basics", "Creative Projects"],
                description: "Building strong foundations"
              },
              {
                level: "10-12",
                name: "Smart Kids",
                emoji: "⚡",
                color: "from-purple-600 to-pink-600",
                skills: ["Advanced Math", "Coding Intro", "STEM Projects"],
                description: "Advanced concepts & challenges"
              },
              {
                level: "13-15",
                name: "Tech Teens",
                emoji: "💻", 
                color: "from-indigo-600 to-blue-600",
                skills: ["Programming", "Web Dev", "Digital Skills"],
                description: "Technology & programming focus"
              },
              {
                level: "16-18",
                name: "Future Leaders",
                emoji: "🎯",
                color: "from-green-600 to-teal-600", 
                skills: ["AI & ML", "App Development", "Leadership"],
                description: "Advanced tech & career prep"
              }
            ].map((ageGroup) => (
              <Card 
                key={ageGroup.level}
                className="hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
              >
                <CardContent className="p-6 text-center">
                  <div className={`w-16 h-16 bg-gradient-to-br ${ageGroup.color} rounded-2xl flex items-center justify-center mx-auto mb-4`}>
                    <span className="text-2xl">{ageGroup.emoji}</span>
                  </div>
                  
                  <h3 className="text-lg font-bold text-gray-800 mb-1">{ageGroup.name}</h3>
                  <p className="text-blue-600 font-medium text-sm mb-2">Ages {ageGroup.level}</p>
                  <p className="text-gray-600 text-sm mb-3">{ageGroup.description}</p>
                  
                  <div className="space-y-1">
                    {ageGroup.skills.map((skill, index) => (
                      <div key={index} className="text-xs text-gray-600">• {skill}</div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center">
            <Link to="/unified-age-selector">
              <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold py-4 px-12 rounded-full text-lg transition-all duration-300 transform hover:scale-105">
                Start Your Learning Journey
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Interactive Learning Section */}
      <InteractiveLearning />
      
      {/* Course Highlights */}
      <CourseCards />

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-800 mb-6">
              Why Choose TecaiKids?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Comprehensive learning platform designed for Sri Lankan children
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {[
              {
                icon: "🎓",
                title: "Age-Appropriate Learning",
                description: "Content automatically adapts to your child's age and skill level, ensuring optimal learning progression.",
                features: ["Personalized curriculum", "Progressive difficulty", "Age-specific activities"]
              },
              {
                icon: "🏆", 
                title: "Achievement System",
                description: "Gamified learning with badges, points, and achievements to keep children motivated and engaged.",
                features: ["Unlock badges", "Earn points", "Track progress"]
              },
              {
                icon: "📚",
                title: "Complete Curriculum",
                description: "From basic skills to advanced technology concepts, covering logical thinking and algorithmic reasoning.",
                features: ["Logical thinking", "Algorithmic thinking", "STEM subjects"]
              },
              {
                icon: "📦",
                title: "Physical Materials", 
                description: "Quarterly workbook delivery with hands-on activities designed by education experts.",
                features: ["Expert-designed content", "Hands-on activities", "Quarterly delivery"]
              },
              {
                icon: "💰",
                title: "Affordable Pricing",
                description: "Quality education accessible to all Sri Lankan families with flexible payment options.",
                features: ["LKR pricing", "Multiple payment options", "Great value"]
              },
              {
                icon: "🇱🇰",
                title: "Sri Lankan Context",
                description: "Content designed specifically for Sri Lankan children by TEC Sri Lanka Worldwide.",
                features: ["Local context", "Cultural relevance", "Expert guidance"]
              }
            ].map((feature, index) => (
              <Card key={index} className="p-6 hover:shadow-lg transition-shadow">
                <CardContent>
                  <div className="text-4xl mb-4">{feature.icon}</div>
                  <h3 className="text-xl font-bold text-gray-800 mb-3">{feature.title}</h3>
                  <p className="text-gray-600 mb-4">{feature.description}</p>
                  <ul className="text-sm text-gray-600 space-y-1">
                    {feature.features.map((item, i) => (
                      <li key={i}>• {item}</li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Teaser */}
      <section className="py-16 bg-gradient-to-r from-blue-500 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold mb-6">
            Quality Education, Affordable Pricing
          </h2>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            Starting from just LKR 800/month. Includes unlimited access to courses, 
            quizzes, and progress tracking. Quarterly plans include physical workbooks!
          </p>
          
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <Badge className="bg-white text-blue-600 px-4 py-2 text-lg">
              💳 Credit Card & Bank Transfer
            </Badge>
            <Badge className="bg-white text-blue-600 px-4 py-2 text-lg">
              📦 Quarterly Workbooks
            </Badge>
            <Badge className="bg-white text-blue-600 px-4 py-2 text-lg">
              💰 Save 25% on Quarterly Plans
            </Badge>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/pricing">
              <Button className="bg-white text-blue-600 hover:bg-gray-100 font-bold py-4 px-8 rounded-full text-lg transition-all">
                View Pricing Plans
              </Button>
            </Link>
            <Link to="/unified-age-selector">
              <Button variant="outline" className="border-2 border-white text-white hover:bg-white hover:text-blue-600 font-bold py-4 px-8 rounded-full text-lg transition-all">
                Try Free Sample
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Corporate Branding */}
      <section className="py-12 bg-gray-50 border-t">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gray-600 mb-4">
            <strong>A TEC Sri Lanka Worldwide Initiative</strong>
          </p>
          <div className="flex flex-wrap justify-center items-center gap-8 text-sm text-gray-500">
            <span>🏢 TEC Sri Lanka Worldwide (Pvt.) Ltd</span>
            <span>📞 Contact: hello@tecaikids.com</span>
            <span>🇱🇰 Proudly Sri Lankan</span>
            <span>🎓 Expert-Designed Curriculum</span>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;