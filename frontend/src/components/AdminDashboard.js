import React, { useState, useEffect } from 'react';
import { useAuth } from '@/App';
import axios from 'axios';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Users, 
  BookOpen, 
  UserCheck, 
  GraduationCap, 
  TrendingUp, 
  Settings,
  Search,
  Filter,
  Download,
  Eye,
  Edit,
  Trash2
} from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

export const AdminDashboard = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [courses, setCourses] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [ageGroupFilter, setAgeGroupFilter] = useState('all');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Fetch all users
      const usersResponse = await axios.get(`${API}/users`);
      setUsers(usersResponse.data);

      // Fetch all courses
      const coursesResponse = await axios.get(`${API}/courses`);
      setCourses(coursesResponse.data);

      // Fetch dashboard stats
      const statsResponse = await axios.get(`${API}/dashboard/stats`);
      setStats(statsResponse.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getFilteredUsers = () => {
    return users.filter(user => {
      const matchesSearch = 
        user.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesRole = roleFilter === 'all' || user.role === roleFilter;
      const matchesAgeGroup = ageGroupFilter === 'all' || user.age_group === ageGroupFilter;
      
      return matchesSearch && matchesRole && matchesAgeGroup;
    });
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'admin': return 'bg-red-100 text-red-800';
      case 'teacher': return 'bg-blue-100 text-blue-800';
      case 'parent': return 'bg-green-100 text-green-800';
      case 'student': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-800';
      case 'free': return 'bg-yellow-100 text-yellow-800';
      case 'expired': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8" data-testid="admin-dashboard">
      {/* Welcome Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2" data-testid="welcome-message">
          Admin Dashboard - {user.first_name} {user.last_name} 🔧
        </h1>
        <p className="text-lg text-gray-600">
          Manage users, courses, and platform settings for TecAI Kids.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card data-testid="total-students-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total_students || 0}</div>
            <p className="text-xs text-muted-foreground">
              Registered learners
            </p>
          </CardContent>
        </Card>
        
        <Card data-testid="total-teachers-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Teachers</CardTitle>
            <GraduationCap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total_teachers || 0}</div>
            <p className="text-xs text-muted-foreground">
              Content creators
            </p>
          </CardContent>
        </Card>
        
        <Card data-testid="total-parents-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Parents</CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total_parents || 0}</div>
            <p className="text-xs text-muted-foreground">
              Monitoring progress
            </p>
          </CardContent>
        </Card>
        
        <Card data-testid="total-courses-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Courses</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total_courses || 0}</div>
            <p className="text-xs text-muted-foreground">
              Available content
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="users" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="users" data-testid="users-tab">User Management</TabsTrigger>
          <TabsTrigger value="courses" data-testid="courses-tab">Course Management</TabsTrigger>
          <TabsTrigger value="settings" data-testid="settings-tab">Platform Settings</TabsTrigger>
        </TabsList>
        
        <TabsContent value="users" className="space-y-6">
          {/* User Management */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
            <h2 className="text-2xl font-bold text-gray-900" data-testid="user-management-title">
              User Management
            </h2>
            
            <div className="flex space-x-2">
              <Button variant="outline" size="sm">
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
              <Button size="sm">
                Add User
              </Button>
            </div>
          </div>
          
          {/* Filters */}
          <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-4" data-testid="user-filters">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
                data-testid="user-search"
              />
            </div>
            
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-40" data-testid="role-filter">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="student">Students</SelectItem>
                <SelectItem value="parent">Parents</SelectItem>
                <SelectItem value="teacher">Teachers</SelectItem>
                <SelectItem value="admin">Admins</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={ageGroupFilter} onValueChange={setAgeGroupFilter}>
              <SelectTrigger className="w-40" data-testid="age-group-filter">
                <SelectValue placeholder="Age Group" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Ages</SelectItem>
                <SelectItem value="5-8">5-8 years</SelectItem>
                <SelectItem value="9-12">9-12 years</SelectItem>
                <SelectItem value="13-16">13-16 years</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {/* Users Table */}
          <div className="space-y-4" data-testid="users-list">
            {getFilteredUsers().length === 0 ? (
              <Alert>
                <AlertDescription>
                  No users found matching your criteria.
                </AlertDescription>
              </Alert>
            ) : (
              getFilteredUsers().map((user) => (
                <Card key={user.id} data-testid={`user-card-${user.id}`}>
                  <CardContent className="flex items-center justify-between p-4">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                        <span className="text-gray-600 font-semibold">
                          {user.first_name[0]}{user.last_name[0]}
                        </span>
                      </div>
                      <div>
                        <h3 className="font-medium">{user.first_name} {user.last_name}</h3>
                        <p className="text-sm text-gray-600">{user.email}</p>
                        <div className="flex items-center space-x-2 mt-1">
                          <Badge className={`text-xs ${getRoleColor(user.role)}`}>
                            {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                          </Badge>
                          {user.age_group && (
                            <Badge variant="outline" className="text-xs">
                              Age {user.age_group}
                            </Badge>
                          )}
                          <Badge className={`text-xs ${getStatusColor(user.subscription_status)}`}>
                            {user.subscription_status.charAt(0).toUpperCase() + user.subscription_status.slice(1)}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <div className="text-right mr-4">
                        <div className="text-sm text-gray-600">
                          Joined: {new Date(user.created_at).toLocaleDateString()}
                        </div>
                        <div className="text-xs text-gray-500">
                          Status: {user.is_active ? 'Active' : 'Inactive'}
                        </div>
                      </div>
                      
                      <Button size="sm" variant="outline">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="courses" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-900" data-testid="course-management-title">
              Course Management
            </h2>
            <Button>
              Add Course
            </Button>
          </div>
          
          {courses.length === 0 ? (
            <Alert data-testid="no-courses-alert">
              <AlertDescription>
                No courses have been created yet.
              </AlertDescription>
            </Alert>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" data-testid="courses-grid">
              {courses.map((course) => {
                // Find the teacher who created this course
                const teacher = users.find(u => u.id === course.created_by);
                
                return (
                  <Card key={course.id} className="hover:shadow-lg transition-shadow" data-testid={`course-card-${course.id}`}>
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <span className="text-lg">{course.title}</span>
                        <Badge variant={course.is_active ? "default" : "secondary"}>
                          {course.is_active ? "Active" : "Draft"}
                        </Badge>
                      </CardTitle>
                      <CardDescription>{course.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {/* Teacher Info */}
                        <div className="text-sm">
                          <span className="font-medium">Created by:</span> 
                          {teacher ? `${teacher.first_name} ${teacher.last_name}` : 'Unknown Teacher'}
                        </div>
                        
                        {/* Age Groups */}
                        <div>
                          <div className="text-sm font-medium mb-1">Age Groups:</div>
                          <div className="flex flex-wrap gap-1">
                            {course.age_groups.map((group) => (
                              <Badge key={group} variant="outline" className="text-xs">
                                {group} years
                              </Badge>
                            ))}
                          </div>
                        </div>
                        
                        {/* Creation Date */}
                        <div className="text-xs text-gray-500">
                          Created: {new Date(course.created_at).toLocaleDateString()}
                        </div>
                        
                        {/* Action Buttons */}
                        <div className="flex space-x-2 pt-2">
                          <Button size="sm" variant="outline" className="flex-1">
                            <Eye className="mr-1 h-3 w-3" />
                            View
                          </Button>
                          <Button size="sm" variant="outline" className="flex-1">
                            <Edit className="mr-1 h-3 w-3" />
                            Edit
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="settings" className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-900" data-testid="platform-settings-title">
            Platform Settings
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card data-testid="general-settings-card">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Settings className="h-5 w-5" />
                  <span>General Settings</span>
                </CardTitle>
                <CardDescription>
                  Configure platform-wide settings
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Button variant="outline" className="w-full justify-start">
                    Platform Configuration
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    Email Settings
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    Notification Settings
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            <Card data-testid="payment-settings-card">
              <CardHeader>
                <CardTitle>Payment Settings</CardTitle>
                <CardDescription>
                  Manage subscription and payment options
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Button variant="outline" className="w-full justify-start">
                    Stripe Configuration
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    Subscription Plans
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    Certificate Settings
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};