import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useUser } from '../App';
import { Button } from './ui/button';
import { Badge } from './ui/badge';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, ageLevel } = useUser();
  const navigate = useNavigate();

  const getAgeLevelInfo = (level) => {
    const ageLevelData = {
      '4-6': { name: 'Little Learners', emoji: '🌟' },
      '7-9': { name: 'Young Explorers', emoji: '🚀' },
      '10-12': { name: 'Smart Kids', emoji: '⚡' },
      '13-15': { name: 'Tech Teens', emoji: '💻' },
      '16-18': { name: 'Future Leaders', emoji: '🎯' }
    };
    return ageLevelData[level] || { name: 'Student', emoji: '👋' };
  };

  const levelInfo = user ? getAgeLevelInfo(ageLevel) : null;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white shadow-lg border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-lg">T</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                TecaiKids
              </h1>
              <p className="text-xs text-gray-500 -mt-1">TEC Sri Lanka Worldwide Initiative</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
              Home
            </Link>
            <Link to="/pricing" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
              Pricing
            </Link>
            <Link to="/courses" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
              Courses
            </Link>

            {user ? (
              <div className="flex items-center space-x-4">
                <Link 
                  to="/unified-dashboard"
                  className="flex items-center space-x-2 bg-blue-50 hover:bg-blue-100 px-3 py-2 rounded-lg transition-colors"
                >
                  <span>{levelInfo.emoji}</span>
                  <span className="font-medium text-blue-700">
                    {user.name.split(' ')[0]}
                  </span>
                </Link>
                <Badge variant="outline" className="text-blue-600 border-blue-300">
                  {levelInfo.name}
                </Badge>
              </div>
            ) : (
              <Link to="/unified-age-selector">
                <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold px-6 py-2 rounded-full">
                  Get Started
                </Button>
              </Link>
            )}
          </nav>

          {/* Mobile menu button */}
          <button 
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-white border-t">
              <Link 
                to="/" 
                className="block px-3 py-2 text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-md"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link 
                to="/pricing" 
                className="block px-3 py-2 text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-md"
                onClick={() => setIsMenuOpen(false)}
              >
                Pricing
              </Link>
              <Link 
                to="/courses" 
                className="block px-3 py-2 text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-md"
                onClick={() => setIsMenuOpen(false)}
              >
                Courses
              </Link>

              {user ? (
                <div className="px-3 py-2 border-t border-gray-200 mt-2">
                  <div className="flex items-center space-x-3 mb-3">
                    <span className="text-2xl">{levelInfo.emoji}</span>
                    <div>
                      <p className="font-medium text-gray-800">{user.name}</p>
                      <p className="text-sm text-blue-600">{levelInfo.name}</p>
                    </div>
                  </div>
                  <Link 
                    to="/unified-dashboard"
                    className="block w-full text-left px-3 py-2 bg-blue-500 text-white rounded-md font-medium"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Go to Dashboard
                  </Link>
                </div>
              ) : (
                <div className="px-3 py-2 border-t border-gray-200 mt-2">
                  <Link 
                    to="/unified-age-selector"
                    className="block w-full text-center px-3 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-md font-bold"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Get Started
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;