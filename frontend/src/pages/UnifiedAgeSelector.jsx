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

const UnifiedAgeSelector = () => {
  const [selectedAge, setSelectedAge] = useState(null);
  const [name, setName] = useState('');
  const [parentEmail, setParentEmail] = useState('');
  const [studentEmail, setStudentEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [school, setSchool] = useState('');
  const [grade, setGrade] = useState('');
  const [interests, setInterests] = useState([]);
  const [careerGoals, setCareerGoals] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { setUser, setAgeLevel } = useUser();
  const navigate = useNavigate();
  const { toast } = useToast();

  const ageGroups = [
    {
      value: "4-6",
      label: "Little Learners",
      ageRange: "Ages 4-6",
      description: "Fun basics for little learners",
      emoji: "🌟",
      color: "from-yellow-400 to-orange-500",
      skills: ["Numbers 1-10", "Letters & Sounds", "Colors & Shapes", "Logical Thinking Basics"],
      features: ["Interactive games", "Parent guidance", "Progress tracking", "Fun activities"]
    },
    {
      value: "7-9", 
      label: "Young Explorers",
      ageRange: "Ages 7-9",
      description: "Building foundational skills", 
      emoji: "🚀",
      color: "from-blue-500 to-purple-600",
      skills: ["Math & Reading", "Science Basics", "Creative Projects", "Logical Thinking Development"],
      features: ["Science experiments", "Creative projects", "Progress reports", "Achievement badges"]
    },
    {
      value: "10-12",
      label: "Smart Kids", 
      ageRange: "Ages 10-12",
      description: "Advanced concepts and challenges",
      emoji: "⚡",
      color: "from-purple-600 to-pink-600", 
      skills: ["Advanced Math", "Coding Basics", "STEM Projects", "Algorithmic Thinking"],
      features: ["Coding introduction", "STEM projects", "Critical thinking", "Mentor support"]
    },
    {
      value: "13-15",
      label: "Tech Teens", 
      ageRange: "Ages 13-15",
      description: "Technology and programming skills",
      emoji: "💻",
      color: "from-indigo-600 to-blue-600", 
      skills: ["Programming", "Web Development", "Digital Literacy", "Advanced Algorithms"],
      features: ["Real programming", "Web projects", "Digital skills", "Tech mentorship"]
    },
    {
      value: "16-18",
      label: "Future Leaders", 
      ageRange: "Ages 16-18",
      description: "Advanced technology and leadership",
      emoji: "🎯",
      color: "from-green-600 to-teal-600", 
      skills: ["AI & Machine Learning", "App Development", "Leadership Skills", "Complex Problem Solving"],
      features: ["AI projects", "Advanced coding", "Leadership training", "Career preparation"]
    }
  ];

  const interestOptions = [
    "Mathematics", "Science", "Technology", "Art & Design", "Music", "Sports",
    "Reading", "Writing", "Gaming", "Robotics", "Programming", "Entrepreneurship"
  ];

  const careerOptions = [
    "Software Engineer", "Data Scientist", "Teacher", "Doctor", "Artist", "Musician",
    "Entrepreneur", "Scientist", "Designer", "Writer", "Engineer", "Game Developer"
  ];

  const handleInterestToggle = (interest) => {
    setInterests(prev => 
      prev.includes(interest) 
        ? prev.filter(i => i !== interest)
        : [...prev, interest]
    );
  };

  const handleCareerToggle = (career) => {
    setCareerGoals(prev => 
      prev.includes(career) 
        ? prev.filter(c => c !== career)
        : [...prev, career]
    );
  };

  const determineActualAge = (ageRange) => {
    // Get the lower bound of the age range for API compatibility
    return parseInt(ageRange.split('-')[0]);
  };

  const handleCreateUser = async () => {
    if (!name || !selectedAge || !parentEmail) {
      toast({
        title: "Missing Information",
        description: "Please fill in name, age group, and parent email to continue.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    
    try {
      const userData = {
        name: name,
        age: determineActualAge(selectedAge),
        parent_email: parentEmail,
        student_email: studentEmail || null,
        phone: phone || null,
        school: school || null,
        grade: grade ? parseInt(grade) : null,
        interests: interests,
        career_goals: careerGoals
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

      navigate('/unified-dashboard');
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

  const selectedAgeGroup = ageGroups.find(group => group.value === selectedAge);
  const isTeenOrOlder = selectedAge && ['13-15', '16-18'].includes(selectedAge);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <Badge className="mb-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:bg-gradient-to-r hover:from-blue-600 hover:to-purple-700">
            Choose Your Learning Path
          </Badge>
          <h1 className="text-4xl lg:text-5xl font-bold text-gray-800 mb-6">
            Welcome to
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> TecaiKids</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            A unified learning platform for ages 4-18. Select your age group to get personalized 
            courses, activities, and learning paths designed just for you!
          </p>
        </div>

        {/* Age Group Selection */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mb-12">
          {ageGroups.map((group) => (
            <Card 
              key={group.value}
              className={`cursor-pointer transition-all duration-300 transform hover:-translate-y-2 border-2 ${
                selectedAge === group.value 
                  ? 'border-blue-500 shadow-2xl scale-105 ring-2 ring-blue-200' 
                  : 'border-gray-200 shadow-lg hover:shadow-xl'
              }`}
              onClick={() => setSelectedAge(group.value)}
            >
              <CardContent className="p-6 text-center">
                <div className={`w-16 h-16 bg-gradient-to-br ${group.color} rounded-2xl flex items-center justify-center mx-auto mb-4`}>
                  <span className="text-2xl">{group.emoji}</span>
                </div>
                
                <h3 className="text-lg font-bold text-gray-800 mb-1">{group.label}</h3>
                <p className="text-blue-600 font-medium text-sm mb-2">{group.ageRange}</p>
                <p className="text-gray-600 text-sm mb-3">{group.description}</p>
                
                <div className="space-y-1 mb-3">
                  <p className="text-xs font-medium text-gray-700">Key Skills:</p>
                  <div className="flex flex-wrap gap-1">
                    {group.skills.slice(0, 2).map((skill, index) => (
                      <Badge key={index} variant="secondary" className="text-xs px-2 py-1">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                {selectedAge === group.value && (
                  <div className="mt-3">
                    <Badge className="bg-blue-500 text-white">Selected!</Badge>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* User Info Form */}
        {selectedAge && (
          <div className="max-w-4xl mx-auto mb-12">
            <Card className="shadow-2xl border-0">
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
                  Tell us about yourself, {selectedAgeGroup?.label}!
                </h2>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 transition-colors duration-300"
                      placeholder="Enter your full name"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Parent's Email *
                    </label>
                    <input
                      type="email"
                      value={parentEmail}
                      onChange={(e) => setParentEmail(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 transition-colors duration-300"
                      placeholder="parent@example.com"
                    />
                  </div>

                  {isTeenOrOlder && (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Your Email
                        </label>
                        <input
                          type="email"
                          value={studentEmail}
                          onChange={(e) => setStudentEmail(e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 transition-colors duration-300"
                          placeholder="your.email@example.com"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 transition-colors duration-300"
                          placeholder="+94 xx xxx xxxx"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          School/College
                        </label>
                        <input
                          type="text"
                          value={school}
                          onChange={(e) => setSchool(e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 transition-colors duration-300"
                          placeholder="Your school name"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Grade/Year
                        </label>
                        <input
                          type="number"
                          value={grade}
                          onChange={(e) => setGrade(e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 transition-colors duration-300"
                          placeholder="Grade level"
                          min="1"
                          max="13"
                        />
                      </div>
                    </>
                  )}
                </div>

                {/* Interests Selection (for all ages) */}
                <div className="mt-8">
                  <h3 className="text-lg font-bold text-gray-800 mb-4">What interests you? (Optional)</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                    {interestOptions.map((interest) => {
                      const isSelected = interests.includes(interest);
                      return (
                        <button
                          key={interest}
                          onClick={() => handleInterestToggle(interest)}
                          className={`p-3 rounded-lg text-sm font-medium transition-all duration-300 ${
                            isSelected 
                              ? 'bg-blue-500 text-white' 
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          {interest}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Career Goals (for teens only) */}
                {isTeenOrOlder && (
                  <div className="mt-8">
                    <h3 className="text-lg font-bold text-gray-800 mb-4">Career aspirations? (Optional)</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                      {careerOptions.map((career) => {
                        const isSelected = careerGoals.includes(career);
                        return (
                          <button
                            key={career}
                            onClick={() => handleCareerToggle(career)}
                            className={`p-3 rounded-lg text-sm font-medium transition-all duration-300 ${
                              isSelected 
                                ? 'bg-purple-500 text-white' 
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                          >
                            {career}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {/* Continue Button */}
        {selectedAge && (
          <div className="text-center">
            <Button 
              onClick={handleCreateUser}
              disabled={!name || !selectedAge || !parentEmail || isLoading}
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold py-4 px-12 rounded-full text-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isLoading ? 'Setting up your account...' : `Start My ${selectedAgeGroup?.label} Journey!`}
            </Button>
          </div>
        )}

        {/* Platform Features */}
        <div className="mt-20 grid md:grid-cols-3 gap-8">
          {[
            { 
              icon: "🎯", 
              title: "Personalized Learning", 
              desc: "Content adapted to your age and skill level" 
            },
            { 
              icon: "🏆", 
              title: "Achievement System", 
              desc: "Earn badges and unlock rewards as you progress" 
            },
            { 
              icon: "📚", 
              title: "Comprehensive Curriculum", 
              desc: "From basic skills to advanced technology concepts" 
            }
          ].map((feature, index) => (
            <div key={index} className="text-center">
              <div className="text-5xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">{feature.title}</h3>
              <p className="text-gray-600">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UnifiedAgeSelector;