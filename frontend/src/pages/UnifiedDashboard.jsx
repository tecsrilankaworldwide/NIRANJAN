import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { useUser } from '../App';
import { useToast } from '../hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const UnifiedDashboard = () => {
  const { user, ageLevel } = useUser();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState('overview');

  useEffect(() => {
    if (!user) {
      navigate('/unified-age-selector');
      return;
    }
    
    loadDashboardData();
  }, [user, navigate]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API}/users/${user.id}/dashboard`);
      setDashboardData(response.data);
    } catch (error) {
      console.error('Error loading dashboard:', error);
      toast({
        title: "Error",
        description: "Failed to load dashboard data.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const getAgeLevelInfo = () => {
    const ageLevelData = {
      '4-6': {
        name: 'Little Learners',
        color: 'from-yellow-400 to-orange-500',
        emoji: '🌟',
        description: 'Fun basics for little learners',
        nextLevel: 'Young Explorers (Ages 7-9)'
      },
      '7-9': {
        name: 'Young Explorers',
        color: 'from-blue-500 to-purple-600',
        emoji: '🚀',
        description: 'Building foundational skills',
        nextLevel: 'Smart Kids (Ages 10-12)'
      },
      '10-12': {
        name: 'Smart Kids',
        color: 'from-purple-600 to-pink-600',
        emoji: '⚡',
        description: 'Advanced concepts and challenges',
        nextLevel: 'Tech Teens (Ages 13-15)'
      },
      '13-15': {
        name: 'Tech Teens',
        color: 'from-indigo-600 to-blue-600',
        emoji: '💻',
        description: 'Technology and programming skills',
        nextLevel: 'Future Leaders (Ages 16-18)'
      },
      '16-18': {
        name: 'Future Leaders',
        color: 'from-green-600 to-teal-600',
        emoji: '🎯',
        description: 'Advanced technology and leadership',
        nextLevel: 'Career Ready!'
      }
    };
    
    return ageLevelData[ageLevel] || ageLevelData['4-6'];
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'courses', label: 'My Courses', icon: '📚' },
    { id: 'quizzes', label: 'Quizzes', icon: '🧩' },
    { id: 'progress', label: 'Progress', icon: '📈' },
    { id: 'subscription', label: 'Subscription', icon: '💎' }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center">
        <Card className="p-8">
          <CardContent>
            <p className="text-gray-600">Failed to load dashboard data.</p>
            <Button onClick={loadDashboardData} className="mt-4">
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const levelInfo = getAgeLevelInfo();
  const stats = dashboardData.stats || {};
  const content = dashboardData.content || {};
  const subscription = dashboardData.subscription;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center space-x-4">
              <div className={`w-16 h-16 bg-gradient-to-br ${levelInfo.color} rounded-2xl flex items-center justify-center`}>
                <span className="text-2xl">{levelInfo.emoji}</span>
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-800">
                  Welcome back, {user.name}!
                </h1>
                <p className="text-lg text-gray-600">
                  {levelInfo.name} • {levelInfo.description}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <Badge className={`bg-gradient-to-r ${levelInfo.color} text-white`}>
                Level: {levelInfo.name}
              </Badge>
              {stats.user && (
                <Badge variant="outline" className="text-yellow-600 border-yellow-400">
                  🏆 {stats.user.total_points || 0} Points
                </Badge>
              )}
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex space-x-1 mb-8 bg-white p-1 rounded-lg shadow-md overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedTab(tab.id)}
              className={`flex items-center space-x-2 px-4 py-3 rounded-md font-medium transition-all ${
                selectedTab === tab.id
                  ? 'bg-blue-500 text-white shadow-md'
                  : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
              }`}
            >
              <span>{tab.icon}</span>
              <span className="whitespace-nowrap">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {selectedTab === 'overview' && (
          <div className="space-y-8">
            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <Card>
                <CardContent className="p-6 text-center">
                  <div className="text-3xl mb-2">📚</div>
                  <div className="text-2xl font-bold text-blue-600">
                    {stats.total_courses_completed || 0}
                  </div>
                  <div className="text-sm text-gray-600">Courses Completed</div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6 text-center">
                  <div className="text-3xl mb-2">🧩</div>
                  <div className="text-2xl font-bold text-purple-600">
                    {stats.total_quizzes_completed || 0}
                  </div>
                  <div className="text-sm text-gray-600">Quizzes Taken</div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6 text-center">
                  <div className="text-3xl mb-2">⏱️</div>
                  <div className="text-2xl font-bold text-green-600">
                    {Math.round(stats.total_time_spent_hours || 0)}h
                  </div>
                  <div className="text-sm text-gray-600">Study Time</div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6 text-center">
                  <div className="text-3xl mb-2">🔥</div>
                  <div className="text-2xl font-bold text-orange-600">
                    {stats.current_streak || 0}
                  </div>
                  <div className="text-sm text-gray-600">Day Streak</div>
                </CardContent>
              </Card>
            </div>

            {/* Recommended Content */}
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Recommended Courses */}
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-xl font-bold mb-4 flex items-center">
                    <span className="mr-2">📚</span>
                    Recommended Courses
                  </h2>
                  <div className="space-y-3">
                    {(dashboardData.recommended_courses || []).map((course) => (
                      <div 
                        key={course.id}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                      >
                        <div className="flex items-center space-x-3">
                          <span className="text-2xl">{course.image_emoji}</span>
                          <div>
                            <h3 className="font-medium">{course.title}</h3>
                            <p className="text-sm text-gray-600">
                              {course.category} • {course.duration_minutes} mins
                            </p>
                          </div>
                        </div>
                        <Button size="sm">Start</Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Recommended Quizzes */}
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-xl font-bold mb-4 flex items-center">
                    <span className="mr-2">🧩</span>
                    Recommended Quizzes
                  </h2>
                  <div className="space-y-3">
                    {(dashboardData.recommended_quizzes || []).map((quiz) => (
                      <div 
                        key={quiz.id}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                        onClick={() => navigate(`/quiz/${quiz.id}`)}
                      >
                        <div className="flex items-center space-x-3">
                          <span className="text-2xl">{quiz.image_emoji}</span>
                          <div>
                            <h3 className="font-medium">{quiz.title}</h3>
                            <p className="text-sm text-gray-600">
                              {quiz.category} • {quiz.questions?.length || 0} questions
                            </p>
                          </div>
                        </div>
                        <Button size="sm">Take Quiz</Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {selectedTab === 'courses' && (
          <div>
            <h2 className="text-2xl font-bold mb-6">Available Courses</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {(content.courses || []).map((course) => (
                <Card key={course.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="text-center mb-4">
                      <div className={`w-16 h-16 bg-gradient-to-br ${course.color_gradient} rounded-2xl flex items-center justify-center mx-auto mb-3`}>
                        <span className="text-2xl">{course.image_emoji}</span>
                      </div>
                      <h3 className="text-lg font-bold">{course.title}</h3>
                      <p className="text-sm text-gray-600 mb-2">{course.description}</p>
                      <Badge variant="outline">{course.category}</Badge>
                    </div>
                    
                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between text-sm">
                        <span>Duration:</span>
                        <span>{course.duration_minutes} minutes</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Lessons:</span>
                        <span>{course.total_lessons}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Difficulty:</span>
                        <Badge size="sm" variant="secondary">{course.difficulty}</Badge>
                      </div>
                    </div>
                    
                    <Button className="w-full">Start Course</Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {selectedTab === 'quizzes' && (
          <div>
            <h2 className="text-2xl font-bold mb-6">Available Quizzes</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {(content.quizzes || []).map((quiz) => (
                <Card key={quiz.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="text-center mb-4">
                      <div className={`w-16 h-16 bg-gradient-to-br ${quiz.color_gradient} rounded-2xl flex items-center justify-center mx-auto mb-3`}>
                        <span className="text-2xl">{quiz.image_emoji}</span>
                      </div>
                      <h3 className="text-lg font-bold">{quiz.title}</h3>
                      <p className="text-sm text-gray-600 mb-2">{quiz.description}</p>
                      <Badge variant="outline">{quiz.category}</Badge>
                    </div>
                    
                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between text-sm">
                        <span>Questions:</span>
                        <span>{quiz.questions?.length || 0}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Time Limit:</span>
                        <span>{quiz.time_limit_minutes || 'No limit'} min</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Difficulty:</span>
                        <Badge size="sm" variant="secondary">{quiz.difficulty}</Badge>
                      </div>
                    </div>
                    
                    <Button 
                      className="w-full"
                      onClick={() => navigate(`/quiz/${quiz.id}`)}
                    >
                      Take Quiz
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {selectedTab === 'progress' && (
          <div>
            <h2 className="text-2xl font-bold mb-6">Your Progress</h2>
            
            {/* Progress Overview */}
            <div className="grid md:grid-cols-2 gap-8 mb-8">
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-bold mb-4">Learning Journey</h3>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-2">
                        <span>Overall Progress</span>
                        <span className="font-medium">
                          {Math.round(((stats.total_courses_completed || 0) + (stats.total_quizzes_completed || 0)) * 5)}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full"
                          style={{ width: `${Math.min(100, ((stats.total_courses_completed || 0) + (stats.total_quizzes_completed || 0)) * 5)}%` }}
                        ></div>
                      </div>
                    </div>
                    
                    <div>
                      <p className="text-sm text-gray-600 mb-2">Next Level: {levelInfo.nextLevel}</p>
                      <div className="text-xs text-gray-500">
                        Keep learning to unlock new features!
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-bold mb-4">Achievements</h3>
                  <div className="text-center">
                    <div className="text-4xl mb-2">🏆</div>
                    <div className="text-2xl font-bold text-yellow-600 mb-1">
                      {stats.achievements_count || 0}
                    </div>
                    <div className="text-sm text-gray-600">Achievements Earned</div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-bold mb-4">Recent Quiz Attempts</h3>
                <div className="space-y-3">
                  {(dashboardData.recent_attempts || []).map((attempt) => (
                    <div key={attempt.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <h4 className="font-medium">Quiz Attempt</h4>
                        <p className="text-sm text-gray-600">
                          Score: {attempt.percentage?.toFixed(1)}% • {new Date(attempt.completed_at).toLocaleDateString()}
                        </p>
                      </div>
                      <Badge variant={attempt.passed ? "default" : "destructive"}>
                        {attempt.passed ? "Passed" : "Try Again"}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {selectedTab === 'subscription' && (
          <div>
            <h2 className="text-2xl font-bold mb-6">Subscription & Pricing</h2>
            
            {subscription ? (
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="text-xl font-bold text-green-600">Active Subscription</h3>
                      <p className="text-gray-600">
                        {subscription.subscription_type.charAt(0).toUpperCase() + subscription.subscription_type.slice(1)} Plan
                      </p>
                    </div>
                    <Badge className="bg-green-500">Active</Badge>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium mb-2">Subscription Details</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Plan Type:</span>
                          <span className="capitalize">{subscription.subscription_type}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Start Date:</span>
                          <span>{new Date(subscription.start_date).toLocaleDateString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Next Billing:</span>
                          <span>{new Date(subscription.next_billing_date).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                    
                    {subscription.subscription_type === 'quarterly' && (
                      <div>
                        <h4 className="font-medium mb-2">Workbook Delivery</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span>Next Delivery:</span>
                            <span>
                              {subscription.next_workbook_delivery 
                                ? new Date(subscription.next_workbook_delivery).toLocaleDateString()
                                : 'To be scheduled'
                              }
                            </span>
                          </div>
                          <p className="text-gray-600">
                            Physical learning materials delivered every quarter
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="p-6">
                  <div className="text-center mb-6">
                    <div className="text-4xl mb-4">💎</div>
                    <h3 className="text-xl font-bold mb-2">Unlock Premium Features</h3>
                    <p className="text-gray-600">
                      Get access to unlimited courses, quizzes, and quarterly workbooks!
                    </p>
                  </div>
                  
                  <Button 
                    className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                    onClick={() => navigate('/pricing')}
                  >
                    View Pricing Plans
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default UnifiedDashboard;