import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { useUser } from '../App';
import { useToast } from '../hooks/use-toast';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const AgeSelector = () => {
  const [selectedAge, setSelectedAge] = useState(null);
  const [name, setName] = useState('');
  const [parentEmail, setParentEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { setUser, setAgeLevel } = useUser();
  const navigate = useNavigate();
  const { toast } = useToast();

  const ageGroups = [
    {
      value: "4-6",
      label: "Preschool",
      ageRange: "Ages 4-6",
      description: "Fun basics for little learners",
      emoji: "🌟",
      color: "from-yellow-400 to-orange-500",
      skills: ["Numbers 1-10", "Letters & Sounds", "Colors & Shapes", "Simple Stories"]
    },
    {
      value: "7-9", 
      label: "Elementary",
      ageRange: "Ages 7-9",
      description: "Building foundational skills", 
      emoji: "🚀",
      color: "from-blue-500 to-purple-600",
      skills: ["Addition & Subtraction", "Reading Comprehension", "Science Basics", "Creative Projects"]
    },
    {
      value: "10-12",
      label: "Intermediate", 
      ageRange: "Ages 10-12",
      description: "Advanced concepts and challenges",
      emoji: "⚡",
      color: "from-purple-600 to-pink-600", 
      skills: ["Multiplication & Division", "Advanced Reading", "Science Experiments", "Coding Basics"]
    }
  ];

  const handleCreateUser = async () => {
    if (!name || !selectedAge || !parentEmail) {
      toast({
        title: "Missing Information",
        description: "Please fill in all fields to continue.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    
    try {
      const userData = {
        name: name,
        age: parseInt(selectedAge.split('-')[0]), // Use the lower bound of age range
        parent_email: parentEmail
      };

      const response = await axios.post(`${API}/users`, userData);
      const newUser = response.data;
      
      // Set user context
      setUser(newUser);
      setAgeLevel(newUser.age_level);
      
      // Initialize sample data if needed
      try {
        await axios.post(`${API}/init/all`);
      } catch (initError) {
        console.log('Sample data may already exist');
      }

      toast({
        title: "Welcome to TecaiKids!",
        description: `Hi ${name}! Let's start your learning adventure!`
      });

      navigate('/dashboard');
    } catch (error) {
      console.error('Error creating user:', error);
      toast({
        title: "Error",
        description: "There was a problem creating your profile. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 pt-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <Badge className="mb-4 bg-blue-100 text-blue-600 hover:bg-blue-100">Let's Get Started</Badge>
          <h1 className="text-4xl lg:text-5xl font-bold text-gray-800 mb-6">
            Choose Your Learning
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> Adventure</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Select your age group to get personalized courses, quizzes, and activities 
            designed just for your learning level!
          </p>
        </div>

        {/* User Info Form */}
        <div className="max-w-2xl mx-auto mb-12">
          <Card className="shadow-xl border-0">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Tell us about yourself!</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    What's your name? *
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 transition-colors duration-300"
                    placeholder="Enter your name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Parent's Email Address *
                  </label>
                  <input
                    type="email"
                    value={parentEmail}
                    onChange={(e) => setParentEmail(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 transition-colors duration-300"
                    placeholder="parent@example.com"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Age Group Selection */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {ageGroups.map((group) => (
            <Card 
              key={group.value}
              className={`cursor-pointer transition-all duration-300 transform hover:-translate-y-2 border-2 ${
                selectedAge === group.value 
                  ? 'border-blue-500 shadow-2xl scale-105' 
                  : 'border-gray-200 shadow-lg hover:shadow-xl'
              }`}
              onClick={() => setSelectedAge(group.value)}
            >
              <CardContent className="p-8 text-center">
                <div className={`w-20 h-20 bg-gradient-to-br ${group.color} rounded-3xl flex items-center justify-center mx-auto mb-4`}>
                  <span className="text-3xl">{group.emoji}</span>
                </div>
                
                <h3 className="text-2xl font-bold text-gray-800 mb-2">{group.label}</h3>
                <p className="text-blue-600 font-medium mb-2">{group.ageRange}</p>
                <p className="text-gray-600 mb-4">{group.description}</p>
                
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-700">You'll learn:</p>
                  {group.skills.map((skill, index) => (
                    <Badge key={index} variant="secondary" className="text-xs mr-1 mb-1">
                      {skill}
                    </Badge>
                  ))}
                </div>
                
                {selectedAge === group.value && (
                  <div className="mt-4">
                    <Badge className="bg-blue-500 text-white">Selected!</Badge>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Continue Button */}
        <div className="text-center">
          <Button 
            onClick={handleCreateUser}
            disabled={!name || !selectedAge || !parentEmail || isLoading}
            className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold py-4 px-12 rounded-full text-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {isLoading ? 'Setting up your account...' : 'Start My Learning Journey!'}
          </Button>
        </div>

        {/* Fun Facts */}
        <div className="mt-16 grid md:grid-cols-3 gap-6">
          {[
            { icon: "🎮", title: "500+ Interactive Activities", desc: "Games, quizzes, and challenges" },
            { icon: "🏆", title: "Achievement System", desc: "Earn badges and unlock rewards" },
            { icon: "📊", title: "Progress Tracking", desc: "Watch your skills grow every day" }
          ].map((feature, index) => (
            <div key={index} className="text-center">
              <div className="text-4xl mb-3">{feature.icon}</div>
              <h3 className="text-lg font-bold text-gray-800 mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AgeSelector;