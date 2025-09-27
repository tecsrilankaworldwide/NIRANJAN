import React, { useState, useEffect } from 'react';
import { useAuth } from '../App';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const TeacherDashboard = () => {
  const { user, token } = useAuth();
  const [courses, setCourses] = useState([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  
  const [newCourse, setNewCourse] = useState({
    title: '',
    description: '',
    learning_level: 'foundation',
    skill_areas: [],
    age_group: '5-8',
    thumbnail_url: '',
    is_premium: false,
    difficulty_level: 1,
    estimated_hours: 2
  });

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API}/courses?published_only=false`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCourses(response.data.filter(course => course.created_by === user.id));
    } catch (error) {
      console.error('Failed to fetch courses:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCourse = async (e) => {
    e.preventDefault();
    try {
      setCreating(true);
      const response = await axios.post(`${API}/courses`, newCourse, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setCourses([response.data, ...courses]);
      setShowCreateForm(false);
      setNewCourse({
        title: '',
        description: '',
        learning_level: 'foundation',
        skill_areas: [],
        age_group: '5-8',
        thumbnail_url: '',
        is_premium: false,
        difficulty_level: 1,
        estimated_hours: 2
      });
    } catch (error) {
      console.error('Failed to create course:', error);
      alert('Failed to create course');
    } finally {
      setCreating(false);
    }
  };

  const toggleSkillArea = (skillArea) => {
    const updated = newCourse.skill_areas.includes(skillArea)
      ? newCourse.skill_areas.filter(s => s !== skillArea)
      : [...newCourse.skill_areas, skillArea];
    setNewCourse({...newCourse, skill_areas: updated});
  };

  const skillAreas = [
    { key: 'ai_literacy', name: 'AI Literacy', icon: '🤖' },
    { key: 'logical_thinking', name: 'Logical Thinking', icon: '🧩' },
    { key: 'creative_problem_solving', name: 'Creative Problem Solving', icon: '🎨' },
    { key: 'future_career_skills', name: 'Future Career Skills', icon: '🚀' },
    { key: 'systems_thinking', name: 'Systems Thinking', icon: '⚙️' },
    { key: 'innovation_methods', name: 'Innovation Methods', icon: '💡' }
  ];

  const getLevelInfo = (level) => {
    const levels = {
      'foundation': { name: 'Foundation', icon: '🌱', color: 'green' },
      'development': { name: 'Development', icon: '🧠', color: 'blue' },
      'mastery': { name: 'Mastery', icon: '🎯', color: 'purple' }
    };
    return levels[level] || levels['foundation'];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 text-white">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <div className="text-6xl mb-6">🎬</div>
            <h1 className="text-4xl font-bold mb-4">Content Creation Studio</h1>
            <p className="text-xl text-purple-100 mb-6">
              Build future-ready courses that inspire and educate young minds
            </p>
            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 max-w-md mx-auto">
              <p className="font-semibold">Welcome, {user.full_name}</p>
              <p className="text-sm text-purple-100">Course Creator & Educator</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* Quick Actions */}
        <div className="grid md:grid-cols-4 gap-6 mb-12">
          <button
            onClick={() => setShowCreateForm(true)}
            className="bg-gradient-to-r from-green-500 to-emerald-600 text-white p-6 rounded-xl hover:shadow-lg transition-all"
          >
            <div className="text-3xl mb-2">📚</div>
            <h3 className="font-bold">Create Course</h3>
            <p className="text-sm opacity-90">New learning experience</p>
          </button>

          <div className="bg-gradient-to-r from-blue-500 to-cyan-600 text-white p-6 rounded-xl">
            <div className="text-3xl mb-2">📊</div>
            <h3 className="font-bold">My Courses</h3>
            <p className="text-2xl font-bold">{courses.length}</p>
          </div>

          <div className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white p-6 rounded-xl">
            <div className="text-3xl mb-2">👥</div>
            <h3 className="font-bold">Total Enrollments</h3>
            <p className="text-2xl font-bold">
              {courses.reduce((sum, course) => sum + (course.enrollment_count || 0), 0)}
            </p>
            <p className="text-xs opacity-75">Across all courses</p>
          </div>

          <div className="bg-gradient-to-r from-orange-500 to-red-600 text-white p-6 rounded-xl">
            <div className="text-3xl mb-2">⭐</div>
            <h3 className="font-bold">Avg Rating</h3>
            <p className="text-2xl font-bold">
              {courses.length > 0 
                ? (courses.reduce((sum, course) => sum + (course.average_rating || 0), 0) / courses.length).toFixed(1)
                : '4.8'
              }
            </p>
            <p className="text-xs opacity-75">Student feedback</p>
          </div>
        </div>

        {/* Create Course Form */}
        {showCreateForm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Create New Course</h2>
                <button
                  onClick={() => setShowCreateForm(false)}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  ×
                </button>
              </div>

              <form onSubmit={handleCreateCourse} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Course Title *</label>
                  <input
                    type="text"
                    value={newCourse.title}
                    onChange={(e) => setNewCourse({...newCourse, title: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="e.g., Introduction to AI for Kids"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
                  <textarea
                    value={newCourse.description}
                    onChange={(e) => setNewCourse({...newCourse, description: e.target.value})}
                    rows={4}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Describe what students will learn..."
                    required
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Learning Level *</label>
                    <select
                      value={newCourse.learning_level}
                      onChange={(e) => {
                        const level = e.target.value;
                        const ageMap = { foundation: '5-8', development: '9-12', mastery: '13-16' };
                        setNewCourse({...newCourse, learning_level: level, age_group: ageMap[level]});
                      }}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      required
                    >
                      <option value="foundation">🌱 Foundation (Ages 5-8)</option>
                      <option value="development">🧠 Development (Ages 9-12)</option>
                      <option value="mastery">🎯 Mastery (Ages 13-16)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Difficulty Level</label>
                    <select
                      value={newCourse.difficulty_level}
                      onChange={(e) => setNewCourse({...newCourse, difficulty_level: parseInt(e.target.value)})}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    >
                      <option value={1}>1 - Beginner</option>
                      <option value={2}>2 - Easy</option>
                      <option value={3}>3 - Intermediate</option>
                      <option value={4}>4 - Advanced</option>
                      <option value={5}>5 - Expert</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Skill Areas *</label>
                  <div className="grid md:grid-cols-2 gap-2">
                    {skillAreas.map(skill => (
                      <label key={skill.key} className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={newCourse.skill_areas.includes(skill.key)}
                          onChange={() => toggleSkillArea(skill.key)}
                          className="mr-3"
                        />
                        <span className="mr-2">{skill.icon}</span>
                        <span className="text-sm">{skill.name}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Estimated Hours</label>
                    <input
                      type="number"
                      value={newCourse.estimated_hours}
                      onChange={(e) => setNewCourse({...newCourse, estimated_hours: parseInt(e.target.value)})}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      min="1"
                      max="50"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Course Type</label>
                    <label className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={newCourse.is_premium}
                        onChange={(e) => setNewCourse({...newCourse, is_premium: e.target.checked})}
                        className="mr-3"
                      />
                      <span className="mr-2">💎</span>
                      <span className="text-sm">Premium Course</span>
                    </label>
                  </div>
                </div>

                <div className="flex space-x-4">
                  <button
                    type="button"
                    onClick={() => setShowCreateForm(false)}
                    className="flex-1 bg-gray-200 text-gray-800 py-3 px-4 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={creating || newCourse.skill_areas.length === 0}
                    className="flex-1 bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-3 px-4 rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-colors font-medium disabled:opacity-50"
                  >
                    {creating ? 'Creating...' : 'Create Course'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Courses List */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">My Courses</h2>
            <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium">
              {courses.length} courses
            </span>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading your courses...</p>
            </div>
          ) : courses.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">📚</div>
              <h3 className="text-xl font-bold text-gray-800 mb-4">No Courses Yet</h3>
              <p className="text-gray-600 mb-6">Start creating amazing learning experiences for future-ready kids!</p>
              <button
                onClick={() => setShowCreateForm(true)}
                className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-6 py-3 rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-colors font-medium"
              >
                Create Your First Course
              </button>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map(course => {
                const levelInfo = getLevelInfo(course.learning_level);
                return (
                  <div key={course.id} className="border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow">
                    <div className="flex items-center justify-between mb-4">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-${levelInfo.color}-100 text-${levelInfo.color}-800`}>
                        {levelInfo.icon} {levelInfo.name}
                      </span>
                      {course.is_premium && <span className="text-purple-600">💎</span>}
                    </div>

                    <h3 className="font-bold text-gray-800 mb-2 line-clamp-2">{course.title}</h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">{course.description}</p>

                    <div className="space-y-2 text-sm text-gray-500">
                      <div className="flex justify-between">
                        <span>👥 Enrolled:</span>
                        <span className="font-medium">{course.enrollment_count || 0}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>📹 Lessons:</span>
                        <span className="font-medium">{course.videos?.length || 0}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>⭐ Rating:</span>
                        <span className="font-medium">{course.average_rating?.toFixed(1) || 'New'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>📊 Status:</span>
                        <span className={`font-medium ${course.is_published ? 'text-green-600' : 'text-yellow-600'}`}>
                          {course.is_published ? 'Published' : 'Draft'}
                        </span>
                      </div>
                    </div>

                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <button className="w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors font-medium">
                        Manage Course →
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Teaching Tips */}
        <div className="mt-12 bg-gradient-to-r from-blue-100 via-purple-100 to-indigo-100 rounded-2xl p-8 border border-blue-200">
          <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">Future-Ready Teaching Tips 🎓</h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white/60 p-4 rounded-lg">
              <div className="text-2xl mb-3">🎯</div>
              <h4 className="font-semibold mb-2">Age-Appropriate Content</h4>
              <p className="text-sm text-gray-700">Design content that matches cognitive development stages for each age group.</p>
            </div>
            <div className="bg-white/60 p-4 rounded-lg">
              <div className="text-2xl mb-3">🤖</div>
              <h4 className="font-semibold mb-2">AI Integration</h4>
              <p className="text-sm text-gray-700">Introduce AI concepts through practical examples and hands-on activities.</p>
            </div>
            <div className="bg-white/60 p-4 rounded-lg">
              <div className="text-2xl mb-3">🚀</div>
              <h4 className="font-semibold mb-2">Future Skills Focus</h4>
              <p className="text-sm text-gray-700">Emphasize skills like critical thinking, creativity, and adaptability.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboard;