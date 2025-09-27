import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/App';
import axios from 'axios';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BookOpen, 
  Play, 
  CheckCircle, 
  Clock, 
  Award, 
  ArrowLeft,
  Code,
  FileText,
  HelpCircle,
  Target
} from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

export const CourseDetailPage = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [course, setCourse] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [progress, setProgress] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentLessonId, setCurrentLessonId] = useState(null);

  useEffect(() => {
    fetchCourseData();
  }, [courseId]);

  const fetchCourseData = async () => {
    try {
      // Fetch course details
      const courseResponse = await axios.get(`${API}/courses/${courseId}`);
      setCourse(courseResponse.data);

      // Fetch course lessons
      const lessonsResponse = await axios.get(`${API}/courses/${courseId}/lessons`);
      setLessons(lessonsResponse.data);

      // Fetch progress for students
      if (user.role === 'student') {
        const progressResponse = await axios.get(`${API}/courses/${courseId}/progress`);
        setProgress(progressResponse.data);
      }
    } catch (error) {
      console.error('Error fetching course data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getLessonProgress = (lessonId) => {
    return progress.find(p => p.lesson_id === lessonId);
  };

  const getCompletedLessonsCount = () => {
    return progress.filter(p => p.completed).length;
  };

  const getTotalPoints = () => {
    return progress.reduce((total, p) => total + (p.completed ? lessons.find(l => l.id === p.lesson_id)?.points || 0 : 0), 0);
  };

  const getOverallProgress = () => {
    if (lessons.length === 0) return 0;
    return Math.round((getCompletedLessonsCount() / lessons.length) * 100);
  };

  const getLessonIcon = (lessonType) => {
    switch (lessonType) {
      case 'tutorial': return <FileText className="h-5 w-5" />;
      case 'coding': return <Code className="h-5 w-5" />;
      case 'quiz': return <HelpCircle className="h-5 w-5" />;
      case 'challenge': return <Target className="h-5 w-5" />;
      default: return <BookOpen className="h-5 w-5" />;
    }
  };

  const getLessonTypeColor = (lessonType) => {
    switch (lessonType) {
      case 'tutorial': return 'bg-blue-100 text-blue-800';
      case 'coding': return 'bg-green-100 text-green-800';
      case 'quiz': return 'bg-purple-100 text-purple-800';
      case 'challenge': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const startLesson = (lessonId) => {
    navigate(`/courses/${courseId}/lessons/${lessonId}`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert>
          <AlertDescription>Course not found.</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8" data-testid="course-detail-page">
      {/* Back Button */}
      <Button 
        variant="ghost" 
        onClick={() => navigate(-1)}
        className="mb-6"
        data-testid="back-button"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back
      </Button>

      {/* Course Header */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row justify-between items-start mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2" data-testid="course-title">
              {course.title}
            </h1>
            <p className="text-lg text-gray-600 mb-4">{course.description}</p>
            
            <div className="flex flex-wrap gap-2 mb-4">
              {course.age_groups.map((group) => (
                <Badge key={group} variant="outline">
                  Age {group}
                </Badge>
              ))}
              <Badge className={getLessonTypeColor('tutorial')}>
                Difficulty: {'⭐'.repeat(course.difficulty_level)}
              </Badge>
            </div>
          </div>
        </div>

        {/* Progress Overview for Students */}
        {user.role === 'student' && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card data-testid="progress-overview">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold mb-2">{getOverallProgress()}%</div>
                <Progress value={getOverallProgress()} className="w-full" />
              </CardContent>
            </Card>
            
            <Card data-testid="completed-lessons">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Completed</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{getCompletedLessonsCount()}/{lessons.length}</div>
                <p className="text-xs text-gray-600">Lessons</p>
              </CardContent>
            </Card>
            
            <Card data-testid="total-points">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Points Earned</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-yellow-600">{getTotalPoints()}</div>
                <p className="text-xs text-gray-600">Total Points</p>
              </CardContent>
            </Card>
            
            <Card data-testid="estimated-time">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Time Remaining</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {lessons.reduce((total, lesson) => {
                    const lessonProgress = getLessonProgress(lesson.id);
                    return lessonProgress?.completed ? total : total + lesson.estimated_duration;
                  }, 0)}
                </div>
                <p className="text-xs text-gray-600">Minutes</p>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      <Tabs defaultValue="lessons" className="w-full">
        <TabsList>
          <TabsTrigger value="lessons" data-testid="lessons-tab">Lessons</TabsTrigger>
          <TabsTrigger value="overview" data-testid="overview-tab">Overview</TabsTrigger>
        </TabsList>
        
        <TabsContent value="lessons" className="space-y-4">
          <h2 className="text-2xl font-bold mb-6" data-testid="lessons-title">
            Course Lessons ({lessons.length})
          </h2>
          
          {lessons.length === 0 ? (
            <Alert data-testid="no-lessons-alert">
              <AlertDescription>
                No lessons have been added to this course yet.
              </AlertDescription>
            </Alert>
          ) : (
            <div className="space-y-4">
              {lessons.map((lesson, index) => {
                const lessonProgress = getLessonProgress(lesson.id);
                const isCompleted = lessonProgress?.completed || false;
                const canStart = index === 0 || getLessonProgress(lessons[index - 1]?.id)?.completed;
                
                return (
                  <Card 
                    key={lesson.id} 
                    className={`transition-all duration-200 ${
                      isCompleted 
                        ? 'border-green-200 bg-green-50' 
                        : canStart 
                        ? 'hover:shadow-md' 
                        : 'opacity-60'
                    }`}
                    data-testid={`lesson-card-${lesson.id}`}
                  >
                    <CardContent className="flex items-center justify-between p-6">
                      <div className="flex items-center space-x-4 flex-1">
                        <div className={`p-2 rounded-lg ${
                          isCompleted 
                            ? 'bg-green-100 text-green-600'
                            : canStart
                            ? 'bg-blue-100 text-blue-600'
                            : 'bg-gray-100 text-gray-400'
                        }`}>
                          {isCompleted ? (
                            <CheckCircle className="h-5 w-5" />
                          ) : (
                            getLessonIcon(lesson.lesson_type)
                          )}
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <h3 className="font-medium text-lg">{lesson.title}</h3>
                            <Badge className={getLessonTypeColor(lesson.lesson_type)}>
                              {lesson.lesson_type.charAt(0).toUpperCase() + lesson.lesson_type.slice(1)}
                            </Badge>
                          </div>
                          <p className="text-gray-600 text-sm mb-2">{lesson.description}</p>
                          
                          <div className="flex items-center space-x-4 text-xs text-gray-500">
                            <div className="flex items-center space-x-1">
                              <Clock className="h-3 w-3" />
                              <span>{lesson.estimated_duration} min</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Award className="h-3 w-3" />
                              <span>{lesson.points} points</span>
                            </div>
                            {lessonProgress && (
                              <div className="flex items-center space-x-1">
                                <span>Attempts: {lessonProgress.attempts || 0}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        {isCompleted && (
                          <Badge variant="outline" className="text-green-600 border-green-600">
                            ✓ Completed
                          </Badge>
                        )}
                        
                        <Button 
                          onClick={() => startLesson(lesson.id)}
                          disabled={!canStart && user.role === 'student'}
                          variant={isCompleted ? "outline" : "default"}
                          data-testid={`start-lesson-${lesson.id}`}
                        >
                          <Play className="mr-2 h-4 w-4" />
                          {isCompleted ? 'Review' : canStart ? 'Start' : 'Locked'}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card data-testid="course-stats">
              <CardHeader>
                <CardTitle>Course Statistics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span>Total Lessons:</span>
                    <span className="font-medium">{lessons.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Estimated Duration:</span>
                    <span className="font-medium">
                      {lessons.reduce((total, lesson) => total + lesson.estimated_duration, 0)} minutes
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total Points:</span>
                    <span className="font-medium">
                      {lessons.reduce((total, lesson) => total + lesson.points, 0)} points
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Difficulty Level:</span>
                    <span className="font-medium">{'⭐'.repeat(course.difficulty_level)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card data-testid="lesson-types">
              <CardHeader>
                <CardTitle>Lesson Types</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {['tutorial', 'coding', 'quiz', 'challenge'].map((type) => {
                    const count = lessons.filter(l => l.lesson_type === type).length;
                    if (count === 0) return null;
                    
                    return (
                      <div key={type} className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          {getLessonIcon(type)}
                          <span className="capitalize">{type}</span>
                        </div>
                        <Badge variant="outline">{count}</Badge>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};