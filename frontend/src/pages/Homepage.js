import React from 'react';

const Homepage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 text-white">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <div className="flex justify-center space-x-4 text-6xl mb-6">
              <span className="animate-bounce">🚀</span>
              <span className="animate-pulse">🧠</span>
              <span className="animate-bounce delay-75">🌟</span>
            </div>
            <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-white to-purple-100 bg-clip-text text-transparent">
              Welcome to TEC Future-Ready Learning
            </h1>
            <p className="text-xl text-purple-100 mb-6 max-w-3xl mx-auto">
              Empowering Sri Lankan children with <strong className="text-yellow-200">AI literacy</strong>, <strong className="text-blue-200">logical thinking</strong>, and <strong className="text-green-200">creative problem-solving</strong> for tomorrow's careers
            </p>
            <div className="flex items-center justify-center space-x-8 text-purple-200">
              <div className="flex items-center">
                <span className="text-2xl mr-2">🏆</span>
                <span className="font-semibold">42 Years Excellence</span>
              </div>
              <div className="flex items-center">
                <span className="text-2xl mr-2">👶</span>
                <span className="font-semibold">Ages 5-16</span>
              </div>
              <div className="flex items-center">
                <span className="text-2xl mr-2">🌍</span>
                <span className="font-semibold">Global Standards</span>
              </div>
            </div>
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