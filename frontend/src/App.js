import React, { createContext, useContext, useState } from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import About from "./pages/About";
import Courses from "./pages/Courses";
import Activities from "./pages/Activities";
import Contact from "./pages/Contact";
import AgeSelector from "./pages/AgeSelector";
import Dashboard from "./pages/Dashboard";
import Quiz from "./pages/Quiz";
import { Toaster } from "./components/ui/toaster";

// User Context for age level and user data
const UserContext = createContext();

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

function App() {
  const [user, setUser] = useState(null);
  const [ageLevel, setAgeLevel] = useState(null);

  return (
    <UserContext.Provider value={{ user, setUser, ageLevel, setAgeLevel }}>
      <div className="App min-h-screen bg-white">
        <BrowserRouter>
          <Header />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/age-selector" element={<AgeSelector />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/about" element={<About />} />
              <Route path="/courses" element={<Courses />} />
              <Route path="/activities" element={<Activities />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/quiz/:quizId" element={<Quiz />} />
            </Routes>
          </main>
          <Footer />
          <Toaster />
        </BrowserRouter>
      </div>
    </UserContext.Provider>
  );
}

export default App;