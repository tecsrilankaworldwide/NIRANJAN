import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { useUser } from '../App';
import { useToast } from '../hooks/use-toast';
import { Clock, CheckCircle, XCircle, Award, ArrowRight, ArrowLeft } from 'lucide-react';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const Quiz = () => {
  const { quizId } = useParams();
  const { user } = useUser();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [quiz, setQuiz] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [results, setResults] = useState(null);
  const [startTime, setStartTime] = useState(null);

  useEffect(() => {
    if (!user) {
      navigate('/age-selector');
      return;
    }
    
    fetchQuiz();
  }, [user, quizId, navigate]);

  useEffect(() => {
    if (quiz && !startTime) {
      setStartTime(Date.now());
      if (quiz.time_limit_minutes) {
        setTimeLeft(quiz.time_limit_minutes * 60);
      }
    }
  }, [quiz, startTime]);

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            handleSubmitQuiz();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      
      return () => clearInterval(timer);
    }
  }, [timeLeft]);

  const fetchQuiz = async () => {
    try {
      const response = await axios.get(`${API}/quizzes/${quizId}`);
      setQuiz(response.data);
    } catch (error) {
      console.error('Error fetching quiz:', error);
      toast({
        title: "Error",
        description: "Could not load quiz. Please try again.",
        variant: "destructive"
      });
      navigate('/dashboard');
    }
  };

  const handleAnswerSelect = (questionId, answerId) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answerId
    }));
  };

  const handleSubmitQuiz = async () => {
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    
    try {
      const endTime = Date.now();
      const timeTakenSeconds = Math.floor((endTime - startTime) / 1000);
      
      // Prepare answers for submission
      const submissionAnswers = quiz.questions.map(question => {
        const selectedAnswer = answers[question.id];
        const correctOption = question.options.find(opt => opt.id === question.correct_answer);
        const selectedOption = question.options.find(opt => opt.id === selectedAnswer);
        const isCorrect = selectedAnswer === question.correct_answer;
        
        return {
          question_id: question.id,
          selected_answer: selectedAnswer || '',
          is_correct: isCorrect,
          points_earned: isCorrect ? question.points : 0
        };
      });

      const attemptData = {
        user_id: user.id,
        quiz_id: quizId,
        answers: submissionAnswers,
        time_taken_seconds: timeTakenSeconds
      };

      const response = await axios.post(`${API}/quiz-attempts`, attemptData);
      setResults(response.data);
      
      toast({
        title: "Quiz Completed!",
        description: `You scored ${response.data.quiz_attempt.percentage.toFixed(1)}%`
      });
      
    } catch (error) {
      console.error('Error submitting quiz:', error);
      toast({
        title: "Error",
        description: "Could not submit quiz. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getProgressPercentage = () => {
    return ((currentQuestion + 1) / quiz.questions.length) * 100;
  };

  if (!quiz) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 pt-20 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🧠</div>
          <h2 className="text-2xl font-bold text-gray-800">Loading quiz...</h2>
        </div>
      </div>
    );
  }

  // Show results page
  if (results) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 pt-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Card className="shadow-2xl border-0">
            <CardHeader className="text-center">
              <div className={`w-20 h-20 mx-auto mb-4 rounded-full flex items-center justify-center ${
                results.quiz_attempt.passed ? 'bg-green-100' : 'bg-orange-100'
              }`}>
                {results.quiz_attempt.passed ? (
                  <Award className="w-10 h-10 text-green-600" />
                ) : (
                  <Clock className="w-10 h-10 text-orange-600" />
                )}
              </div>
              <CardTitle className="text-3xl mb-2">
                {results.quiz_attempt.passed ? 'Congratulations! 🎉' : 'Good Try! 💪'}
              </CardTitle>
              <p className="text-gray-600">
                {results.quiz_attempt.passed 
                  ? 'You passed the quiz with flying colors!' 
                  : 'Keep practicing and you\'ll get it next time!'}
              </p>
            </CardHeader>
            <CardContent className="p-8">
              {/* Results Summary */}
              <div className="grid md:grid-cols-3 gap-6 mb-8">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600">
                    {results.quiz_attempt.percentage.toFixed(1)}%
                  </div>
                  <div className="text-gray-600">Final Score</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600">
                    {results.correct_answers}/{results.total_questions}
                  </div>
                  <div className="text-gray-600">Correct Answers</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600">
                    {results.quiz_attempt.score}
                  </div>
                  <div className="text-gray-600">Points Earned</div>
                </div>
              </div>

              {/* Achievements */}
              {results.achievements_unlocked && results.achievements_unlocked.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-xl font-bold text-gray-800 mb-4">New Achievements! 🏆</h3>
                  <div className="space-y-2">
                    {results.achievements_unlocked.map((achievement, index) => (
                      <Badge key={index} className="mr-2 mb-2 bg-yellow-100 text-yellow-800">
                        {achievement.icon} {achievement.title}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  onClick={() => navigate('/dashboard')}
                  className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 flex-1"
                >
                  Back to Dashboard
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => window.location.reload()}
                  className="flex-1"
                >
                  Try Again
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => navigate('/activities')}
                  className="flex-1"
                >
                  More Quizzes
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const question = quiz.questions[currentQuestion];
  const selectedAnswer = answers[question.id];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 pt-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Quiz Header */}
        <Card className="mb-6 shadow-lg border-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-800">{quiz.title}</h1>
                <p className="text-gray-600">{quiz.category} • {quiz.difficulty}</p>
              </div>
              <div className={`flex items-center space-x-2 ${quiz.time_limit_minutes ? 'text-orange-600' : 'text-gray-600'}`}>
                <Clock className="w-5 h-5" />
                <span className="font-medium">
                  {quiz.time_limit_minutes 
                    ? formatTime(timeLeft || 0)
                    : 'No time limit'
                  }
                </span>
              </div>
            </div>
            
            {/* Progress Bar */}
            <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
              <div 
                className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${getProgressPercentage()}%` }}
              ></div>
            </div>
            
            <div className="flex justify-between text-sm text-gray-600">
              <span>Question {currentQuestion + 1} of {quiz.questions.length}</span>
              <span>{Math.round(getProgressPercentage())}% Complete</span>
            </div>
          </CardContent>
        </Card>

        {/* Question Card */}
        <Card className="shadow-xl border-0">
          <CardHeader>
            <CardTitle className="text-xl">
              {question.question}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-3">
              {question.options.map((option) => (
                <button
                  key={option.id}
                  onClick={() => handleAnswerSelect(question.id, option.id)}
                  className={`w-full p-4 text-left rounded-lg border-2 transition-all duration-300 ${
                    selectedAnswer === option.id
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                      selectedAnswer === option.id
                        ? 'border-blue-500 bg-blue-500'
                        : 'border-gray-300'
                    }`}>
                      {selectedAnswer === option.id && (
                        <CheckCircle className="w-4 h-4 text-white" />
                      )}
                    </div>
                    <span className="font-medium">{option.text}</span>
                  </div>
                </button>
              ))}
            </div>

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8">
              <Button
                variant="outline"
                onClick={() => setCurrentQuestion(prev => prev - 1)}
                disabled={currentQuestion === 0}
                className="flex items-center space-x-2"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Previous</span>
              </Button>

              {currentQuestion === quiz.questions.length - 1 ? (
                <Button
                  onClick={handleSubmitQuiz}
                  disabled={Object.keys(answers).length < quiz.questions.length || isSubmitting}
                  className="bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700"
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Quiz'}
                </Button>
              ) : (
                <Button
                  onClick={() => setCurrentQuestion(prev => prev + 1)}
                  disabled={!selectedAnswer}
                  className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 flex items-center space-x-2"
                >
                  <span>Next</span>
                  <ArrowRight className="w-4 h-4" />
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Quiz;