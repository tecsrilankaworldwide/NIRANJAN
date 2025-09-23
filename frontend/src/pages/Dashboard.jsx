import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { useUser } from '../App';
import { Star, Clock, Trophy, Play, BookOpen, Brain } from 'lucide-react';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const Dashboard = () => {
  const { user, ageLevel } = useUser();
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/age-selector');
      return;
    }
    
    fetchDashboardData();
  }, [user, navigate]);

  const fetchDashboardData = async () => {
    try {
      const response = await axios.get(`${API}/dashboard/${user.id}`);
      setDashboardData(response.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const startQuiz = (quizId) => {
    navigate(`/quiz/${quizId}`);
  };

  if (!user) {
    return null;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 pt-20 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🎮</div>
          <h2 className="text-2xl font-bold text-gray-800">Loading your dashboard...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Welcome back, {user.name}! 👋
          </h1>
          <p className="text-xl text-gray-600">
            Ready for another exciting learning adventure?
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
          <Card className="shadow-lg border-0">
            <CardContent className="p-6 text-center">
              <Trophy className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-800">{user.total_points}</div>
              <div className="text-sm text-gray-600">Total Points</div>
            </CardContent>
          </Card>
          
          <Card className="shadow-lg border-0">
            <CardContent className="p-6 text-center">
              <BookOpen className="w-8 h-8 text-blue-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-800">
                {dashboardData?.stats?.total_courses_completed || 0}
              </div>
              <div className="text-sm text-gray-600">Courses</div>
            </CardContent>
          </Card>
          
          <Card className="shadow-lg border-0">
            <CardContent className="p-6 text-center">
              <Brain className="w-8 h-8 text-purple-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-800">
                {dashboardData?.stats?.total_quizzes_completed || 0}
              </div>
              <div className="text-sm text-gray-600">Quizzes</div>
            </CardContent>
          </Card>
          
          <Card className="shadow-lg border-0">
            <CardContent className="p-6 text-center">
              <Star className="w-8 h-8 text-green-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-800">{user.streak_days}</div>
              <div className="text-sm text-gray-600">Day Streak</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Recommended Quizzes */}
          <Card className="shadow-xl border-0">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Brain className="w-6 h-6 text-purple-600" />
                <span>Recommended Quizzes</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {dashboardData?.recommended_quizzes?.map((quiz) => (
                  <div key={quiz.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className={`w-12 h-12 bg-gradient-to-br ${quiz.color_gradient} rounded-xl flex items-center justify-center`}>
                        <span className="text-2xl">{quiz.image_emoji}</span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-800">{quiz.title}</h3>
                        <p className="text-sm text-gray-600">{quiz.category} • {quiz.difficulty}</p>
                        <div className="flex items-center space-x-1 text-xs text-gray-500">
                          <Clock className="w-3 h-3" />
                          <span>{quiz.time_limit_minutes || 15} mins</span>
                        </div>
                      </div>
                    </div>
                    <Button 
                      onClick={() => startQuiz(quiz.id)}
                      className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700"
                    >
                      <Play className="w-4 h-4 mr-1" />
                      Start
                    </Button>
                  </div>
                ))}
              </div>
              
              <Button 
                variant="outline" 
                className="w-full mt-4"
                onClick={() => navigate('/activities')}
              >
                View All Quizzes
              </Button>
            </CardContent>
          </Card>

          {/* Recommended Courses */}
          <Card className="shadow-xl border-0">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BookOpen className="w-6 h-6 text-blue-600" />
                <span>Continue Learning</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {dashboardData?.recommended_courses?.map((course) => (
                  <div key={course.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className={`w-12 h-12 bg-gradient-to-br ${course.color_gradient} rounded-xl flex items-center justify-center`}>
                        <span className="text-2xl">{course.image_emoji}</span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-800">{course.title}</h3>
                        <p className="text-sm text-gray-600">{course.category} • {course.total_lessons} lessons</p>
                        <div className="flex items-center space-x-1 text-xs text-gray-500">
                          <Clock className="w-3 h-3" />
                          <span>{course.duration_minutes} mins</span>
                        </div>
                      </div>
                    </div>
                    <Button 
                      variant="outline"
                      onClick={() => navigate('/courses')}
                    >
                      Continue
                    </Button>
                  </div>
                ))}
              </div>
              
              <Button 
                variant="outline" 
                className="w-full mt-4"
                onClick={() => navigate('/courses')}
              >
                Browse All Courses
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        {dashboardData?.recent_attempts && dashboardData.recent_attempts.length > 0 && (
          <Card className="mt-8 shadow-xl border-0">
            <CardHeader>
              <CardTitle>Recent Quiz Results</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {dashboardData.recent_attempts.map((attempt) => (
                  <div key={attempt.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <h4 className="font-medium text-gray-800">Quiz Completed</h4>
                      <p className="text-sm text-gray-600">Score: {attempt.percentage.toFixed(1)}%</p>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-gray-800">{attempt.score} pts</div>
                      <Badge className={attempt.passed ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}>
                        {attempt.passed ? 'Passed' : 'Try Again'}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Age Level Badge */}
        <div className="mt-8 text-center">
          <Badge className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-2 text-lg">
            {ageLevel} Learning Level
          </Badge>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;