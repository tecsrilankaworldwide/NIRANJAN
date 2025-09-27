import React, { useState, useEffect } from 'react';
import { useAuth } from '@/App';
import axios from 'axios';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BookOpen, Users, Plus, Edit, Trash2, Eye, Star } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

export const TeacherDashboard = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [courses, setCourses] = useState([]);
  const [students, setStudents] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [createCourseOpen, setCreateCourseOpen] = useState(false);
  const [courseForm, setCourseForm] = useState({
    title: '',
    description: '',
    age_groups: [],
    difficulty_level: 1
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Fetch all courses (filter by created_by on frontend)
      const coursesResponse = await axios.get(`${API}/courses`);
      const myCourses = coursesResponse.data.filter(course => course.created_by === user.id);
      setCourses(myCourses);

      // Fetch all students
      const studentsResponse = await axios.get(`${API}/users/students`);
      setStudents(studentsResponse.data);

      // Fetch dashboard stats
      const statsResponse = await axios.get(`${API}/dashboard/stats`);
      setStats(statsResponse.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCourse = async (e) => {
    e.preventDefault();
    
    if (courseForm.age_groups.length === 0) {
      toast({
        title: "Error",
        description: "Please select at least one age group",
        variant: "destructive"
      });
      return;
    }

    try {
      const response = await axios.post(`${API}/courses`, courseForm);
      setCourses([...courses, response.data]);
      setCreateCourseOpen(false);
      setCourseForm({
        title: '',
        description: '',
        age_groups: [],
        difficulty_level: 1
      });
      
      toast({
        title: "Success",
        description: "Course created successfully!"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error.response?.data?.detail || "Failed to create course",
        variant: "destructive"
      });
    }
  };

  const handleAgeGroupChange = (ageGroup, checked) => {
    if (checked) {
      setCourseForm({
        ...courseForm,
        age_groups: [...courseForm.age_groups, ageGroup]
      });
    } else {
      setCourseForm({
        ...courseForm,
        age_groups: courseForm.age_groups.filter(ag => ag !== ageGroup)
      });
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
    <div className="container mx-auto px-4 py-8" data-testid="teacher-dashboard">
      {/* Welcome Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2" data-testid="welcome-message">
          Teacher Portal - {user.first_name} {user.last_name} 🎓
        </h1>
        <p className="text-lg text-gray-600">
          Create and manage educational content for your students.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card data-testid="my-courses-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">My Courses</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{courses.length}</div>
            <p className="text-xs text-muted-foreground">
              Courses you've created
            </p>
          </CardContent>
        </Card>
        
        <Card data-testid="total-students-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total_students || 0}</div>
            <p className="text-xs text-muted-foreground">
              Registered students
            </p>
          </CardContent>
        </Card>
        
        <Card data-testid="active-courses-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Courses</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{courses.filter(c => c.is_active).length}</div>
            <p className="text-xs text-muted-foreground">
              Currently available
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="courses" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="courses" data-testid="courses-tab">My Courses</TabsTrigger>
          <TabsTrigger value="students" data-testid="students-tab">Students</TabsTrigger>
        </TabsList>
        
        <TabsContent value="courses" className="space-y-6">
          {/* Course Management */}
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-900" data-testid="my-courses-title">
              My Courses
            </h2>
            
            <Dialog open={createCourseOpen} onOpenChange={setCreateCourseOpen}>
              <DialogTrigger asChild>
                <Button data-testid="create-course-btn">
                  <Plus className="mr-2 h-4 w-4" />
                  Create Course
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]" data-testid="create-course-dialog">
                <DialogHeader>
                  <DialogTitle>Create New Course</DialogTitle>
                  <DialogDescription>
                    Add a new educational course for students.
                  </DialogDescription>
                </DialogHeader>
                
                <form onSubmit={handleCreateCourse} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Course Title</Label>
                    <Input
                      id="title"
                      value={courseForm.title}
                      onChange={(e) => setCourseForm({...courseForm, title: e.target.value})}
                      placeholder="Enter course title"
                      required
                      data-testid="course-title-input"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={courseForm.description}
                      onChange={(e) => setCourseForm({...courseForm, description: e.target.value})}
                      placeholder="Describe what students will learn"
                      required
                      data-testid="course-description-input"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Age Groups</Label>
                    <div className="space-y-2">
                      {['5-8', '9-12', '13-16'].map((ageGroup) => (
                        <div key={ageGroup} className="flex items-center space-x-2">
                          <Checkbox
                            id={ageGroup}
                            checked={courseForm.age_groups.includes(ageGroup)}
                            onCheckedChange={(checked) => handleAgeGroupChange(ageGroup, checked)}
                            data-testid={`age-group-${ageGroup}`}
                          />
                          <Label htmlFor={ageGroup} className="text-sm">
                            {ageGroup} years
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Difficulty Level</Label>
                    <Select 
                      value={courseForm.difficulty_level.toString()} 
                      onValueChange={(value) => setCourseForm({...courseForm, difficulty_level: parseInt(value)})}
                    >
                      <SelectTrigger data-testid="difficulty-select">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {[1, 2, 3, 4, 5].map((level) => (
                          <SelectItem key={level} value={level.toString()}>
                            Level {level} {'★'.repeat(level)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="flex justify-end space-x-2">
                    <Button type="button" variant="outline" onClick={() => setCreateCourseOpen(false)}>
                      Cancel
                    </Button>
                    <Button type="submit" data-testid="create-course-submit">
                      Create Course
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
          
          {/* Courses Grid */}
          {courses.length === 0 ? (
            <Alert data-testid="no-courses-alert">
              <AlertDescription>
                You haven't created any courses yet. Click "Create Course" to get started!
              </AlertDescription>
            </Alert>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map((course) => (
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
                    <div className="space-y-4">
                      {/* Age Groups */}
                      <div>
                        <div className="text-sm font-medium mb-2">Age Groups:</div>
                        <div className="flex flex-wrap gap-1">
                          {course.age_groups.map((group) => (
                            <Badge key={group} variant="outline" className="text-xs">
                              {group} years
                            </Badge>
                          ))}
                        </div>
                      </div>
                      
                      {/* Difficulty Level */}
                      <div className="flex items-center justify-between">
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
                      
                      {/* Action Buttons */}
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline" className="flex-1">
                          <Edit className="mr-1 h-3 w-3" />
                          Edit
                        </Button>
                        <Button size="sm" variant="outline" className="flex-1">
                          <Eye className="mr-1 h-3 w-3" />
                          View
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="students" className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-900" data-testid="students-title">
            Registered Students
          </h2>
          
          {students.length === 0 ? (
            <Alert data-testid="no-students-alert">
              <AlertDescription>
                No students have registered yet.
              </AlertDescription>
            </Alert>
          ) : (
            <div className="space-y-4">
              {students.map((student) => (
                <Card key={student.id} data-testid={`student-card-${student.id}`}>
                  <CardContent className="flex items-center justify-between p-4">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-blue-600 font-semibold">
                          {student.first_name[0]}{student.last_name[0]}
                        </span>
                      </div>
                      <div>
                        <h3 className="font-medium">{student.first_name} {student.last_name}</h3>
                        <p className="text-sm text-gray-600">{student.email}</p>
                        <div className="flex items-center space-x-2 mt-1">
                          <Badge variant="secondary" className="text-xs">
                            Age {student.age_group}
                          </Badge>
                          <Badge variant={student.subscription_status === 'paid' ? 'default' : 'outline'} className="text-xs">
                            {student.subscription_status === 'paid' ? 'Premium' : 'Free'}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="text-sm text-gray-600 mb-1">
                        Joined: {new Date(student.created_at).toLocaleDateString()}
                      </div>
                      <Button size="sm" variant="outline">
                        View Progress
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};