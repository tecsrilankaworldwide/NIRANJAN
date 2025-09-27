import React, { useState, useEffect } from 'react';
import { useAuth } from '../App';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const CoursesPage = () => {
  const { user, token, getLearningLevel, hasSubscription } = useAuth();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    learning_level: '',
    skill_area: '',
    age_group: user?.age_group || ''
  });
  const [enrolling, setEnrolling] = useState(null);

  useEffect(() => {
    fetchCourses();
  }, [filters]);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (filters.learning_level) params.append('learning_level', filters.learning_level);
      if (filters.skill_area) params.append('skill_area', filters.skill_area);
      if (filters.age_group) params.append('age_group', filters.age_group);
      params.append('published_only', 'true');

      const response = await axios.get(`${API}/courses?${params.toString()}`);
      setCourses(response.data);
    } catch (err) {
      setError('Failed to load courses');
      console.error('Courses error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleEnroll = async (courseId) => {
    if (!hasSubscription) {
      // Redirect to subscription page
      window.location.href = '/subscription';
      return;
    }

    try {
      setEnrolling(courseId);
      await axios.post(`${API}/enroll`, 
        { course_id: courseId },
        { headers: { Authorization: `Bearer ${token}` }}
      );
      
      // Refresh courses to update enrollment status
      fetchCourses();
    } catch (err) {
      console.error('Enrollment error:', err);
      alert('Failed to enroll in course');
    } finally {
      setEnrolling(null);
    }
  };

  const getSkillIcon = (skillArea) => {
    const icons = {
      'ai_literacy': '🤖',
      'logical_thinking': '🧩',
      'creative_problem_solving': '🎨',
      'future_career_skills': '🚀',
      'systems_thinking': '⚙️',
      'innovation_methods': '💡'
    };
    return icons[skillArea] || '🎯';
  };

  const getLevelIcon = (level) => {
    const icons = {
      'foundation': '🌱',
      'development': '🧠',
      'mastery': '🎯'
    };
    return icons[level] || '📚';
  };

  const getLevelColor = (level) => {
    const colors = {
      'foundation': 'from-green-500 to-emerald-600',
      'development': 'from-blue-500 to-cyan-600',
      'mastery': 'from-purple-500 to-indigo-600'
    };
    return colors[level] || 'from-gray-500 to-gray-600';
  };

  if (loading && courses.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading amazing courses for you...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 text-white">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <div className="text-6xl mb-6">📚</div>
            <h1 className="text-4xl font-bold mb-4">Future-Ready Learning Courses</h1>
            <p className="text-xl text-purple-100 mb-6">
              Master AI, Logic, Creativity & Problem Solving for Tomorrow's World
            </p>
            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 max-w-md mx-auto">
              <p className="font-semibold">Your Learning Level: {getLearningLevel(user?.age_group)}</p>
              <p className="text-sm text-purple-100">Ages {user?.age_group}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* Filters */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8 border border-gray-100">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Find Your Perfect Course</h2>
          <div className="grid md:grid-cols-3 gap-4">
            <select
              value={filters.learning_level}
              onChange={(e) => setFilters({...filters, learning_level: e.target.value})}
              className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="">All Levels</option>
              <option value="foundation">🌱 Foundation (Ages 5-8)</option>
              <option value="development">🧠 Development (Ages 9-12)</option>
              <option value="mastery">🎯 Mastery (Ages 13-16)</option>
            </select>

            <select
              value={filters.skill_area}
              onChange={(e) => setFilters({...filters, skill_area: e.target.value})}
              className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="">All Skills</option>
              <option value="ai_literacy">🤖 AI Literacy</option>
              <option value="logical_thinking">🧩 Logical Thinking</option>
              <option value="creative_problem_solving">🎨 Creative Problem Solving</option>
              <option value="future_career_skills">🚀 Future Career Skills</option>
              <option value="systems_thinking">⚙️ Systems Thinking</option>
              <option value="innovation_methods">💡 Innovation Methods</option>
            </select>

            <select
              value={filters.age_group}
              onChange={(e) => setFilters({...filters, age_group: e.target.value})}
              className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="">All Ages</option>
              <option value="5-8">Ages 5-8</option>
              <option value="9-12">Ages 9-12</option>
              <option value="13-16">Ages 13-16</option>
            </select>
          </div>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {/* Courses Grid */}
        {courses.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {courses.map((course) => (
              <div key={course.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 border border-gray-100">
                {/* Course Header */}
                <div className={`bg-gradient-to-r ${getLevelColor(course.learning_level)} p-6 text-white`}>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-3xl">{getLevelIcon(course.learning_level)}</span>
                    {course.is_premium && (
                      <span className="bg-white/20 px-2 py-1 rounded-full text-xs font-medium">
                        💎 Premium
                      </span>
                    )}
                  </div>
                  <h3 className="text-xl font-bold mb-2">{course.title}</h3>
                  <div className="flex items-center space-x-2 text-sm opacity-90">
                    <span>Ages {course.age_group}</span>
                    <span>•</span>
                    <span>Level {course.difficulty_level || 1}/5</span>
                  </div>
                </div>

                {/* Course Content */}
                <div className="p-6">
                  <p className="text-gray-600 mb-4 line-clamp-3">{course.description}</p>
                  
                  {/* Skills */}
                  <div className="mb-4">
                    <p className="text-sm font-semibold text-gray-700 mb-2">Skills You'll Learn:</p>
                    <div className="flex flex-wrap gap-2">
                      {course.skill_areas?.slice(0, 2).map((skill, index) => (
                        <span key={index} className="inline-flex items-center px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                          <span className="mr-1">{getSkillIcon(skill)}</span>
                          {skill.replace('_', ' ')}
                        </span>
                      ))}
                      {course.skill_areas?.length > 2 && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-500 text-xs rounded-full">
                          +{course.skill_areas.length - 2} more
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Course Stats */}
                  <div className="flex justify-between items-center text-sm text-gray-500 mb-4">
                    <span>{course.videos?.length || 0} Lessons</span>
                    <span>{course.estimated_hours || 2}h total</span>
                    <span>⭐ {course.average_rating?.toFixed(1) || 'New'}</span>
                  </div>

                  {/* Enrollment Button */}
                  <div className="space-y-2">
                    {course.is_premium && !hasSubscription ? (
                      <div>
                        <button
                          onClick={() => window.location.href = '/subscription'}
                          className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-3 px-4 rounded-lg hover:from-yellow-600 hover:to-orange-600 transition-colors font-medium"
                        >
                          ⭐ Get Premium Access
                        </button>
                        <p className="text-xs text-center text-gray-500">Premium subscription required</p>
                      </div>
                    ) : (
                      <button
                        onClick={() => handleEnroll(course.id)}
                        disabled={enrolling === course.id}
                        className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-3 px-4 rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-colors font-medium disabled:opacity-50"
                      >
                        {enrolling === course.id ? (
                          <span className="flex items-center justify-center">
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            Enrolling...
                          </span>
                        ) : (
                          'Start Learning →'
                        )}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="text-6xl mb-6">🔍</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">No Courses Found</h2>
            <p className="text-gray-600 mb-6">
              {filters.learning_level || filters.skill_area || filters.age_group 
                ? 'Try adjusting your filters to see more courses.'
                : 'Amazing courses are being prepared just for you!'}
            </p>
            {(filters.learning_level || filters.skill_area || filters.age_group) && (
              <button
                onClick={() => setFilters({ learning_level: '', skill_area: '', age_group: user?.age_group || '' })}
                className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors font-medium"
              >
                Clear Filters
              </button>
            )}
          </div>
        )}

        {/* CTA Section */}
        {!hasSubscription && (
          <div className="mt-16 bg-gradient-to-r from-yellow-100 via-orange-100 to-red-100 rounded-2xl p-8 text-center border border-yellow-200">
            <div className="text-4xl mb-4">🚀</div>
            <h3 className="text-2xl font-bold text-gray-800 mb-4">Unlock Your Full Learning Potential!</h3>
            <p className="text-gray-700 mb-6 max-w-2xl mx-auto">
              Get unlimited access to all premium courses, downloadable materials, and personalized learning paths designed for your age group.
            </p>
            <div className="flex justify-center space-x-4">
              <a 
                href="/subscription"
                className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-8 py-3 rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-colors font-medium"
              >
                View Subscription Plans →
              </a>
            </div>
          </div>
        )}

        {/* Learning Journey */}
        <div className="mt-12 bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
          <div className="text-center">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">Your Future-Ready Learning Journey</h3>
            <p className="text-gray-600 mb-6 max-w-3xl mx-auto">
              Every course is designed to build essential skills for tomorrow's world. From understanding AI to mastering creative problem-solving, you're preparing for careers that don't even exist yet!
            </p>
            <div className="flex justify-center space-x-6 text-sm">
              <div className="text-center">
                <div className="text-2xl mb-2">🌱</div>
                <p className="font-medium">Foundation</p>
                <p className="text-gray-500">Ages 5-8</p>
              </div>
              <div className="text-center">
                <div className="text-2xl mb-2">🧠</div>
                <p className="font-medium">Development</p>
                <p className="text-gray-500">Ages 9-12</p>
              </div>
              <div className="text-center">
                <div className="text-2xl mb-2">🎯</div>
                <p className="font-medium">Mastery</p>
                <p className="text-gray-500">Ages 13-16</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoursesPage;