import React from 'react';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Heart, Shield, Globe, Users, Award, Target } from 'lucide-react';

const About = () => {
  const values = [
    {
      icon: Heart,
      title: "Child-Centered Learning",
      description: "Every feature is designed with children's natural curiosity and learning patterns in mind."
    },
    {
      icon: Shield,
      title: "Safety First",
      description: "Complete privacy protection with COPPA-compliant safety measures and content moderation."
    },
    {
      icon: Globe,
      title: "Inclusive Education",
      description: "Accessible learning for children of all abilities, backgrounds, and learning styles worldwide."
    },
    {
      icon: Users,
      title: "Family Partnership",
      description: "Strong collaboration between children, parents, and educators for optimal learning outcomes."
    }
  ];

  const team = [
    {
      name: "Dr. Sarah Martinez",
      role: "Chief Education Officer",
      description: "Former Stanford educator with 15+ years in child development",
      avatar: "👩‍🎓"
    },
    {
      name: "Alex Johnson",
      role: "Head of Product",
      description: "Ex-Google product manager specializing in educational technology",
      avatar: "👨‍💻"
    },
    {
      name: "Maria Chen",
      role: "Child Psychologist",
      description: "Specialist in cognitive development and learning assessment",
      avatar: "👩‍⚕️"
    },
    {
      name: "David Kim",
      role: "Creative Director",
      description: "Award-winning designer creating engaging visual experiences",
      avatar: "👨‍🎨"
    }
  ];

  return (
    <div className="pt-20">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-blue-100 text-blue-600 hover:bg-blue-100">About TecaiKids</Badge>
            <h1 className="text-4xl lg:text-6xl font-bold text-gray-800 mb-6">
              Inspiring Young Minds
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> Worldwide</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              We're on a mission to make learning an adventure that every child loves. Through innovative 
              technology and proven educational methods, we're building the future of childhood education.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-800 mb-6">Our Story</h2>
              <div className="space-y-4 text-gray-600 leading-relaxed">
                <p>
                  TecaiKids was born from a simple observation: children learn best when they're having fun. 
                  Founded in 2020 by a team of educators, technologists, and child development experts, 
                  we set out to create a learning platform that would spark joy in education.
                </p>
                <p>
                  What started as a small project to help children during remote learning has grown into 
                  a global platform trusted by over 15,000 families and educators across 45 countries. 
                  Our adaptive learning technology has helped children improve their academic performance 
                  while developing a genuine love for learning.
                </p>
                <p>
                  Today, we continue to innovate and expand, always keeping our core mission at heart: 
                  making learning an adventure that every child can enjoy and succeed in.
                </p>
              </div>
            </div>
            
            <div className="relative">
              <div className="bg-gradient-to-br from-yellow-200 via-orange-200 to-pink-200 rounded-3xl p-8 relative overflow-hidden">
                <div className="absolute top-4 right-4 w-16 h-16 bg-blue-400 rounded-2xl flex items-center justify-center animate-bounce">
                  <Award className="w-8 h-8 text-white" />
                </div>
                <div className="absolute bottom-4 left-4 w-12 h-12 bg-green-500 rounded-full flex items-center justify-center animate-pulse">
                  <Target className="w-6 h-6 text-white" />
                </div>
                <div className="text-center">
                  <h3 className="text-2xl font-bold text-gray-800 mb-4">Our Impact</h3>
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                      <div className="text-3xl font-bold text-blue-600">15K+</div>
                      <div className="text-sm text-gray-600">Students</div>
                    </div>
                    <div>
                      <div className="text-3xl font-bold text-green-600">45</div>
                      <div className="text-sm text-gray-600">Countries</div>
                    </div>
                    <div>
                      <div className="text-3xl font-bold text-purple-600">98%</div>
                      <div className="text-sm text-gray-600">Satisfaction</div>
                    </div>
                    <div>
                      <div className="text-3xl font-bold text-orange-600">500+</div>
                      <div className="text-sm text-gray-600">Courses</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-6">Our Core Values</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Everything we do is guided by our commitment to creating safe, inclusive, 
              and effective learning experiences for children everywhere.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <Card key={index} className="group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border-0 shadow-lg">
                  <CardContent className="p-8">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center flex-shrink-0">
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-blue-600 transition-colors duration-300">
                          {value.title}
                        </h3>
                        <p className="text-gray-600 leading-relaxed">
                          {value.description}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-6">Meet Our Team</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our diverse team of educators, technologists, and child development experts 
              work together to create the best learning experience for your children.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <Card key={index} className="group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border-0 shadow-lg bg-white text-center">
                <CardContent className="p-6">
                  <div className="text-4xl mb-4">{member.avatar}</div>
                  <h3 className="text-lg font-bold text-gray-800 mb-2 group-hover:text-blue-600 transition-colors duration-300">
                    {member.name}
                  </h3>
                  <p className="text-blue-600 font-medium mb-3">{member.role}</p>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {member.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Join Our Learning Community
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Be part of a global community dedicated to making learning fun, engaging, and effective for every child.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button className="bg-white text-blue-600 hover:bg-gray-100 font-bold py-3 px-8 rounded-full text-lg transition-all duration-300 transform hover:scale-105">
              Start Free Trial
            </Button>
            <Button variant="outline" className="border-2 border-white text-white hover:bg-white hover:text-blue-600 font-bold py-3 px-8 rounded-full text-lg transition-all duration-300">
              Contact Us
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;