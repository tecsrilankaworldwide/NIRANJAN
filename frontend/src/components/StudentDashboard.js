import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/App';
import axios from 'axios';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { BookOpen, Trophy, Clock, Star, Play } from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

export const StudentDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [progress, setProgress] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Fetch courses for student's age group
      const coursesResponse = await axios.get(`${API}/courses`, {
        params: { age_group: user.age_group }
      });
      setCourses(coursesResponse.data);

      // Fetch student's progress
      const progressResponse = await axios.get(`${API}/progress/student/${user.id}`);
      setProgress(progressResponse.data);

      // Fetch dashboard stats
      const statsResponse = await axios.get(`${API}/dashboard/stats`);
      setStats(statsResponse.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getProgressForCourse = (courseId) => {
    const courseProgress = progress.find(p => p.course_id === courseId);
    return courseProgress ? courseProgress.progress_percentage : 0;
  };

  const getCertificatesCount = () => {
    return progress.reduce((total, p) => total + p.certificates_earned.length, 0);
  };

  const getAverageProgress = () => {
    if (progress.length === 0) return 0;
    const totalProgress = progress.reduce((sum, p) => sum + p.progress_percentage, 0);
    return Math.round(totalProgress / progress.length);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8" data-testid="student-dashboard">
      {/* Welcome Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2" data-testid="welcome-message">
          Welcome back, {user.first_name}! 🎉
        </h1>
        <p className="text-lg text-gray-600">
          Ready to continue your coding journey? Let's learn something amazing today!
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card data-testid="courses-enrolled-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Courses Enrolled</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{progress.length}</div>
            <p className="text-xs text-muted-foreground">
              Keep exploring new topics!
            </p>
          </CardContent>
        </Card>
        
        <Card data-testid="certificates-earned-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Certificates Earned</CardTitle>
            <Trophy className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{getCertificatesCount()}</div>
            <p className="text-xs text-muted-foreground">
              Great achievements!
            </p>
          </CardContent>
        </Card>
        
        <Card data-testid="average-progress-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Progress</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{getAverageProgress()}%</div>
            <p className="text-xs text-muted-foreground">
              You're doing amazing!
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Age Group Badge */}
      <div className="mb-6">
        <Badge variant="secondary" className="text-sm" data-testid="age-group-badge">
          Age Group: {user.age_group} years
        </Badge>
      </div>

      {/* Available Courses */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6" data-testid="available-courses-title">
          Available Courses for You
        </h2>
        
        {courses.length === 0 ? (
          <Alert data-testid="no-courses-alert">
            <AlertDescription>
              No courses available for your age group yet. Check back soon for new content!
            </AlertDescription>
          </Alert>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => {
              const courseProgress = getProgressForCourse(course.id);
              const isEnrolled = courseProgress > 0;
              
              return (
                <Card key={course.id} className="hover:shadow-lg transition-shadow" data-testid={`course-card-${course.id}`}>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span className="text-lg">{course.title}</span>
                      <Badge variant={isEnrolled ? "default" : "outline"}>
                        {isEnrolled ? "Enrolled" : "Available"}
                      </Badge>
                    </CardTitle>
                    <CardDescription>{course.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {/* Difficulty Level */}
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-600">Difficulty:</span>
                        <div className="flex space-x-1">
                          {[1, 2, 3, 4, 5].map((level) => (
                            <Star 
                              key={level} 
                              className={`h-4 w-4 ${
                                level <= course.difficulty_level 
                                  ? 'text-yellow-400 fill-current' 
                                  : 'text-gray-300'
                              }`} 
                            />
                          ))}
                        </div>
                      </div>
                      
                      {/* Progress Bar (if enrolled) */}
                      {isEnrolled && (
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Progress</span>
                            <span>{courseProgress}%</span>
                          </div>
                          <Progress value={courseProgress} className="w-full" />
                        </div>
                      )}
                      
                      {/* Action Button */}
                      <Button 
                        className="w-full" 
                        variant={isEnrolled ? "default" : "outline"}
                        data-testid={`course-action-${course.id}`}
                      >
                        <Play className="mr-2 h-4 w-4" />
                        {isEnrolled ? 'Continue Learning' : 'Start Course'}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {/* Recent Activity */}
      {progress.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6" data-testid="recent-activity-title">
            Your Recent Activity
          </h2>
          
          <div className="space-y-4">
            {progress.slice(-5).reverse().map((progressItem) => {
              const course = courses.find(c => c.id === progressItem.course_id);
              
              return (
                <Card key={progressItem.id} data-testid={`activity-item-${progressItem.id}`}>
                  <CardContent className="flex items-center justify-between p-4">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                        <BookOpen className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-medium">{course?.title || 'Unknown Course'}</h3>
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <Clock className="h-4 w-4" />
                          <span>Last accessed: {new Date(progressItem.last_accessed).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="text-lg font-semibold">{progressItem.progress_percentage}%</div>
                      <div className="text-sm text-gray-600">Complete</div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};