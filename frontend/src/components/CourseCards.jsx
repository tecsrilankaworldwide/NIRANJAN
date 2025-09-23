import React from 'react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';

const CourseCards = () => {
  const courses = [
    {
      id: 1,
      title: "Math Adventures",
      description: "Fun mathematical concepts through interactive games and puzzles",
      category: "Math",
      ageGroup: "4-6",
      emoji: "🔢",
      color: "from-yellow-400 to-orange-500",
      duration: "30 mins",
      lessons: 12,
      difficulty: "Beginner"
    },
    {
      id: 2,
      title: "Science Explorers",
      description: "Discover the wonders of science through hands-on experiments",
      category: "Science",
      ageGroup: "7-9",
      emoji: "🔬",
      color: "from-green-400 to-blue-500",
      duration: "45 mins",
      lessons: 15,
      difficulty: "Intermediate"
    },
    {
      id: 3,
      title: "Coding Basics",
      description: "Introduction to programming concepts and logical thinking",
      category: "Programming",
      ageGroup: "10-12",
      emoji: "💻",
      color: "from-purple-400 to-pink-500",
      duration: "60 mins",
      lessons: 20,
      difficulty: "Beginner"
    },
    {
      id: 4,
      title: "Web Development",
      description: "Build your first websites with HTML, CSS, and JavaScript",
      category: "Programming",
      ageGroup: "13-15",
      emoji: "🌐",
      color: "from-indigo-400 to-purple-500",
      duration: "90 mins",
      lessons: 25,
      difficulty: "Intermediate"
    },
    {
      id: 5,
      title: "AI & Machine Learning",
      description: "Explore artificial intelligence and create your own AI projects",
      category: "Technology",
      ageGroup: "16-18",
      emoji: "🤖",
      color: "from-teal-400 to-cyan-500",
      duration: "120 mins",
      lessons: 30,
      difficulty: "Advanced"
    },
    {
      id: 6,
      title: "Creative Arts",
      description: "Express creativity through digital art and design projects",
      category: "Art",
      ageGroup: "4-12",
      emoji: "🎨",
      color: "from-pink-400 to-red-500",
      duration: "45 mins",
      lessons: 18,
      difficulty: "All Levels"
    }
  ];

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <Badge className="mb-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white">
            Featured Courses
          </Badge>
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-800 mb-6">
            Popular Learning
            <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent"> Paths</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover our most popular courses designed to engage and educate learners at every age level
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {courses.map((course) => (
            <Card key={course.id} className="group hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border-0 overflow-hidden">
              <div className={`h-2 bg-gradient-to-r ${course.color}`} />
              
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 bg-gradient-to-br ${course.color} rounded-2xl flex items-center justify-center`}>
                    <span className="text-2xl">{course.emoji}</span>
                  </div>
                  <Badge variant="outline" className="text-blue-600 border-blue-300">
                    Ages {course.ageGroup}
                  </Badge>
                </div>
                
                <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-blue-600 transition-colors">
                  {course.title}
                </h3>
                
                <p className="text-gray-600 mb-4 text-sm leading-relaxed">
                  {course.description}
                </p>
                
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-500">Category:</span>
                    <Badge variant="secondary">{course.category}</Badge>
                  </div>
                  
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-500">Duration:</span>
                    <span className="font-medium text-gray-700">{course.duration}</span>
                  </div>
                  
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-500">Lessons:</span>
                    <span className="font-medium text-gray-700">{course.lessons}</span>
                  </div>
                  
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-500">Level:</span>
                    <Badge 
                      variant="outline" 
                      className={`${
                        course.difficulty === 'Beginner' ? 'text-green-600 border-green-300' :
                        course.difficulty === 'Intermediate' ? 'text-yellow-600 border-yellow-300' :
                        course.difficulty === 'Advanced' ? 'text-red-600 border-red-300' :
                        'text-blue-600 border-blue-300'
                      }`}
                    >
                      {course.difficulty}
                    </Badge>
                  </div>
                </div>
                
                <Button className={`w-full bg-gradient-to-r ${course.color} hover:opacity-90 text-white font-bold py-3 transition-all duration-300`}>
                  Start Learning
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button 
            variant="outline" 
            className="border-2 border-blue-500 text-blue-600 hover:bg-blue-500 hover:text-white font-bold px-8 py-3 rounded-full transition-all duration-300"
          >
            View All Courses
          </Button>
        </div>
      </div>
    </section>
  );
};

export default CourseCards;