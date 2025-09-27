import React, { useState, useEffect } from 'react';
import { useAuth } from '@/App';
import axios from 'axios';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Users, BookOpen, Trophy, TrendingUp, Clock, User } from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

export const ParentDashboard = () => {
  const { user } = useAuth();
  const [children, setChildren] = useState([]);
  const [childrenProgress, setChildrenProgress] = useState({});
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Fetch children linked to this parent
      const childrenResponse = await axios.get(`${API}/users/students`);
      setChildren(childrenResponse.data);

      // Fetch progress for each child
      const progressPromises = childrenResponse.data.map(child => 
        axios.get(`${API}/progress/student/${child.id}`)
      );
      
      const progressResponses = await Promise.all(progressPromises);
      const progressData = {};
      
      childrenResponse.data.forEach((child, index) => {
        progressData[child.id] = progressResponses[index].data;
      });
      
      setChildrenProgress(progressData);

      // Fetch dashboard stats
      const statsResponse = await axios.get(`${API}/dashboard/stats`);
      setStats(statsResponse.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getChildProgress = (childId) => {
    const progress = childrenProgress[childId] || [];
    if (progress.length === 0) return 0;
    const totalProgress = progress.reduce((sum, p) => sum + p.progress_percentage, 0);
    return Math.round(totalProgress / progress.length);
  };

  const getChildCertificates = (childId) => {
    const progress = childrenProgress[childId] || [];
    return progress.reduce((total, p) => total + p.certificates_earned.length, 0);
  };

  const getChildCoursesCount = (childId) => {
    return childrenProgress[childId]?.length || 0;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8" data-testid="parent-dashboard">
      {/* Welcome Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2" data-testid="welcome-message">
          Hello, {user.first_name}! 👋
        </h1>
        <p className="text-lg text-gray-600">
          Track your children's learning progress and achievements on TecAI Kids.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card data-testid="children-count-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">My Children</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{children.length}</div>
            <p className="text-xs text-muted-foreground">
              Registered on platform
            </p>
          </CardContent>
        </Card>
        
        <Card data-testid="total-courses-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Courses</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {children.reduce((total, child) => total + getChildCoursesCount(child.id), 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              Across all children
            </p>
          </CardContent>
        </Card>
        
        <Card data-testid="total-certificates-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Certificates</CardTitle>
            <Trophy className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {children.reduce((total, child) => total + getChildCertificates(child.id), 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              Family achievements!
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Children Overview */}
      {children.length === 0 ? (
        <Alert data-testid="no-children-alert">
          <AlertDescription>
            No children are linked to your account yet. Students can link their accounts to yours during registration by entering your email address.
          </AlertDescription>
        </Alert>
      ) : (
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="overview" data-testid="overview-tab">Overview</TabsTrigger>
            <TabsTrigger value="detailed" data-testid="detailed-tab">Detailed Progress</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6" data-testid="children-overview-title">
              Children Overview
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {children.map((child) => {
                const avgProgress = getChildProgress(child.id);
                const certificates = getChildCertificates(child.id);
                const coursesCount = getChildCoursesCount(child.id);
                
                return (
                  <Card key={child.id} className="hover:shadow-lg transition-shadow" data-testid={`child-card-${child.id}`}>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <User className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <div className="font-medium">{child.first_name} {child.last_name}</div>
                          <Badge variant="secondary" className="text-xs">
                            Age {child.age_group}
                          </Badge>
                        </div>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {/* Progress Summary */}
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Overall Progress</span>
                            <span>{avgProgress}%</span>
                          </div>
                          <Progress value={avgProgress} className="w-full" />
                        </div>
                        
                        {/* Stats */}
                        <div className="grid grid-cols-2 gap-4 text-center">
                          <div>
                            <div className="text-lg font-bold text-blue-600">{coursesCount}</div>
                            <div className="text-xs text-gray-600">Courses</div>
                          </div>
                          <div>
                            <div className="text-lg font-bold text-yellow-600">{certificates}</div>
                            <div className="text-xs text-gray-600">Certificates</div>
                          </div>
                        </div>
                        
                        {/* Status */}
                        <div className="flex items-center justify-between pt-2 border-t">
                          <span className="text-sm text-gray-600">Status:</span>
                          <Badge variant={child.subscription_status === 'paid' ? 'default' : 'secondary'}>
                            {child.subscription_status === 'paid' ? 'Premium' : 'Free'}
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>
          
          <TabsContent value="detailed" className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6" data-testid="detailed-progress-title">
              Detailed Progress Report
            </h2>
            
            {children.map((child) => {
              const progress = childrenProgress[child.id] || [];
              
              return (
                <Card key={child.id} data-testid={`detailed-card-${child.id}`}>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>{child.first_name} {child.last_name}</span>
                      <Badge variant="outline">Age {child.age_group}</Badge>
                    </CardTitle>
                    <CardDescription>
                      Detailed learning progress and activity
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {progress.length === 0 ? (
                      <Alert>
                        <AlertDescription>
                          {child.first_name} hasn't started any courses yet.
                        </AlertDescription>
                      </Alert>
                    ) : (
                      <div className="space-y-4">
                        {progress.map((progressItem) => (
                          <div key={progressItem.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center space-x-3">
                              <BookOpen className="h-5 w-5 text-blue-600" />
                              <div>
                                <div className="font-medium">Course Progress</div>
                                <div className="flex items-center space-x-2 text-sm text-gray-600">
                                  <Clock className="h-4 w-4" />
                                  <span>Last accessed: {new Date(progressItem.last_accessed).toLocaleDateString()}</span>
                                </div>
                              </div>
                            </div>
                            
                            <div className="text-right">
                              <div className="text-lg font-semibold">{progressItem.progress_percentage}%</div>
                              <div className="text-sm text-gray-600">
                                {progressItem.certificates_earned.length} certificates
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
};
