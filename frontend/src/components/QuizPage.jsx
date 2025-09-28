import React, { useState, useEffect } from 'react';
import { useAuth } from '../App';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const QuizPage = () => {
  const { user, token } = useAuth();
  const [quizzes, setQuizzes] = useState([]);
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [currentQuiz, setCurrentQuiz] = useState(null);
  const [answers, setAnswers] = useState({});
  const [quizResult, setQuizResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const loadQuizzes = async () => {
      try {
        const response = await axios.get(`${API}/quizzes?learning_level=${user?.learning_level}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setQuizzes(response.data);
      } catch (error) {
        console.error('Failed to load quizzes:', error);
      } finally {
        setLoading(false);
      }
    };

    if (token && user) {
      loadQuizzes();
    }
  }, [token, user]);

  const startQuiz = async (quizId) => {
    try {
      const response = await axios.get(`${API}/quizzes/${quizId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCurrentQuiz(response.data);
      setSelectedQuiz(quizId);
      setAnswers({});
      setQuizResult(null);
    } catch (error) {
      console.error('Failed to load quiz:', error);
    }
  };

  const handleAnswerChange = (questionIndex, answer) => {
    setAnswers(prev => ({
      ...prev,
      [`question_${questionIndex}`]: answer
    }));
  };

  const submitQuiz = async () => {
    if (!currentQuiz) return;
    
    setSubmitting(true);
    try {
      const response = await axios.post(`${API}/quizzes/${currentQuiz.id}/attempt`, answers, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setQuizResult(response.data);
    } catch (error) {
      console.error('Failed to submit quiz:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const resetQuiz = () => {
    setCurrentQuiz(null);
    setSelectedQuiz(null);
    setAnswers({});
    setQuizResult(null);
  };

  const getSkillAreaIcon = (skillArea) => {
    const icons = {
      ai_literacy: '🤖',
      logical_thinking: '🧠',
      creative_problem_solving: '🎨',
      future_career_skills: '💼',
      systems_thinking: '🔗',
      innovation_methods: '💡'
    };
    return icons[skillArea] || '📚';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-300 rounded w-64"></div>
          <div className="grid md:grid-cols-2 gap-6">
            {[1,2,3,4].map(i => (
              <div key={i} className="h-48 bg-gray-300 rounded-xl w-80"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Quiz Results View
  if (quizResult) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center mb-8">
            <div className={`text-8xl mb-4 ${quizResult.passed ? 'text-green-500' : 'text-orange-500'}`}>
              {quizResult.passed ? '🎉' : '📚'}
            </div>
            <h1 className="text-4xl font-bold text-gray-800 mb-4">
              {quizResult.passed ? 'Congratulations!' : 'Keep Learning!'}
            </h1>
            <p className="text-xl text-gray-600">
              You scored {Math.round(quizResult.score)}% on "{currentQuiz?.title}"
            </p>
          </div>

          {/* Score Details */}
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
            <div className="grid md:grid-cols-3 gap-6 mb-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">{Math.round(quizResult.score)}%</div>
                <div className="text-sm text-gray-600">Your Score</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">{quizResult.correct_answers}</div>
                <div className="text-sm text-gray-600">Correct Answers</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-600">{quizResult.total_questions}</div>
                <div className="text-sm text-gray-600">Total Questions</div>
              </div>
            </div>

            <div className="w-full bg-gray-200 rounded-full h-4 mb-4">
              <div 
                className={`h-4 rounded-full ${quizResult.passed ? 'bg-green-500' : 'bg-orange-500'}`}
                style={{ width: `${quizResult.score}%` }}
              ></div>
            </div>

            <div className="text-center">
              <p className={`font-semibold ${quizResult.passed ? 'text-green-700' : 'text-orange-700'}`}>
                {quizResult.passed ? 
                  `🎯 Great job! You passed with ${Math.round(quizResult.score)}%` : 
                  `📖 You need ${currentQuiz?.passing_score}% to pass. Keep studying!`
                }
              </p>
            </div>
          </div>

          {/* Question Review */}
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
            <h3 className="text-2xl font-bold mb-6 text-gray-800">📝 Question Review</h3>
            <div className="space-y-6">
              {quizResult.feedback?.map((question, index) => (
                <div key={index} className="border-b border-gray-200 pb-4 last:border-b-0">
                  <p className="font-semibold text-gray-800 mb-3">{question.question}</p>
                  {question.explanation && (
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <p className="text-blue-800 text-sm">
                        <span className="font-semibold">💡 Explanation: </span>
                        {question.explanation}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="text-center">
            <button
              onClick={resetQuiz}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-colors font-semibold text-lg"
            >
              Take Another Quiz
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Active Quiz View
  if (currentQuiz) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-3xl font-bold text-gray-800">{currentQuiz.title}</h1>
              <button
                onClick={resetQuiz}
                className="text-gray-500 hover:text-gray-700 text-sm"
              >
                ← Back to Quizzes
              </button>
            </div>

            <div className="mb-8">
              <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                <span>Progress: {Object.keys(answers).length} of {currentQuiz.questions?.length || 0} questions</span>
                <span>Time Limit: {currentQuiz.time_limit_minutes} minutes</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(Object.keys(answers).length / (currentQuiz.questions?.length || 1)) * 100}%` }}
                ></div>
              </div>
            </div>

            {/* Questions */}
            <div className="space-y-8">
              {currentQuiz.questions?.map((question, index) => (
                <div key={index} className="border border-gray-200 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">
                    {index + 1}. {question.question}
                  </h3>
                  
                  {question.type === 'multiple_choice' && (
                    <div className="space-y-3">
                      {question.options?.map((option, optionIndex) => (
                        <label 
                          key={optionIndex}
                          className="flex items-center p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                        >
                          <input
                            type="radio"
                            name={`question_${index}`}
                            value={optionIndex}
                            checked={answers[`question_${index}`] === optionIndex}
                            onChange={(e) => handleAnswerChange(index, parseInt(e.target.value))}
                            className="mr-3 text-blue-600"
                          />
                          <span className="text-gray-700">{option}</span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="mt-8 text-center">
              <button
                onClick={submitQuiz}
                disabled={submitting || Object.keys(answers).length !== currentQuiz.questions?.length}
                className="bg-gradient-to-r from-green-600 to-blue-600 text-white px-8 py-4 rounded-xl hover:from-green-700 hover:to-blue-700 transition-colors font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? '⏳ Submitting...' : '✅ Submit Quiz'}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Quiz Selection View
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">📝 Knowledge Assessment</h1>
          <p className="text-xl text-gray-600">Test your understanding and reinforce your learning</p>
        </div>

        {quizzes.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">📚</div>
            <h3 className="text-2xl font-semibold text-gray-700 mb-2">No Quizzes Available</h3>
            <p className="text-gray-500">Quizzes for your learning level are coming soon!</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {quizzes.map(quiz => (
              <div key={quiz.id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border border-gray-100">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      {quiz.skill_areas?.map(skill => (
                        <span key={skill} className="text-2xl">
                          {getSkillAreaIcon(skill)}
                        </span>
                      ))}
                    </div>
                    <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-medium">
                      {quiz.time_limit_minutes} min
                    </span>
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-800 mb-2">{quiz.title}</h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">{quiz.description}</p>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">Questions:</span>
                      <span className="font-medium text-blue-600">{quiz.questions?.length || 0}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">Passing Score:</span>
                      <span className="font-medium text-green-600">{quiz.passing_score}%</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">Level:</span>
                      <span className="font-medium text-purple-600 capitalize">{quiz.learning_level}</span>
                    </div>
                  </div>
                  
                  <button 
                    onClick={() => startQuiz(quiz.id)}
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-4 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-colors font-semibold"
                  >
                    🚀 Start Quiz
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default QuizPage;