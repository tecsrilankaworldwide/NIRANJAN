import React, { useState } from 'react';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Play, Star, Timer, Trophy, Zap, Brain, Gamepad2, Puzzle } from 'lucide-react';

const Activities = () => {
  const [selectedType, setSelectedType] = useState('All');

  const activityTypes = ['All', 'Games', 'Puzzles', 'Quizzes', 'Creative', 'Science', 'Math'];

  const activities = [
    {
      id: 1,
      title: "Number Rocket Adventure",
      description: "Help the rocket reach space by solving addition and subtraction problems!",
      type: "Games",
      age: "5-8 years",
      duration: "10-15 mins",
      difficulty: "Easy",
      rating: 4.9,
      plays: 2850,
      image: "🚀",
      color: "from-blue-400 to-blue-600",
      skills: ["Addition", "Subtraction", "Problem Solving"]
    },
    {
      id: 2,
      title: "Animal Memory Match",
      description: "Improve memory skills by matching adorable animal pairs in this fun game.",
      type: "Puzzles",
      age: "4-7 years",
      duration: "5-10 mins",
      difficulty: "Easy",
      rating: 4.7,
      plays: 1920,
      image: "🐾",
      color: "from-green-400 to-green-600",
      skills: ["Memory", "Concentration", "Pattern Recognition"]
    },
    {
      id: 3,
      title: "Science Lab Explorer",
      description: "Conduct virtual experiments and discover amazing scientific phenomena!",
      type: "Science",
      age: "7-11 years",
      duration: "15-20 mins",
      difficulty: "Medium",
      rating: 4.8,
      plays: 1650,
      image: "⚗️",
      color: "from-purple-400 to-purple-600",
      skills: ["Scientific Method", "Observation", "Critical Thinking"]
    },
    {
      id: 4,
      title: "Word Builder Castle",
      description: "Build magnificent castles by creating words from letter blocks!",
      type: "Creative",
      age: "6-10 years",
      duration: "10-15 mins",
      difficulty: "Medium",
      rating: 4.6,
      plays: 1280,
      image: "🏰",
      color: "from-pink-400 to-pink-600",
      skills: ["Vocabulary", "Spelling", "Creativity"]
    },
    {
      id: 5,
      title: "Math Monster Quiz",
      description: "Battle friendly monsters by answering multiplication and division questions!",
      type: "Quizzes",
      age: "8-12 years",
      duration: "15 mins",
      difficulty: "Hard",
      rating: 4.9,
      plays: 2100,
      image: "👾",
      color: "from-orange-400 to-orange-600",
      skills: ["Multiplication", "Division", "Quick Thinking"]
    },
    {
      id: 6,
      title: "Geometry Shape Detective",
      description: "Solve mysteries by identifying shapes and their properties in different scenes.",
      type: "Math",
      age: "7-10 years",
      duration: "12-18 mins",
      difficulty: "Medium",
      rating: 4.8,
      plays: 890,
      image: "🔍",
      color: "from-indigo-400 to-indigo-600",
      skills: ["Geometry", "Shape Recognition", "Logic"]
    },
    {
      id: 7,
      title: "Creative Story Builder",
      description: "Create amazing stories by choosing characters, settings, and plot elements!",
      type: "Creative",
      age: "5-12 years",
      duration: "20-30 mins",
      difficulty: "Easy",
      rating: 4.7,
      plays: 1450,
      image: "📖",
      color: "from-teal-400 to-teal-600",
      skills: ["Storytelling", "Imagination", "Language Skills"]
    },
    {
      id: 8,
      title: "Planet Puzzle Explorer",
      description: "Explore the solar system while solving challenging space-themed puzzles.",
      type: "Puzzles",
      age: "8-12 years",
      duration: "15-25 mins",
      difficulty: "Hard",
      rating: 4.9,
      plays: 1780,
      image: "🪐",
      color: "from-violet-400 to-violet-600",
      skills: ["Space Science", "Problem Solving", "Astronomy"]
    },
    {
      id: 9,
      title: "Music Rhythm Challenge",
      description: "Create beautiful melodies and learn about rhythm in this musical adventure.",
      type: "Games",
      age: "4-10 years",
      duration: "8-12 mins",
      difficulty: "Easy",
      rating: 4.5,
      plays: 1320,
      image: "🎵",
      color: "from-rose-400 to-rose-600",
      skills: ["Music Theory", "Rhythm", "Listening Skills"]
    }
  ];

  const filteredActivities = activities.filter(activity => 
    selectedType === 'All' || activity.type === selectedType
  );

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Easy': return 'bg-green-100 text-green-700';
      case 'Medium': return 'bg-yellow-100 text-yellow-700';
      case 'Hard': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'Games': return Gamepad2;
      case 'Puzzles': return Puzzle;
      case 'Quizzes': return Brain;
      case 'Creative': return Zap;
      case 'Science': return Trophy;
      case 'Math': return Timer;
      default: return Play;
    }
  };

  return (
    <div className="pt-20">
      {/* Header Section */}
      <section className="py-16 bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-purple-100 text-purple-600 hover:bg-purple-100">Fun Activities</Badge>
            <h1 className="text-4xl lg:text-6xl font-bold text-gray-800 mb-6">
              Interactive Learning
              <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent"> Activities</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Engage in hands-on activities, games, and challenges designed to make learning 
              exciting and memorable for young minds.
            </p>
          </div>

          {/* Activity Type Filters */}
          <div className="flex flex-wrap justify-center gap-3 mb-8">
            {activityTypes.map((type) => {
              const Icon = getTypeIcon(type);
              return (
                <button
                  key={type}
                  onClick={() => setSelectedType(type)}
                  className={`flex items-center space-x-2 px-6 py-3 rounded-full font-medium transition-all duration-300 ${
                    selectedType === type
                      ? 'bg-gradient-to-r from-purple-500 to-pink-600 text-white shadow-lg transform scale-105'
                      : 'bg-white text-gray-600 border border-gray-300 hover:border-purple-400 hover:text-purple-600'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{type}</span>
                </button>
              );
            })}
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
            {[
              { icon: Gamepad2, value: '50+', label: 'Games' },
              { icon: Puzzle, value: '30+', label: 'Puzzles' },
              { icon: Brain, value: '100+', label: 'Quizzes' },
              { icon: Trophy, value: '25K+', label: 'Completions' }
            ].map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className="text-center bg-white rounded-2xl p-4 shadow-lg">
                  <Icon className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-gray-800">{stat.value}</div>
                  <div className="text-sm text-gray-600">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Activities Grid */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredActivities.map((activity) => (
              <Card 
                key={activity.id} 
                className="group hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border-0 shadow-lg overflow-hidden"
              >
                <CardContent className="p-0">
                  {/* Activity Preview */}
                  <div className={`h-40 bg-gradient-to-br ${activity.color} flex items-center justify-center relative overflow-hidden`}>
                    <div className="text-5xl">{activity.image}</div>
                    <div className="absolute top-3 right-3">
                      <Badge className={getDifficultyColor(activity.difficulty)}>
                        {activity.difficulty}
                      </Badge>
                    </div>
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
                      <Play className="w-12 h-12 text-white opacity-0 group-hover:opacity-100 transition-all duration-300 transform scale-75 group-hover:scale-100" />
                    </div>
                  </div>

                  {/* Activity Info */}
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-3">
                      <Badge variant="secondary" className="text-xs">
                        {activity.age}
                      </Badge>
                      <div className="flex items-center space-x-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-medium">{activity.rating}</span>
                      </div>
                    </div>

                    <h3 className="text-lg font-bold text-gray-800 mb-2 group-hover:text-purple-600 transition-colors duration-300">
                      {activity.title}
                    </h3>

                    <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                      {activity.description}
                    </p>

                    {/* Skills Tags */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {activity.skills.slice(0, 2).map((skill, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                    </div>

                    <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                      <div className="flex items-center space-x-1">
                        <Timer className="w-4 h-4" />
                        <span>{activity.duration}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Trophy className="w-4 h-4" />
                        <span>{activity.plays.toLocaleString()} plays</span>
                      </div>
                    </div>

                    <Button className="w-full bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white font-semibold py-2 rounded-full transition-all duration-300 transform hover:scale-105">
                      Play Now
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* No results message */}
          {filteredActivities.length === 0 && (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">🎮</div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">No activities found</h3>
              <p className="text-gray-600">Try selecting a different activity type to see more options.</p>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-purple-600 to-pink-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
            Ready for More Adventures?
          </h2>
          <p className="text-xl text-purple-100 mb-8">
            Unlock premium activities and get personalized learning recommendations for your child.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button className="bg-white text-purple-600 hover:bg-gray-100 font-bold py-3 px-8 rounded-full text-lg transition-all duration-300 transform hover:scale-105">
              Upgrade to Premium
            </Button>
            <Button variant="outline" className="border-2 border-white text-white hover:bg-white hover:text-purple-600 font-bold py-3 px-8 rounded-full text-lg transition-all duration-300">
              Browse All Activities
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Activities;