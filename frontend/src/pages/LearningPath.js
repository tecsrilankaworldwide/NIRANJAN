import React, { useState, useEffect } from 'react';
import { useAuth } from '../App';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

// Enhanced Learning Path Component
const LearningPath = () => {
  const { user, token, getLearningLevel } = useAuth();
  const [learningPath, setLearningPath] = useState(null);
  const [framework, setFramework] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLearningPath = async () => {
      try {
        setLoading(true);
        const [pathResponse, frameworkResponse] = await Promise.all([
          axios.get(`${API}/learning-path`, {
            headers: { Authorization: `Bearer ${token}` }
          }),
          axios.get(`${API}/learning-framework`)
        ]);
        
        setLearningPath(pathResponse.data);
        setFramework(frameworkResponse.data);
      } catch (err) {
        setError('Failed to load learning path');
        console.error('Learning path error:', err);
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchLearningPath();
    }
  }, [token]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your learning journey...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center py-20">
          <div className="text-6xl mb-4">🛠️</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Platform Maintenance</h2>
          <p className="text-gray-600 mb-4">We're making the platform even better for you!</p>
          <p className="text-purple-600 text-sm">Please try again in a moment</p>
        </div>
      </div>
    );
  }

  const levelInfo = learningPath?.framework || {};
  const skillProgress = learningPath?.skill_progress || {};

  const getSkillIcon = (skillKey) => {
    const icons = {
      'ai_literacy': '🤖',
      'logical_thinking': '🧩', 
      'creative_problem_solving': '🎨',
      'future_career_skills': '🚀',
      'systems_thinking': '⚙️',
      'innovation_methods': '💡'
    };
    return icons[skillKey] || '🎯';
  };

  const getSkillName = (skillKey) => {
    const names = {
      'ai_literacy': 'AI Literacy',
      'logical_thinking': 'Logical Thinking',
      'creative_problem_solving': 'Creative Problem Solving', 
      'future_career_skills': 'Future Career Skills',
      'systems_thinking': 'Systems Thinking',
      'innovation_methods': 'Innovation Methods'
    };
    return names[skillKey] || skillKey.replace('_', ' ');
  };

  const overallProgress = Object.values(skillProgress).reduce((sum, val) => sum + val, 0) / Object.values(skillProgress).length || 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 text-white">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <div className="text-6xl mb-6">{levelInfo.icon || '🛤️'}</div>
            <h1 className="text-4xl font-bold mb-4">Your Learning Journey</h1>
            <p className="text-xl text-purple-100 mb-6">{levelInfo.description || 'Personalized path to future success'}</p>
            
            <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 max-w-2xl mx-auto">
              <div className="flex items-center justify-between mb-4">
                <span className="text-lg font-semibold">Overall Progress</span>
                <span className="text-2xl font-bold">{Math.round(overallProgress)}%</span>
              </div>
              <div className="w-full bg-white/30 rounded-full h-4">
                <div 
                  className="bg-gradient-to-r from-yellow-400 to-orange-400 h-4 rounded-full transition-all duration-1000"
                  style={{ width: `${overallProgress}%` }}
                ></div>
              </div>
              <p className="text-sm text-purple-100 mt-2">
                {levelInfo.level_name} • {user?.age_group && `Ages ${user.age_group}`}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* Current Level Overview */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-12 border border-purple-100">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              {levelInfo.icon} {levelInfo.level_name}
            </h2>
            <p className="text-gray-600 text-lg">{levelInfo.description}</p>
          </div>

          {/* Core Skills Progress */}
          <div className="mb-8">
            <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">Your Future-Ready Skills</h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Object.entries(skillProgress).map(([skillKey, progress]) => (
                <div key={skillKey} className="bg-gradient-to-br from-gray-50 to-white p-6 rounded-xl border border-gray-200 hover:shadow-lg transition-shadow">
                  <div className="flex items-center mb-4">
                    <span className="text-3xl mr-3">{getSkillIcon(skillKey)}</span>
                    <div>
                      <h4 className="font-semibold text-gray-800">{getSkillName(skillKey)}</h4>
                      <p className="text-sm text-gray-500">{progress}% Complete</p>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div 
                      className={`h-3 rounded-full transition-all duration-1000 ${
                        progress >= 80 ? 'bg-gradient-to-r from-green-400 to-green-500' :
                        progress >= 50 ? 'bg-gradient-to-r from-yellow-400 to-orange-400' :
                        'bg-gradient-to-r from-blue-400 to-blue-500'
                      }`}
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Future Readiness Areas */}
          {levelInfo.future_readiness && (
            <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-6 rounded-xl border border-indigo-200">
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                <span className="mr-2">🚀</span>
                Future Readiness Development
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                {levelInfo.future_readiness.map((skill, index) => (
                  <div key={index} className="flex items-center p-3 bg-white rounded-lg border border-indigo-100">
                    <span className="w-2 h-2 bg-indigo-500 rounded-full mr-3"></span>
                    <span className="text-gray-700 font-medium">{skill}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Learning Path Navigation */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Current Focus */}
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
              <span className="mr-2">🎯</span>
              Current Focus
            </h3>
            <div className="space-y-4">
              <div className="p-4 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg border border-purple-200">
                <h4 className="font-semibold text-purple-800 mb-2">Continue Learning</h4>
                <p className="text-purple-600 text-sm mb-3">Pick up where you left off</p>
                <button className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium">
                  Resume Journey →
                </button>
              </div>
              
              <div className="p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg border border-blue-200">
                <h4 className="font-semibold text-blue-800 mb-2">Recommended Next</h4>
                <p className="text-blue-600 text-sm mb-3">AI Basics for {getLearningLevel(user?.age_group)}</p>
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
                  Start Course →
                </button>
              </div>
            </div>
          </div>

          {/* Learning Statistics */}
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
              <span className="mr-2">📊</span>
              Learning Stats
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="text-gray-600">Total Learning Time</span>
                <span className="font-bold text-gray-800">{learningPath?.total_learning_time || 0} min</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="text-gray-600">Completed Courses</span>
                <span className="font-bold text-gray-800">{learningPath?.completed_courses?.length || 0}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="text-gray-600">Level Progress</span>
                <span className="font-bold text-gray-800">{Math.round(learningPath?.level_completion_percentage || 0)}%</span>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
              <span className="mr-2">⚡</span>
              Quick Actions
            </h3>
            <div className="space-y-3">
              <a href="/courses" className="block p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg hover:from-green-100 hover:to-emerald-100 transition-colors border border-green-200">
                <div className="flex items-center">
                  <span className="text-xl mr-3">📚</span>
                  <div>
                    <p className="font-medium text-green-800">Browse Courses</p>
                    <p className="text-xs text-green-600">Find new learning adventures</p>
                  </div>
                </div>
              </a>
              
              <a href="/subscription" className="block p-3 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg hover:from-yellow-100 hover:to-orange-100 transition-colors border border-yellow-200">
                <div className="flex items-center">
                  <span className="text-xl mr-3">⭐</span>
                  <div>
                    <p className="font-medium text-yellow-800">Get Premium</p>
                    <p className="text-xs text-yellow-600">Unlock all features</p>
                  </div>
                </div>
              </a>
              
              <button className="w-full p-3 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg hover:from-indigo-100 hover:to-purple-100 transition-colors border border-indigo-200">
                <div className="flex items-center">
                  <span className="text-xl mr-3">🎮</span>
                  <div>
                    <p className="font-medium text-indigo-800">Take Quiz</p>
                    <p className="text-xs text-indigo-600">Test your knowledge</p>
                  </div>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Achievement Section */}
        <div className="mt-12 bg-gradient-to-r from-yellow-100 via-orange-100 to-red-100 rounded-2xl p-8 border border-yellow-200">
          <div className="text-center">
            <div className="text-4xl mb-4">🏆</div>
            <h3 className="text-2xl font-bold text-gray-800 mb-4">Your Future-Ready Journey</h3>
            <p className="text-gray-700 mb-6">
              Every step you take builds skills for tomorrow's world. From AI literacy to creative problem-solving, 
              you're preparing for careers that don't even exist yet!
            </p>
            <div className="flex justify-center space-x-4 text-sm">
              <span className="px-4 py-2 bg-white/60 rounded-full font-medium">🌱 Growing</span>
              <span className="px-4 py-2 bg-white/60 rounded-full font-medium">🧠 Learning</span>
              <span className="px-4 py-2 bg-white/60 rounded-full font-medium">🚀 Future-Ready</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LearningPath;