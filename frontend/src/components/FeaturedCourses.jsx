import React from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Star, Clock, Users, PlayCircle } from 'lucide-react';

const FeaturedCourses = () => {
  const courses = [
    {
      id: 1,
      title: "Math Adventures",
      description: "Fun math games and puzzles that make numbers exciting for young learners.",
      age: "5-8 years",
      duration: "30 mins",
      students: 1250,
      rating: 4.9,
      price: "Free",
      image: "🔢",
      color: "from-blue-400 to-blue-600",
      lessons: 25
    },
    {
      id: 2,
      title: "Science Explorers",
      description: "Discover the wonders of science through interactive experiments and activities.",
      age: "6-10 years",
      duration: "45 mins",
      students: 980,
      rating: 4.8,
      price: "Free",
      image: "🔬",
      color: "from-green-400 to-green-600",
      lessons: 30
    },
    {
      id: 3,
      title: "Creative Writing",
      description: "Unleash imagination with storytelling, poetry, and creative writing exercises.",
      age: "7-12 years",
      duration: "40 mins",
      students: 750,
      rating: 4.9,
      price: "Free",
      image: "✍️",
      color: "from-purple-400 to-purple-600",
      lessons: 20
    },
    {
      id: 4,
      title: "Art & Design",
      description: "Express creativity through digital art, drawing, and design fundamentals.",
      age: "5-11 years",
      duration: "35 mins",
      students: 890,
      rating: 4.7,
      price: "Free",
      image: "🎨",
      color: "from-pink-400 to-pink-600",
      lessons: 28
    },
    {
      id: 5,
      title: "Coding for Kids",
      description: "Learn programming basics through visual coding and fun projects.",
      age: "8-12 years",
      duration: "50 mins",
      students: 1150,
      rating: 4.9,
      price: "Premium",
      image: "💻",
      color: "from-orange-400 to-orange-600",
      lessons: 35
    },
    {
      id: 6,
      title: "Music & Rhythm",
      description: "Explore music theory, rhythm, and composition in an interactive way.",
      age: "4-10 years",
      duration: "25 mins",
      students: 650,
      rating: 4.6,
      price: "Premium",
      image: "🎵",
      color: "from-indigo-400 to-indigo-600",
      lessons: 22
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-blue-100 text-blue-600 hover:bg-blue-100">Featured Courses</Badge>
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-800 mb-6">
            Popular Learning
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> Adventures</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover our most loved courses designed by education experts to make learning 
            fun, engaging, and effective for children of all ages.
          </p>
        </div>

        {/* Courses Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {courses.map((course) => (
            <Card 
              key={course.id} 
              className="group hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border-0 shadow-lg overflow-hidden"
            >
              <CardHeader className="p-0">
                <div className={`h-48 bg-gradient-to-br ${course.color} flex items-center justify-center relative overflow-hidden`}>
                  <div className="text-6xl mb-4">{course.image}</div>
                  <div className="absolute top-4 right-4">
                    <Badge className="bg-white text-gray-700 hover:bg-white">
                      {course.price}
                    </Badge>
                  </div>
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
                    <PlayCircle className="w-16 h-16 text-white opacity-0 group-hover:opacity-100 transition-all duration-300 transform scale-75 group-hover:scale-100" />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <Badge variant="secondary" className="text-xs">
                    {course.age}
                  </Badge>
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-medium">{course.rating}</span>
                  </div>
                </div>
                
                <CardTitle className="text-xl font-bold text-gray-800 mb-3 group-hover:text-blue-600 transition-colors duration-300">
                  {course.title}
                </CardTitle>
                
                <p className="text-gray-600 mb-4 text-sm leading-relaxed">
                  {course.description}
                </p>
                
                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <div className="flex items-center space-x-1">
                    <Clock className="w-4 h-4" />
                    <span>{course.duration}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Users className="w-4 h-4" />
                    <span>{course.students.toLocaleString()}</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">{course.lessons} lessons</span>
                  <Button 
                    className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold px-4 py-2 rounded-full transition-all duration-300 transform hover:scale-105"
                  >
                    Start Course
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center mt-12">
          <Button 
            variant="outline" 
            className="border-2 border-blue-500 text-blue-600 hover:bg-blue-500 hover:text-white font-bold py-3 px-8 rounded-full text-lg transition-all duration-300"
          >
            View All Courses
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedCourses;