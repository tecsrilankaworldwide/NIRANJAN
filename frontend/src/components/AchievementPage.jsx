import React, { useState, useEffect } from 'react';
import { useAuth } from '../App';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const AchievementPage = () => {
  const { user, token } = useAuth();
  const [achievements, setAchievements] = useState([]);
  const [userAchievements, setUserAchievements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalPoints, setTotalPoints] = useState(0);

  useEffect(() => {
    const loadAchievements = async () => {
      try {
        const [allAchievementsRes, userAchievementsRes] = await Promise.all([
          axios.get(`${API}/achievements`),
          axios.get(`${API}/achievements/user`, {
            headers: { Authorization: `Bearer ${token}` }
          })
        ]);
        
        setAchievements(allAchievementsRes.data);
        setUserAchievements(userAchievementsRes.data);
        
        const points = userAchievementsRes.data.reduce((sum, ach) => sum + (ach.points || 0), 0);
        setTotalPoints(points);
      } catch (error) {
        console.error('Failed to load achievements:', error);
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      loadAchievements();
    }
  }, [token]);

  const isEarned = (achievementId) => {
    return userAchievements.some(ua => ua.id === achievementId);
  };

  const getAchievementProgress = (achievement) => {
    const earned = userAchievements.find(ua => ua.id === achievement.id);
    return earned ? 100 : 0;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-pulse space-y-4 w-full max-w-4xl">
          <div className="h-8 bg-gray-300 rounded w-1/3 mx-auto"></div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1,2,3,4,5,6].map(i => (
              <div key={i} className="h-48 bg-gray-300 rounded-xl"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">🏆 Achievement Center</h1>
          <p className="text-xl text-gray-600 mb-6">Track your learning milestones and celebrate your progress!</p>
          
          {/* Stats */}
          <div className="grid md:grid-cols-3 gap-6 mb-8 max-w-2xl mx-auto">
            <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-yellow-500">
              <div className="text-center">
                <div className="text-3xl font-bold text-yellow-600">{userAchievements.length}</div>
                <div className="text-sm text-gray-600">Achievements Earned</div>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-purple-500">
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600">{totalPoints}</div>
                <div className="text-sm text-gray-600">Total Points</div>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">{Math.round((userAchievements.length / achievements.length) * 100)}%</div>
                <div className="text-sm text-gray-600">Completion Rate</div>
              </div>
            </div>
          </div>
        </div>

        {/* Achievement Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {achievements.map(achievement => {
            const earned = isEarned(achievement.id);
            const earnedData = userAchievements.find(ua => ua.id === achievement.id);
            
            return (
              <div
                key={achievement.id}
                className={`bg-white rounded-2xl shadow-lg overflow-hidden border-2 transition-all duration-300 ${
                  earned 
                    ? 'border-yellow-400 ring-4 ring-yellow-100 transform hover:-translate-y-1' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className={`p-6 ${earned ? 'bg-gradient-to-br from-yellow-50 to-orange-50' : 'bg-gray-50'}`}>
                  <div className="text-center mb-4">
                    <div className={`text-6xl mb-3 ${earned ? 'filter-none' : 'filter grayscale opacity-50'}`}>
                      {achievement.icon}
                    </div>
                    <h3 className={`text-xl font-bold mb-2 ${earned ? 'text-gray-800' : 'text-gray-500'}`}>
                      {achievement.title}
                    </h3>
                    <p className={`text-sm ${earned ? 'text-gray-600' : 'text-gray-400'}`}>
                      {achievement.description}
                    </p>
                  </div>

                  {/* Progress/Status */}
                  <div className="space-y-3">
                    <div className={`flex items-center justify-between text-sm ${earned ? 'text-gray-700' : 'text-gray-500'}`}>
                      <span>Points:</span>
                      <span className="font-bold">{achievement.points}</span>
                    </div>
                    
                    {earned ? (
                      <div className="bg-green-100 text-green-800 px-3 py-2 rounded-lg text-center font-medium">
                        <div className="flex items-center justify-center">
                          <span className="mr-2">✅</span>
                          Earned {earnedData && new Date(earnedData.earned_at).toLocaleDateString()}
                        </div>
                      </div>
                    ) : (
                      <div className="bg-gray-100 text-gray-600 px-3 py-2 rounded-lg text-center font-medium">
                        <div className="flex items-center justify-center">
                          <span className="mr-2">⏳</span>
                          Not Yet Earned
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Achievement Tips */}
        <div className="mt-12 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl p-8">
          <h3 className="text-2xl font-bold mb-4 text-center">🎯 How to Earn Achievements</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-3 text-lg">🧩 Workout Achievements</h4>
              <ul className="space-y-2 text-blue-100">
                <li>• Complete your first workout to get started</li>
                <li>• Solve workouts quickly for speed bonuses</li>
                <li>• Try not to use hints for independence points</li>
                <li>• Challenge yourself with harder difficulties</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3 text-lg">📈 Progress Achievements</h4>
              <ul className="space-y-2 text-blue-100">
                <li>• Practice daily to build learning streaks</li>
                <li>• Aim for perfect scores on multiple workouts</li>
                <li>• Explore different skill areas and workout types</li>
                <li>• Keep learning consistently to unlock milestones</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AchievementPage;