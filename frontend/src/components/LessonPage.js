import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/App';
import axios from 'axios';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { 
  ArrowLeft, 
  ArrowRight, 
  CheckCircle, 
  Play, 
  RotateCcw, 
  Award,
  Clock,
  Code,
  FileText,
  HelpCircle,
  Target
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { AITutorChat } from '@/components/AITutorChat';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

export const LessonPage = () => {
  const { courseId, lessonId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [lesson, setLesson] = useState(null);
  const [course, setCourse] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [startTime, setStartTime] = useState(Date.now());
  
  // Lesson interaction state
  const [codeInput, setCodeInput] = useState('');
  const [codeOutput, setCodeOutput] = useState('');
  const [quizAnswers, setQuizAnswers] = useState({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState(null);

  useEffect(() => {
    fetchLessonData();
    setStartTime(Date.now());
  }, [lessonId]);

  const fetchLessonData = async () => {
    try {
      // Fetch lesson details
      const lessonResponse = await axios.get(`${API}/lessons/${lessonId}`);
      setLesson(lessonResponse.data);
      
      // Set initial code if it's a coding lesson
      if (lessonResponse.data.lesson_type === 'coding' && lessonResponse.data.coding_template) {
        setCodeInput(lessonResponse.data.coding_template);
      }

      // Fetch course details
      const courseResponse = await axios.get(`${API}/courses/${courseId}`);
      setCourse(courseResponse.data);

      // Fetch all lessons for navigation
      const lessonsResponse = await axios.get(`${API}/courses/${courseId}/lessons`);
      setLessons(lessonsResponse.data);

      // Fetch lesson progress
      if (user.role === 'student') {
        const progressResponse = await axios.get(`${API}/courses/${courseId}/progress`);
        const lessonProgress = progressResponse.data.find(p => p.lesson_id === lessonId);
        setProgress(lessonProgress);
      }
    } catch (error) {
      console.error('Error fetching lesson data:', error);
    } finally {
      setLoading(false);
    }
  };

  const runCode = () => {
    // Simple Python code execution simulation
    try {
      // Basic print() function simulation
      const printRegex = /print\(["'](.*?)["']\)/g;
      let output = '';
      let match;
      
      while ((match = printRegex.exec(codeInput)) !== null) {
        output += match[1] + '\n';
      }
      
      setCodeOutput(output.trim());
      
      toast({
        title: "Code Executed!",
        description: "Check the output below.",
      });
    } catch (error) {
      setCodeOutput('Error: Invalid code');
    }
  };

  const resetCode = () => {
    setCodeInput(lesson.coding_template || '');
    setCodeOutput('');
  };

  const submitQuiz = () => {
    if (!lesson.quiz_questions) return;
    
    let correctAnswers = 0;
    lesson.quiz_questions.forEach((question, index) => {
      if (parseInt(quizAnswers[index]) === question.correct_answer) {
        correctAnswers++;
      }
    });
    
    const score = (correctAnswers / lesson.quiz_questions.length) * 100;
    setQuizScore(score);
    setQuizSubmitted(true);
    
    toast({
      title: "Quiz Submitted!",
      description: `You scored ${score.toFixed(0)}% (${correctAnswers}/${lesson.quiz_questions.length})`,
    });
  };

  const markLessonComplete = async () => {
    if (user.role !== 'student') return;
    
    const timeSpent = Math.round((Date.now() - startTime) / 60000); // Convert to minutes
    let score = null;
    
    // Determine completion criteria based on lesson type
    let completed = false;
    
    if (lesson.lesson_type === 'tutorial') {
      completed = true; // Tutorial is complete when user clicks complete
    } else if (lesson.lesson_type === 'coding') {
      completed = codeOutput.trim() === lesson.expected_output;
      if (!completed) {
        toast({
          title: "Not quite right!",
          description: "Make sure your code produces the expected output.",
          variant: "destructive",
        });
        return;
      }
    } else if (lesson.lesson_type === 'quiz') {
      if (!quizSubmitted) {
        toast({
          title: "Submit Quiz First",
          description: "Please submit your quiz answers before completing the lesson.",
          variant: "destructive",
        });
        return;
      }
      completed = quizScore >= 70; // Need 70% to pass
      score = quizScore;
      
      if (!completed) {
        toast({
          title: "Quiz Score Too Low",
          description: "You need at least 70% to complete this lesson. Try again!",
          variant: "destructive",
        });
        return;
      }
    }
    
    try {
      await axios.post(`${API}/lessons/${lessonId}/progress`, {
        completed,
        score,
        time_spent: timeSpent
      });
      
      toast({
        title: "Lesson Completed! 🎉",
        description: `You earned ${lesson.points} points!`,
      });
      
      // Navigate to next lesson or back to course
      const currentIndex = lessons.findIndex(l => l.id === lessonId);
      if (currentIndex < lessons.length - 1) {
        const nextLesson = lessons[currentIndex + 1];
        navigate(`/courses/${courseId}/lessons/${nextLesson.id}`);
      } else {
        // Course completed!
        toast({
          title: "Course Completed! 🏆",
          description: "Congratulations on finishing the course!",
        });
        navigate(`/courses/${courseId}`);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update progress. Please try again.",
        variant: "destructive",
      });
    }
  };

  const getLessonIcon = (lessonType) => {
    switch (lessonType) {
      case 'tutorial': return <FileText className="h-5 w-5" />;
      case 'coding': return <Code className="h-5 w-5" />;
      case 'quiz': return <HelpCircle className="h-5 w-5" />;
      case 'challenge': return <Target className="h-5 w-5" />;
      default: return <FileText className="h-5 w-5" />;
    }
  };

  const getCurrentLessonIndex = () => {
    return lessons.findIndex(l => l.id === lessonId);
  };

  const getPreviousLesson = () => {
    const currentIndex = getCurrentLessonIndex();
    return currentIndex > 0 ? lessons[currentIndex - 1] : null;
  };

  const getNextLesson = () => {
    const currentIndex = getCurrentLessonIndex();
    return currentIndex < lessons.length - 1 ? lessons[currentIndex + 1] : null;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!lesson) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert>
          <AlertDescription>Lesson not found.</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8" data-testid="lesson-page">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <Button 
          variant="ghost" 
          onClick={() => navigate(`/courses/${courseId}`)}
          data-testid="back-to-course"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Course
        </Button>
        
        <div className="flex items-center space-x-2">
          <Badge variant="outline">
            Lesson {getCurrentLessonIndex() + 1} of {lessons.length}
          </Badge>
          {progress?.completed && (
            <Badge className="bg-green-100 text-green-800">
              <CheckCircle className="mr-1 h-3 w-3" />
              Completed
            </Badge>
          )}
        </div>
      </div>

      {/* Lesson Header */}
      <Card className="mb-6" data-testid="lesson-header">
        <CardHeader>
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
              {getLessonIcon(lesson.lesson_type)}
            </div>
            <div className="flex-1">
              <CardTitle className="text-2xl">{lesson.title}</CardTitle>
              <CardDescription className="text-lg">{lesson.description}</CardDescription>
            </div>
            <div className="text-right">
              <div className="flex items-center space-x-4 text-sm text-gray-600">
                <div className="flex items-center space-x-1">
                  <Clock className="h-4 w-4" />
                  <span>{lesson.estimated_duration} min</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Award className="h-4 w-4" />
                  <span>{lesson.points} points</span>
                </div>
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Lesson Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Lesson Content */}
          <Card data-testid="lesson-content">
            <CardHeader>
              <CardTitle>Lesson Content</CardTitle>
            </CardHeader>
            <CardContent>
              <div 
                className="prose max-w-none"
                dangerouslySetInnerHTML={{ __html: lesson.content }}
              />
            </CardContent>
          </Card>

          {/* Interactive Elements */}
          {lesson.lesson_type === 'coding' && (
            <Card data-testid="coding-exercise">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Code className="h-5 w-5" />
                  <span>Code Editor</span>
                </CardTitle>
                <CardDescription>
                  Write your code below and click "Run Code" to see the output.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  value={codeInput}
                  onChange={(e) => setCodeInput(e.target.value)}
                  placeholder="Write your code here..."
                  className="font-mono text-sm min-h-[200px]"
                  data-testid="code-input"
                />
                
                <div className="flex space-x-2">
                  <Button onClick={runCode} data-testid="run-code">
                    <Play className="mr-2 h-4 w-4" />
                    Run Code
                  </Button>
                  <Button variant="outline" onClick={resetCode} data-testid="reset-code">
                    <RotateCcw className="mr-2 h-4 w-4" />
                    Reset
                  </Button>
                </div>
                
                {codeOutput && (
                  <div className="mt-4">
                    <Label className="text-sm font-medium">Output:</Label>
                    <div className="mt-1 p-3 bg-gray-100 rounded border font-mono text-sm" data-testid="code-output">
                      {codeOutput || 'No output'}
                    </div>
                    {lesson.expected_output && (
                      <div className="mt-2">
                        <Label className="text-sm font-medium">Expected Output:</Label>
                        <div className="mt-1 p-3 bg-blue-50 rounded border font-mono text-sm text-blue-800">
                          {lesson.expected_output}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {lesson.lesson_type === 'quiz' && lesson.quiz_questions && (
            <Card data-testid="quiz-exercise">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <HelpCircle className="h-5 w-5" />
                  <span>Quiz</span>
                </CardTitle>
                <CardDescription>
                  Answer all questions and submit to complete this lesson.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {lesson.quiz_questions.map((question, index) => (
                  <div key={index} className="space-y-3" data-testid={`quiz-question-${index}`}>
                    <h4 className="font-medium">
                      {index + 1}. {question.question}
                    </h4>
                    
                    <RadioGroup
                      value={quizAnswers[index]?.toString() || ''}
                      onValueChange={(value) => setQuizAnswers({...quizAnswers, [index]: value})}
                      disabled={quizSubmitted}
                    >
                      {question.options.map((option, optionIndex) => (
                        <div key={optionIndex} className="flex items-center space-x-2">
                          <RadioGroupItem value={optionIndex.toString()} id={`q${index}-${optionIndex}`} />
                          <Label htmlFor={`q${index}-${optionIndex}`} className="cursor-pointer">
                            {option}
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                    
                    {quizSubmitted && (
                      <div className={`p-3 rounded text-sm ${
                        parseInt(quizAnswers[index]) === question.correct_answer 
                          ? 'bg-green-50 text-green-800 border border-green-200'
                          : 'bg-red-50 text-red-800 border border-red-200'
                      }`}>
                        {parseInt(quizAnswers[index]) === question.correct_answer ? '✓ Correct!' : '✗ Incorrect'}
                        <div className="mt-1 font-medium">{question.explanation}</div>
                      </div>
                    )}
                  </div>
                ))}
                
                {!quizSubmitted && (
                  <Button onClick={submitQuiz} data-testid="submit-quiz">
                    Submit Quiz
                  </Button>
                )}
                
                {quizSubmitted && quizScore !== null && (
                  <Alert className={quizScore >= 70 ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}>
                    <AlertDescription>
                      Quiz Score: <strong>{quizScore.toFixed(0)}%</strong>
                      {quizScore >= 70 ? ' - Well done! You can now complete this lesson.' : ' - You need 70% to pass. Try reviewing the content and retaking the quiz.'}
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Progress Card */}
          {user.role === 'student' && (
            <Card data-testid="lesson-progress">
              <CardHeader>
                <CardTitle>Your Progress</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {progress && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Attempts:</span>
                      <span>{progress.attempts || 0}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Time Spent:</span>
                      <span>{progress.time_spent || 0} min</span>
                    </div>
                    {progress.score !== null && (
                      <div className="flex justify-between text-sm">
                        <span>Best Score:</span>
                        <span>{progress.score.toFixed(0)}%</span>
                      </div>
                    )}
                  </div>
                )}
                
                <Button 
                  onClick={markLessonComplete}
                  className="w-full"
                  disabled={progress?.completed}
                  data-testid="complete-lesson"
                >
                  {progress?.completed ? (
                    <>
                      <CheckCircle className="mr-2 h-4 w-4" />
                      Completed
                    </>
                  ) : (
                    <>
                      <CheckCircle className="mr-2 h-4 w-4" />
                      Complete Lesson
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          )}

          {/* AI Tutor Chat */}
          <div className="h-96">
            <AITutorChat 
              lessonId={lessonId}
              courseId={courseId}
              contextType={lesson.lesson_type === 'coding' ? 'code_help' : 'lesson_help'}
              codeContext={lesson.lesson_type === 'coding' ? codeInput : null}
              placeholder={`Ask me about "${lesson.title}"... 🤖`}
            />
          </div>

          {/* Navigation */}
          <Card data-testid="lesson-navigation">
            <CardHeader>
              <CardTitle>Navigation</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {getPreviousLesson() && (
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => navigate(`/courses/${courseId}/lessons/${getPreviousLesson().id}`)}
                  data-testid="previous-lesson"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Previous: {getPreviousLesson().title}
                </Button>
              )}
              
              {getNextLesson() && (
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => navigate(`/courses/${courseId}/lessons/${getNextLesson().id}`)}
                  data-testid="next-lesson"
                >
                  Next: {getNextLesson().title}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};