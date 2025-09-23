import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { useUser } from '../App';
import { useToast } from '../hooks/use-toast';
import { Code, Cpu, Smartphone, Globe, BarChart, Gamepad2, Shield, Rocket, Target } from 'lucide-react';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const TeenSelector = () => {
  const [selectedAge, setSelectedAge] = useState(null);
  const [name, setName] = useState('');
  const [parentEmail, setParentEmail] = useState('');
  const [studentEmail, setStudentEmail] = useState('');
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
      value: "12-14",
      label: "Middle Teen",
      ageRange: "Ages 12-14",
      description: "Foundation skills and project-based learning",
      emoji: "🚀",
      color: "from-blue-500 to-purple-600",
      skills: ["Python Programming", "Web Development", "Robotics Basics", "App Development"]
    },
    {
      value: "15-17", 
      label: "High Teen",
      ageRange: "Ages 15-17",
      description: "Advanced concepts and career preparation", 
      emoji: "⚡",
      color: "from-purple-600 to-pink-600",
      skills: ["AI & Machine Learning", "Advanced Coding", "Cybersecurity", "Data Science", "Career Planning"]
    }
  ];

  const interestOptions = [
    { id: 'coding', label: 'Programming & Coding', icon: Code },
    { id: 'ai', label: 'AI & Robotics', icon: Cpu },
    { id: 'mobile', label: 'Mobile Apps', icon: Smartphone },
    { id: 'web', label: 'Web Development', icon: Globe },
    { id: 'data', label: 'Data Science', icon: BarChart },
    { id: 'gaming', label: 'Game Development', icon: Gamepad2 },
    { id: 'security', label: 'Cybersecurity', icon: Shield },
    { id: 'business', label: 'Entrepreneurship', icon: Rocket },
    { id: 'career', label: 'Career Planning', icon: Target }
  ];

  const careerOptions = [
    'Software Engineer',
    'AI/ML Engineer', 
    'Web Developer',
    'Mobile App Developer',
    'Data Scientist',
    'Game Developer',
    'Cybersecurity Analyst',
    'Product Manager',
    'Entrepreneur',
    'UX/UI Designer'
  ];

  const handleInterestToggle = (interestId) => {
    setInterests(prev => 
      prev.includes(interestId) 
        ? prev.filter(id => id !== interestId)
        : [...prev, interestId]
    );
  };

  const handleCareerToggle = (career) => {
    setCareerGoals(prev => 
      prev.includes(career) 
        ? prev.filter(c => c !== career)
        : [...prev, career]
    );
  };

  const handleCreateTeenUser = async () => {
    if (!name || !selectedAge || !parentEmail) {
      toast({
        title: "Missing Information",
        description: "Please fill in required fields to continue.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    
    try {
      const userData = {
        name: name,
        age: parseInt(selectedAge.split('-')[0]), // Use the lower bound of age range
        parent_email: parentEmail,
        student_email: studentEmail,
        school: school,
        grade: parseInt(grade) || null,
        interests: interests,
        career_goals: careerGoals
      };

      const response = await axios.post(`${API}/teen/users`, userData);
      const newUser = response.data;
      
      // Set user context
      setUser(newUser);
      setAgeLevel(newUser.age_level);
      
      // Initialize sample data if needed
      try {
        await axios.post(`${API}/init/teen-data`);
      } catch (initError) {
        console.log('Teen data may already exist');
      }

      toast({
        title: "Welcome to Teen Tech Academy!",
        description: `Hi ${name}! Let's start your advanced learning journey!`
      });

      navigate('/teen-dashboard');
    } catch (error) {
      console.error('Error creating teen user:', error);
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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 pt-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <Badge className="mb-4 bg-blue-600 text-white hover:bg-blue-600">Teen Tech Academy</Badge>
          <h1 className="text-4xl lg:text-5xl font-bold text-white mb-6">
            Advanced Learning for
            <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent"> Future Innovators</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Master cutting-edge technologies, build real projects, and prepare for careers 
            in AI, software development, and digital innovation.
          </p>
        </div>

        {/* User Info Form */}
        <div className="max-w-4xl mx-auto mb-12">
          <Card className="shadow-2xl border-0 bg-gray-800/50 backdrop-blur">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold text-white mb-6 text-center">Build Your Tech Profile</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500 transition-colors duration-300"
                    placeholder="Enter your full name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Parent's Email *
                  </label>
                  <input
                    type="email"
                    value={parentEmail}
                    onChange={(e) => setParentEmail(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500 transition-colors duration-300"
                    placeholder="parent@example.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Your Email (Optional)
                  </label>
                  <input
                    type="email"
                    value={studentEmail}
                    onChange={(e) => setStudentEmail(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500 transition-colors duration-300"
                    placeholder="your.email@example.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    School/College
                  </label>
                  <input
                    type="text"
                    value={school}
                    onChange={(e) => setSchool(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500 transition-colors duration-300"
                    placeholder="Your school name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Grade/Year
                  </label>
                  <input
                    type="number"
                    value={grade}
                    onChange={(e) => setGrade(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500 transition-colors duration-300"
                    placeholder="Grade level"
                    min="7"
                    max="13"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Age Group Selection */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {ageGroups.map((group) => (
            <Card 
              key={group.value}
              className={`cursor-pointer transition-all duration-300 transform hover:-translate-y-2 border-2 bg-gray-800/50 backdrop-blur ${
                selectedAge === group.value 
                  ? 'border-cyan-400 shadow-2xl shadow-cyan-500/25 scale-105' 
                  : 'border-gray-700 shadow-lg hover:shadow-xl hover:border-gray-600'
              }`}
              onClick={() => setSelectedAge(group.value)}
            >
              <CardContent className="p-8 text-center">
                <div className={`w-20 h-20 bg-gradient-to-br ${group.color} rounded-3xl flex items-center justify-center mx-auto mb-4`}>
                  <span className="text-3xl">{group.emoji}</span>
                </div>
                
                <h3 className="text-2xl font-bold text-white mb-2">{group.label}</h3>
                <p className="text-cyan-400 font-medium mb-2">{group.ageRange}</p>
                <p className="text-gray-300 mb-4">{group.description}</p>
                
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-300">Featured Skills:</p>
                  {group.skills.map((skill, index) => (
                    <Badge key={index} variant="secondary" className="text-xs mr-1 mb-1 bg-gray-700 text-gray-300">
                      {skill}
                    </Badge>
                  ))}
                </div>
                
                {selectedAge === group.value && (
                  <div className="mt-4">
                    <Badge className="bg-cyan-500 text-white">Selected!</Badge>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Interests Selection */}
        <Card className="mb-8 bg-gray-800/50 backdrop-blur border-gray-700">
          <CardContent className="p-8">
            <h3 className="text-2xl font-bold text-white mb-6 text-center">What interests you most?</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {interestOptions.map((interest) => {
                const Icon = interest.icon;
                const isSelected = interests.includes(interest.id);
                return (
                  <button
                    key={interest.id}
                    onClick={() => handleInterestToggle(interest.id)}
                    className={`flex items-center space-x-3 p-4 rounded-lg border-2 transition-all duration-300 ${
                      isSelected 
                        ? 'border-cyan-400 bg-cyan-500/20 text-cyan-400' 
                        : 'border-gray-600 hover:border-gray-500 text-gray-300 hover:text-white'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="text-sm font-medium">{interest.label}</span>
                  </button>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Career Goals */}
        <Card className="mb-12 bg-gray-800/50 backdrop-blur border-gray-700">
          <CardContent className="p-8">
            <h3 className="text-2xl font-bold text-white mb-6 text-center">Career aspirations (select any that interest you)</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
              {careerOptions.map((career) => {
                const isSelected = careerGoals.includes(career);
                return (
                  <button
                    key={career}
                    onClick={() => handleCareerToggle(career)}
                    className={`p-3 rounded-lg text-sm font-medium transition-all duration-300 ${
                      isSelected 
                        ? 'bg-purple-500 text-white' 
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600 hover:text-white'
                    }`}
                  >
                    {career}
                  </button>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Continue Button */}
        <div className="text-center">
          <Button 
            onClick={handleCreateTeenUser}
            disabled={!name || !selectedAge || !parentEmail || isLoading}
            className="bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 text-white font-bold py-4 px-12 rounded-full text-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {isLoading ? 'Setting up your account...' : 'Launch My Tech Journey!'}
          </Button>
        </div>

        {/* Features Preview */}
        <div className="mt-16 grid md:grid-cols-3 gap-6">
          {[
            { icon: "🏗️", title: "Real Projects", desc: "Build actual applications and systems" },
            { icon: "👨‍💻", title: "Expert Mentors", desc: "Learn from industry professionals" },
            { icon: "🏆", title: "Certifications", desc: "Earn recognized tech certifications" }
          ].map((feature, index) => (
            <div key={index} className="text-center">
              <div className="text-4xl mb-3">{feature.icon}</div>
              <h3 className="text-lg font-bold text-white mb-2">{feature.title}</h3>
              <p className="text-gray-400">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TeenSelector;