import React, { useState, useEffect } from 'react';
import { useAuth } from '../App';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const AnalyticsDashboard = () => {
  const { user, token } = useAuth();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);

  useEffect(() => {
    fetchStudentsAnalytics();
  }, []);

  const fetchStudentsAnalytics = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API}/analytics/students`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStudents(response.data);
    } catch (err) {
      setError('Failed to load student analytics');
      console.error('Analytics error:', err);
    } finally {
      setLoading(false);
    }
  };

  const getLevelInfo = (level) => {
    const levels = {
      'foundation': { name: 'Foundation', icon: '🌱', color: 'green' },
      'development': { name: 'Development', icon: '🧠', color: 'blue' },
      'mastery': { name: 'Mastery', icon: '🎯', color: 'purple' }
    };
    return levels[level] || levels['foundation'];
  };

  const getSkillProgress = (skillProgress) => {
    if (!skillProgress) return 0;
    const skills = Object.values(skillProgress);
    return skills.length > 0 ? skills.reduce((sum, val) => sum + val, 0) / skills.length : 0;
  };

  const formatTime = (minutes) => {
    if (minutes < 60) return `${minutes}m`;
    return `${Math.floor(minutes / 60)}h ${minutes % 60}m`;
  };

  const getActivityIcon = (activityType) => {
    const icons = {
      'login': '🔐',
      'logout': '👋',
      'course_enrollment': '📚',
      'video_watched': '📺',
      'video_completed': '✅',
      'course_started': '🚀',
      'course_completed': '🏆',
      'skill_progression': '📈',
      'payment_made': '💳',
      'learning_path_updated': '🛤️'
    };
    return icons[activityType] || '📊';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading student analytics...</p>
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
            <div className="text-6xl mb-6">📊</div>
            <h1 className="text-4xl font-bold mb-4">Student Analytics Dashboard</h1>
            <p className="text-xl text-purple-100 mb-6">
              Track learning progress and engagement across all levels
            </p>
            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 max-w-md mx-auto">
              <p className="font-semibold">Welcome, {user.full_name}</p>
              <p className="text-sm text-purple-100">Education Analytics • {user.role}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {/* Summary Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-12">
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white p-6 rounded-xl">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold mb-2">Total Students</h3>
                <p className="text-3xl font-bold">{students.length}</p>
              </div>
              <span className="text-4xl opacity-20">👥</span>
            </div>
          </div>

          <div className="bg-gradient-to-r from-blue-500 to-cyan-600 text-white p-6 rounded-xl">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold mb-2">Avg Progress</h3>
                <p className="text-3xl font-bold">
                  {students.length > 0 
                    ? Math.round(students.reduce((sum, s) => sum + (s.level_completion || 0), 0) / students.length)
                    : 0}%
                </p>
              </div>
              <span className="text-4xl opacity-20">📈</span>
            </div>
          </div>

          <div className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white p-6 rounded-xl">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold mb-2">Learning Time</h3>
                <p className="text-3xl font-bold">
                  {formatTime(students.reduce((sum, s) => sum + (s.total_learning_time || 0), 0))}
                </p>
              </div>
              <span className="text-4xl opacity-20">⏱️</span>
            </div>
          </div>

          <div className="bg-gradient-to-r from-orange-500 to-red-600 text-white p-6 rounded-xl">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold mb-2">Active Learners</h3>
                <p className="text-3xl font-bold">
                  {students.filter(s => s.recent_activities && s.recent_activities.length > 0).length}
                </p>
              </div>
              <span className="text-4xl opacity-20">🔥</span>
            </div>
          </div>
        </div>

        {/* Students Table */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-gray-800">Student Progress Overview</h2>
            <p className="text-gray-600 mt-2">Monitor individual learning journeys and engagement</p>
          </div>

          {students.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">📚</div>
              <h3 className="text-xl font-bold text-gray-800 mb-4">No Students Found</h3>
              <p className="text-gray-600">Students will appear here once they enroll in your courses.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left p-4 font-semibold text-gray-700">Student</th>
                    <th className="text-left p-4 font-semibold text-gray-700">Level</th>
                    <th className="text-left p-4 font-semibold text-gray-700">Progress</th>
                    <th className="text-left p-4 font-semibold text-gray-700">Learning Time</th>
                    <th className="text-left p-4 font-semibold text-gray-700">Subscription</th>
                    <th className="text-left p-4 font-semibold text-gray-700">Last Activity</th>
                    <th className="text-left p-4 font-semibold text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((student, index) => {
                    const levelInfo = getLevelInfo(student.learning_level);
                    const overallProgress = getSkillProgress(student.skill_progress);
                    const lastActivity = student.recent_activities?.[0];
                    
                    return (
                      <tr key={student.user_id} className={`border-b border-gray-100 hover:bg-gray-50 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-25'}`}>
                        <td className="p-4">
                          <div>
                            <div className="font-semibold text-gray-800">{student.full_name}</div>
                            <div className="text-sm text-gray-500">{student.email}</div>
                          </div>
                        </td>
                        
                        <td className="p-4">
                          <div className="flex items-center">
                            <span className="text-lg mr-2">{levelInfo.icon}</span>
                            <div>
                              <div className="font-medium text-gray-800">{levelInfo.name}</div>
                              <div className="text-xs text-gray-500">Ages {student.age_group}</div>
                            </div>
                          </div>
                        </td>
                        
                        <td className="p-4">
                          <div>
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-sm font-medium">{Math.round(overallProgress)}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div 
                                className={`h-2 rounded-full ${
                                  overallProgress >= 80 ? 'bg-green-500' :
                                  overallProgress >= 50 ? 'bg-yellow-500' :
                                  'bg-blue-500'
                                }`}
                                style={{ width: `${overallProgress}%` }}
                              ></div>
                            </div>
                          </div>
                        </td>
                        
                        <td className="p-4">
                          <span className="font-medium text-gray-700">
                            {formatTime(student.total_learning_time || 0)}
                          </span>
                        </td>
                        
                        <td className="p-4">
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            student.subscription_type
                              ? 'bg-green-100 text-green-800'
                              : 'bg-gray-100 text-gray-600'
                          }`}>
                            {student.subscription_type ? `💎 ${student.subscription_type}` : 'Free'}
                          </span>
                        </td>
                        
                        <td className="p-4">
                          {lastActivity ? (
                            <div className="flex items-center">
                              <span className="mr-2">{getActivityIcon(lastActivity.activity_type)}</span>
                              <div>
                                <div className="text-sm font-medium text-gray-700">
                                  {lastActivity.activity_type.replace('_', ' ')}
                                </div>
                                <div className="text-xs text-gray-500">
                                  {new Date(lastActivity.timestamp).toLocaleDateString()}
                                </div>
                              </div>
                            </div>
                          ) : (
                            <span className="text-gray-400 text-sm">No activity</span>
                          )}
                        </td>
                        
                        <td className="p-4">
                          <button
                            onClick={() => setSelectedStudent(student)}
                            className="bg-purple-100 text-purple-700 px-3 py-1 rounded-lg hover:bg-purple-200 transition-colors text-sm font-medium"
                          >
                            View Details
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Insights Section */}
        <div className="mt-12 grid lg:grid-cols-3 gap-8">
          {/* Learning Levels Distribution */}
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Level Distribution</h3>
            <div className="space-y-4">
              {['foundation', 'development', 'mastery'].map(level => {
                const levelInfo = getLevelInfo(level);
                const count = students.filter(s => s.learning_level === level).length;
                const percentage = students.length > 0 ? (count / students.length) * 100 : 0;
                
                return (
                  <div key={level}>
                    <div className="flex justify-between items-center mb-2">
                      <div className="flex items-center">
                        <span className="text-lg mr-2">{levelInfo.icon}</span>
                        <span className="font-medium">{levelInfo.name}</span>
                      </div>
                      <span className="text-sm font-medium">{count} students</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full bg-${levelInfo.color}-500`}
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Engagement Metrics */}
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Engagement Metrics</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                <span className="text-green-800 font-medium">High Engagement</span>
                <span className="text-2xl font-bold text-green-600">
                  {students.filter(s => (s.total_learning_time || 0) > 120).length}
                </span>
              </div>
              
              <div className="flex justify-between items-center p-3 bg-yellow-50 rounded-lg">
                <span className="text-yellow-800 font-medium">Medium Engagement</span>
                <span className="text-2xl font-bold text-yellow-600">
                  {students.filter(s => {
                    const time = s.total_learning_time || 0;
                    return time > 30 && time <= 120;
                  }).length}
                </span>
              </div>
              
              <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
                <span className="text-red-800 font-medium">Needs Attention</span>
                <span className="text-2xl font-bold text-red-600">
                  {students.filter(s => (s.total_learning_time || 0) <= 30).length}
                </span>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <button className="w-full p-3 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg hover:from-blue-100 hover:to-cyan-100 transition-colors border border-blue-200 text-left">
                <div className="flex items-center">
                  <span className="text-xl mr-3">📧</span>
                  <div>
                    <p className="font-medium text-blue-800">Send Progress Reports</p>
                    <p className="text-xs text-blue-600">Email parents about progress</p>
                  </div>
                </div>
              </button>
              
              <button className="w-full p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg hover:from-green-100 hover:to-emerald-100 transition-colors border border-green-200 text-left">
                <div className="flex items-center">
                  <span className="text-xl mr-3">🎯</span>
                  <div>
                    <p className="font-medium text-green-800">Set Learning Goals</p>
                    <p className="text-xs text-green-600">Create personalized targets</p>
                  </div>
                </div>
              </button>
              
              <button className="w-full p-3 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg hover:from-purple-100 hover:to-indigo-100 transition-colors border border-purple-200 text-left">
                <div className="flex items-center">
                  <span className="text-xl mr-3">📊</span>
                  <div>
                    <p className="font-medium text-purple-800">Export Analytics</p>
                    <p className="text-xs text-purple-600">Download detailed reports</p>
                  </div>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Student Detail Modal */}
      {selectedStudent && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">{selectedStudent.full_name}</h2>
              <button
                onClick={() => setSelectedStudent(null)}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ×
              </button>
            </div>

            <div className="space-y-6">
              {/* Student Info */}
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-800 mb-2">Student Details</h4>
                  <p className="text-sm text-gray-600">Email: {selectedStudent.email}</p>
                  <p className="text-sm text-gray-600">Age Group: {selectedStudent.age_group}</p>
                  <p className="text-sm text-gray-600">Level: {getLevelInfo(selectedStudent.learning_level).name}</p>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-800 mb-2">Learning Stats</h4>
                  <p className="text-sm text-gray-600">Total Time: {formatTime(selectedStudent.total_learning_time || 0)}</p>
                  <p className="text-sm text-gray-600">Progress: {Math.round(getSkillProgress(selectedStudent.skill_progress))}%</p>
                  <p className="text-sm text-gray-600">Subscription: {selectedStudent.subscription_type || 'Free'}</p>
                </div>
              </div>

              {/* Skill Progress */}
              <div>
                <h4 className="font-semibold text-gray-800 mb-4">Skill Progress</h4>
                <div className="space-y-3">
                  {Object.entries(selectedStudent.skill_progress || {}).map(([skill, progress]) => (
                    <div key={skill}>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium capitalize">{skill.replace('_', ' ')}</span>
                        <span className="text-sm">{progress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="h-2 bg-purple-500 rounded-full"
                          style={{ width: `${progress}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Activities */}
              <div>
                <h4 className="font-semibold text-gray-800 mb-4">Recent Activities</h4>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {selectedStudent.recent_activities?.map((activity, index) => (
                    <div key={index} className="flex items-center p-3 bg-gray-50 rounded-lg">
                      <span className="text-xl mr-3">{getActivityIcon(activity.activity_type)}</span>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-800">
                          {activity.activity_type.replace('_', ' ').toUpperCase()}
                        </p>
                        <p className="text-xs text-gray-500">
                          {new Date(activity.timestamp).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  )) || (
                    <p className="text-gray-500 text-center py-4">No recent activities</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AnalyticsDashboard;