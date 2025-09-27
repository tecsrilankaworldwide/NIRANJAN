import React from 'react';

const Homepage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 text-white">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <div className="text-6xl mb-6">🚀</div>
            <h1 className="text-4xl font-bold mb-4">Welcome to TEC Future-Ready Learning</h1>
            <p className="text-xl text-purple-100 mb-6">
              Preparing Sri Lankan children for tomorrow's world through AI, Logic, and Creative Problem Solving
            </p>
            <p className="text-lg text-purple-200">42 Years of Educational Excellence • Ages 5-16</p>
          </div>
        </div>
      </div>

      {/* Additional content can be added here */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-8">Start Your Learning Journey</h2>
          <div className="space-x-4">
            <a 
              href="/login" 
              className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-lg font-medium transition-colors"
            >
              Get Started
            </a>
            <a 
              href="/dashboard" 
              className="bg-white hover:bg-gray-50 text-purple-600 border border-purple-600 px-8 py-3 rounded-lg font-medium transition-colors"
            >
              Dashboard
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Homepage;