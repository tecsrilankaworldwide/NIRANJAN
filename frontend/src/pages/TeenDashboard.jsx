import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { useUser } from '../App';
import { Code, Trophy, BookOpen, Users, Calendar, TrendingUp, Zap, Target, Award, ExternalLink } from 'lucide-react';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const TeenDashboard = () => {
  const { user, ageLevel } = useUser();
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user || !user.id.includes('teen') && user.age < 12) {
      navigate('/teen-selector');
      return;
    }
    
    fetchDashboardData();
  }, [user, navigate]);

  const fetchDashboardData = async () => {
    try {
      const response = await axios.get(`${API}/teen/dashboard/${user.id}`);
      setDashboardData(response.data);
    } catch (error) {
      console.error('Error fetching teen dashboard data:', error);
      // Mock data for demo
      setDashboardData({
        user: user,
        enrolled_courses: [
          {
            id: '1',
            title: 'Python Programming Fundamentals',
            category: 'Advanced Coding',
            duration_weeks: 8,
            total_modules: 12,
            color_gradient: 'from-blue-600 to-cyan-600',
            price_lkr: 12500
          },
          {
            id: '2', 
            title: 'Introduction to Robotics & Arduino',
            category: 'Robotics & AI',
            duration_weeks: 10,
            total_modules: 15,
            color_gradient: 'from-green-600 to-teal-600',
            price_lkr: 18500
          }
        ],
        recent_projects: [
          {
            id: '1',
            title: 'Weather App with API Integration',
            project_type: 'Web Application',
            status: 'Completed',
            score: 92,
            technologies_used: ['Python', 'Flask', 'APIs']
          }
        ],
        upcoming_sessions: [
          {
            id: '1',
            topic: 'Career Planning in Tech',
            scheduled_date: new Date(Date.now() + 86400000).toISOString(),
            mentor: { name: 'Supun Dissanayake', company: 'Google' }
          }
        ],
        coding_challenge_stats: {
          solved: 15,
          attempted: 23,
          success_rate: 65,
          ranking: 42
        },
        career_progress: {
          current_path: 'Full-Stack Developer',
          progress_percentage: 45,
          skills_acquired: 8,
          skills_remaining: 12,
          estimated_completion: '6 months'
        },
        certifications: [
          {
            id: '1',
            certification_id: 'python-fundamentals',
            final_score: 88,
            issued_date: new Date().toISOString()
          }
        ],
        portfolio_stats: {
          projects: 3,
          views: 127,
          skills: 8,
          certifications: 1
        }
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return null;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 pt-20 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🚀</div>
          <h2 className="text-2xl font-bold text-white">Loading your tech dashboard...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">
                Welcome back, {user.name}! 👋
              </h1>
              <p className="text-xl text-gray-300">
                Ready to code the future?
              </p>
            </div>
            <Badge className="bg-gradient-to-r from-cyan-500 to-purple-600 text-white px-6 py-2 text-lg">
              {ageLevel} Level
            </Badge>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gray-800/50 backdrop-blur border-gray-700 shadow-2xl">
            <CardContent className="p-6 text-center">
              <Trophy className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">{user.total_points}</div>
              <div className="text-sm text-gray-400">Total Points</div>
            </CardContent>
          </Card>
          
          <Card className="bg-gray-800/50 backdrop-blur border-gray-700 shadow-2xl">
            <CardContent className="p-6 text-center">
              <BookOpen className="w-8 h-8 text-blue-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">{dashboardData?.enrolled_courses?.length || 0}</div>
              <div className="text-sm text-gray-400">Active Courses</div>
            </CardContent>
          </Card>
          
          <Card className="bg-gray-800/50 backdrop-blur border-gray-700 shadow-2xl">
            <CardContent className="p-6 text-center">
              <Code className="w-8 h-8 text-green-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">{dashboardData?.portfolio_stats?.projects || 0}</div>
              <div className="text-sm text-gray-400">Projects</div>
            </CardContent>
          </Card>
          
          <Card className="bg-gray-800/50 backdrop-blur border-gray-700 shadow-2xl">
            <CardContent className="p-6 text-center">
              <Award className="w-8 h-8 text-purple-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">{dashboardData?.certifications?.length || 0}</div>
              <div className="text-sm text-gray-400">Certifications</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Courses & Progress */}
          <div className="lg:col-span-2 space-y-8">
            {/* Active Courses */}
            <Card className="bg-gray-800/50 backdrop-blur border-gray-700 shadow-2xl">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-white">
                  <BookOpen className="w-6 h-6 text-blue-400" />
                  <span>Active Courses</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {dashboardData?.enrolled_courses?.map((course) => (
                    <div key={course.id} className="flex items-center justify-between p-4 bg-gray-700/50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className={`w-12 h-12 bg-gradient-to-br ${course.color_gradient} rounded-xl flex items-center justify-center`}>
                          <Code className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-white">{course.title}</h3>
                          <p className="text-sm text-gray-400">{course.category} • {course.total_modules} modules</p>
                          <div className="flex items-center space-x-2 text-xs text-gray-500">
                            <span>{course.duration_weeks} weeks</span>
                            <span>•</span>
                            <span>LKR {course.price_lkr?.toLocaleString()}</span>
                          </div>
                        </div>
                      </div>
                      <Button 
                        variant="outline"
                        className="border-gray-600 text-gray-300 hover:bg-gray-600"
                      >
                        Continue
                      </Button>
                    </div>
                  ))}
                </div>
                
                <Button 
                  variant="outline" 
                  className="w-full mt-4 border-gray-600 text-gray-300 hover:bg-gray-600"
                  onClick={() => navigate('/teen-courses')}
                >
                  Browse All Courses
                </Button>
              </CardContent>
            </Card>

            {/* Career Progress */}
            <Card className="bg-gray-800/50 backdrop-blur border-gray-700 shadow-2xl">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-white">
                  <Target className="w-6 h-6 text-green-400" />
                  <span>Career Path Progress</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-white font-medium">{dashboardData?.career_progress?.current_path}</span>
                    <span className="text-cyan-400 font-bold">{dashboardData?.career_progress?.progress_percentage}%</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-3">
                    <div 
                      className="bg-gradient-to-r from-green-500 to-cyan-500 h-3 rounded-full transition-all duration-500"
                      style={{ width: `${dashboardData?.career_progress?.progress_percentage}%` }}
                    ></div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-green-400">{dashboardData?.career_progress?.skills_acquired}</div>
                    <div className="text-sm text-gray-400">Skills Acquired</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-orange-400">{dashboardData?.career_progress?.skills_remaining}</div>
                    <div className="text-sm text-gray-400">Skills Remaining</div>
                  </div>
                </div>

                <div className="mt-4 text-center">
                  <p className="text-gray-300">Estimated completion: <span className="text-cyan-400 font-medium">{dashboardData?.career_progress?.estimated_completion}</span></p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Quick Actions & Stats */}
          <div className="space-y-8">
            {/* Coding Challenge Stats */}
            <Card className="bg-gray-800/50 backdrop-blur border-gray-700 shadow-2xl">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-white">
                  <Zap className="w-6 h-6 text-yellow-400" />
                  <span>Coding Challenges</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4 text-center mb-4">
                  <div>
                    <div className="text-2xl font-bold text-green-400">{dashboardData?.coding_challenge_stats?.solved}</div>
                    <div className="text-sm text-gray-400">Solved</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-blue-400">{dashboardData?.coding_challenge_stats?.attempted}</div>
                    <div className="text-sm text-gray-400">Attempted</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-purple-400">{dashboardData?.coding_challenge_stats?.success_rate}%</div>
                    <div className="text-sm text-gray-400">Success Rate</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-orange-400">#{dashboardData?.coding_challenge_stats?.ranking}</div>
                    <div className="text-sm text-gray-400">Ranking</div>
                  </div>
                </div>
                
                <Button 
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700"
                  onClick={() => navigate('/teen-challenges')}
                >
                  Start Challenge
                </Button>
              </CardContent>
            </Card>

            {/* Upcoming Sessions */}
            {dashboardData?.upcoming_sessions && dashboardData.upcoming_sessions.length > 0 && (
              <Card className="bg-gray-800/50 backdrop-blur border-gray-700 shadow-2xl">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 text-white">
                    <Calendar className="w-6 h-6 text-cyan-400" />
                    <span>Upcoming Sessions</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {dashboardData.upcoming_sessions.map((session) => (
                      <div key={session.id} className="p-3 bg-gray-700/50 rounded-lg">
                        <h4 className="font-medium text-white">{session.topic}</h4>
                        <p className="text-sm text-gray-400">with {session.mentor?.name} from {session.mentor?.company}</p>
                        <p className="text-xs text-cyan-400">
                          {new Date(session.scheduled_date).toLocaleDateString()}
                        </p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Portfolio Stats */}
            <Card className="bg-gray-800/50 backdrop-blur border-gray-700 shadow-2xl">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-white">
                  <TrendingUp className="w-6 h-6 text-green-400" />
                  <span>Portfolio</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Projects</span>
                    <span className="text-white font-medium">{dashboardData?.portfolio_stats?.projects}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Profile Views</span>
                    <span className="text-white font-medium">{dashboardData?.portfolio_stats?.views}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Skills</span>
                    <span className="text-white font-medium">{dashboardData?.portfolio_stats?.skills}</span>
                  </div>
                </div>
                
                <Button 
                  variant="outline"
                  className="w-full mt-4 border-gray-600 text-gray-300 hover:bg-gray-600"
                  onClick={() => navigate('/teen-portfolio')}
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  View Portfolio
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Recent Projects */}
        {dashboardData?.recent_projects && dashboardData.recent_projects.length > 0 && (
          <Card className="mt-8 bg-gray-800/50 backdrop-blur border-gray-700 shadow-2xl">
            <CardHeader>
              <CardTitle className="text-white">Recent Projects</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {dashboardData.recent_projects.map((project) => (
                  <div key={project.id} className="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg">
                    <div>
                      <h4 className="font-medium text-white">{project.title}</h4>
                      <p className="text-sm text-gray-400">{project.project_type}</p>
                      <div className="flex items-center space-x-2 text-xs text-gray-500">
                        {project.technologies_used?.map((tech, i) => (
                          <Badge key={i} variant="outline" className="text-xs">
                            {tech}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-white">{project.score}/100</div>
                      <Badge className={project.status === 'Completed' ? 'bg-green-600 text-white' : 'bg-orange-600 text-white'}>
                        {project.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default TeenDashboard;