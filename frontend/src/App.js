import React, { createContext, useContext, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import UnifiedAgeSelector from './pages/UnifiedAgeSelector';
import UnifiedDashboard from './pages/UnifiedDashboard';
import PricingPage from './pages/PricingPage';
import Courses from './pages/Courses';
import Quiz from './pages/Quiz';

// Legacy routes for backward compatibility
import AgeSelector from './pages/AgeSelector';
import TeenSelector from './pages/TeenSelector';
import Dashboard from './pages/Dashboard';
import TeenDashboard from './pages/TeenDashboard';

// User Context for unified platform
const UserContext = createContext();

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

function App() {
  const [user, setUser] = useState(null);
  const [ageLevel, setAgeLevel] = useState(null);

  return (
    <UserContext.Provider value={{ 
      user, 
      setUser, 
      ageLevel, 
      setAgeLevel 
    }}>
      <Router>
        <div className="App">
          <Header />
          <main className="main-content">
            <Routes>
              {/* Unified Platform Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/unified-age-selector" element={<UnifiedAgeSelector />} />
              <Route path="/unified-dashboard" element={<UnifiedDashboard />} />
              <Route path="/pricing" element={<PricingPage />} />
              <Route path="/courses" element={<Courses />} />
              <Route path="/quiz/:quizId" element={<Quiz />} />
              
              {/* Legacy Routes (for backward compatibility) */}
              <Route path="/age-selector" element={<AgeSelector />} />
              <Route path="/teen-selector" element={<TeenSelector />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/teen-dashboard" element={<TeenDashboard />} />
              
              {/* Payment Success/Cancel Routes */}
              <Route path="/payment-success" element={<PaymentSuccess />} />
              <Route path="/payment-cancel" element={<PaymentCancel />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </UserContext.Provider>
  );
}

// Payment Success Component
const PaymentSuccess = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
      <div className="text-center p-8">
        <div className="text-6xl mb-4">🎉</div>
        <h1 className="text-3xl font-bold text-green-600 mb-4">Payment Successful!</h1>
        <p className="text-lg text-gray-600 mb-8">
          Welcome to TecaiKids! Your subscription has been activated.
        </p>
        <div className="space-x-4">
          <button 
            onClick={() => window.location.href = '/unified-dashboard'}
            className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-3 rounded-lg font-bold hover:opacity-90 transition-all"
          >
            Go to Dashboard
          </button>
          <button 
            onClick={() => window.location.href = '/'}
            className="bg-gray-200 text-gray-700 px-8 py-3 rounded-lg font-bold hover:bg-gray-300 transition-all"
          >
            Go to Home
          </button>
        </div>
      </div>
    </div>
  );
};

// Payment Cancel Component
const PaymentCancel = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center">
      <div className="text-center p-8">
        <div className="text-6xl mb-4">😔</div>
        <h1 className="text-3xl font-bold text-red-600 mb-4">Payment Cancelled</h1>
        <p className="text-lg text-gray-600 mb-8">
          Your payment was cancelled. You can try again anytime.
        </p>
        <div className="space-x-4">
          <button 
            onClick={() => window.location.href = '/pricing'}
            className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-3 rounded-lg font-bold hover:opacity-90 transition-all"
          >
            Try Again
          </button>
          <button 
            onClick={() => window.location.href = '/'}
            className="bg-gray-200 text-gray-700 px-8 py-3 rounded-lg font-bold hover:bg-gray-300 transition-all"
          >
            Go to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default App;