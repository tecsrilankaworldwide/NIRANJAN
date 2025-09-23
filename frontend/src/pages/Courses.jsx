import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Star, Clock, Users, PlayCircle, Filter, Search } from 'lucide-react';

const Courses = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  const categories = ['All', 'Math', 'Science', 'English', 'Art', 'Coding', 'Music'];

  const courses = [
    {
      id: 1,
      title: "Math Adventures: Numbers & Counting",
      description: "Explore the magical world of numbers through fun games and interactive puzzles.",
      category: "Math",
      age: "4-6 years",
      duration: "25 mins",
      students: 1250,
      rating: 4.9,
      price: "Free",
      image: "🔢",
      color: "from-blue-400 to-blue-600",
      lessons: 20,
      level: "Beginner"
    },
    {
      id: 2,
      title: "Science Explorers: Amazing Experiments",
      description: "Discover scientific wonders through safe, hands-on virtual experiments.",
      category: "Science",
      age: "6-10 years",
      duration: "35 mins",
      students: 980,
      rating: 4.8,
      price: "Free",
      image: "🔬",
      color: "from-green-400 to-green-600",
      lessons: 25,
      level: "Intermediate"
    },
    {
      id: 3,
      title: "Creative Writing Workshop",
      description: "Unleash imagination with storytelling, poetry, and creative expression.",
      category: "English",
      age: "7-12 years",
      duration: "40 mins",
      students: 750,
      rating: 4.9,
      price: "Free",
      image: "✍️",
      color: "from-purple-400 to-purple-600",
      lessons: 18,
      level: "Intermediate"
    },
    {
      id: 4,
      title: "Digital Art Studio",
      description: "Express creativity through digital drawing, painting, and design basics.",
      category: "Art",
      age: "5-11 years",
      duration: "30 mins",
      students: 890,
      rating: 4.7,
      price: "Premium",
      image: "🎨",
      color: "from-pink-400 to-pink-600",
      lessons: 22,
      level: "Beginner"
    },
    {
      id: 5,
      title: "Coding Adventures with Scratch",
      description: "Learn programming fundamentals through visual coding and game creation.",
      category: "Coding",
      age: "8-12 years",
      duration: "45 mins",
      students: 1150,
      rating: 4.9,
      price: "Premium",
      image: "💻",
      color: "from-orange-400 to-orange-600",
      lessons: 30,
      level: "Beginner"
    },
    {
      id: 6,
      title: "Music & Rhythm Discovery",
      description: "Explore musical notes, rhythm patterns, and simple composition.",
      category: "Music",
      age: "4-10 years",
      duration: "25 mins",
      students: 650,
      rating: 4.6,
      price: "Premium",
      image: "🎵",
      color: "from-indigo-400 to-indigo-600",
      lessons: 16,
      level: "Beginner"
    },
    {
      id: 7,
      title: "Advanced Math: Geometry Fun",
      description: "Explore shapes, angles, and spatial relationships through interactive activities.",
      category: "Math",
      age: "8-12 years",
      duration: "40 mins",
      students: 420,
      rating: 4.8,
      price: "Premium",
      image: "📐",
      color: "from-blue-500 to-cyan-500",
      lessons: 24,
      level: "Advanced"
    },
    {
      id: 8,
      title: "Nature Science: Plants & Animals",
      description: "Discover the fascinating world of living things and their environments.",
      category: "Science",
      age: "5-9 years",
      duration: "30 mins",
      students: 680,
      rating: 4.7,
      price: "Free",
      image: "🌱",
      color: "from-green-500 to-teal-500",
      lessons: 20,
      level: "Beginner"
    },
    {
      id: 9,
      title: "Reading Comprehension Masters",
      description: "Improve reading skills with engaging stories and comprehension exercises.",
      category: "English",
      age: "6-10 years",
      duration: "35 mins",
      students: 890,
      rating: 4.8,
      price: "Free",
      image: "📚",
      color: "from-purple-500 to-violet-500",
      lessons: 28,
      level: "Intermediate"
    }
  ];

  const filteredCourses = courses.filter(course => {
    const matchesCategory = selectedCategory === 'All' || course.category === selectedCategory;
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="pt-20">
      {/* Header Section */}
      <section className="py-16 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-blue-100 text-blue-600 hover:bg-blue-100">All Courses</Badge>
            <h1 className="text-4xl lg:text-6xl font-bold text-gray-800 mb-6">
              Discover Amazing
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> Learning Adventures</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Explore our comprehensive collection of interactive courses designed to make learning 
              fun, engaging, and effective for children of all ages.
            </p>
          </div>

          {/* Search and Filter */}
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row gap-4 mb-8">
              {/* Search Bar */}
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search courses..."
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:border-blue-500 transition-colors duration-300"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              {/* Filter Button */}
              <Button variant="outline" className="border-2 border-gray-300 hover:border-blue-400 px-6 py-3 rounded-full">
                <Filter className="w-4 h-4 mr-2" />
                Filter
              </Button>
            </div>

            {/* Category Filters */}
            <div className="flex flex-wrap justify-center gap-3">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-6 py-2 rounded-full font-medium transition-all duration-300 ${
                    selectedCategory === category
                      ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                      : 'bg-white text-gray-600 border border-gray-300 hover:border-blue-400 hover:text-blue-600'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Courses Grid */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredCourses.map((course) => (
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
                    <div className="absolute top-4 left-4">
                      <Badge className="bg-black bg-opacity-20 text-white hover:bg-black hover:bg-opacity-20">
                        {course.level}
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

          {/* No results message */}
          {filteredCourses.length === 0 && (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">No courses found</h3>
              <p className="text-gray-600">Try adjusting your search or filter to find more courses.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Courses;