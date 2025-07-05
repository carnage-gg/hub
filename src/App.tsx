import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Setup from './pages/Setup';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Schedule from './pages/Schedule';
import Assignments from './pages/Assignments';
import Notes from './pages/Notes';
import GpaCalculator from './pages/GpaCalculator';
import StudyTimer from './pages/StudyTimer';
import Calendar from './pages/Calendar';
import Layout from './components/Layout';

interface UserData {
  name: string;
  school: string;
  age: string;
  grade: string;
  password: string;
  isSetup: boolean;
}

function App() {
  const [user, setUser] = useState<UserData | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing user data and authentication
    const userData = localStorage.getItem('schoolApp_user');
    const authStatus = localStorage.getItem('schoolApp_authenticated');
    
    if (userData) {
      setUser(JSON.parse(userData));
    }
    
    if (authStatus === 'true') {
      setIsAuthenticated(true);
    }
    
    setIsLoading(false);
  }, []);

  const handleSetup = (userData: UserData) => {
    setUser(userData);
    setIsAuthenticated(true);
    localStorage.setItem('schoolApp_user', JSON.stringify(userData));
    localStorage.setItem('schoolApp_authenticated', 'true');
  };

  const handleLogin = (password: string) => {
    if (user && password === user.password) {
      setIsAuthenticated(true);
      localStorage.setItem('schoolApp_authenticated', 'true');
      return true;
    }
    return false;
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('schoolApp_authenticated');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ 
            duration: 0.6,
            repeat: Infinity,
            repeatType: "reverse"
          }}
          className="text-white text-xl font-medium"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-8 h-8 border-2 border-purple-400 border-t-transparent rounded-full mx-auto mb-4"
          />
          Loading...
        </motion.div>
      </div>
    );
  }

  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <AnimatePresence mode="wait">
          <Routes>
            <Route
              path="/setup"
              element={
                !user?.isSetup ? (
                  <Setup onSetup={handleSetup} />
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />
            <Route
              path="/login"
              element={
                user?.isSetup && !isAuthenticated ? (
                  <Login onLogin={handleLogin} />
                ) : user?.isSetup && isAuthenticated ? (
                  <Navigate to="/dashboard" replace />
                ) : (
                  <Navigate to="/setup" replace />
                )
              }
            />
            <Route
              path="/"
              element={
                !user?.isSetup ? (
                  <Navigate to="/setup" replace />
                ) : !isAuthenticated ? (
                  <Navigate to="/login" replace />
                ) : (
                  <Navigate to="/dashboard" replace />
                )
              }
            />
            {isAuthenticated && user && (
              <Route
                path="/"
                element={<Layout user={user} onLogout={handleLogout} />}
              >
                <Route path="dashboard" element={<Dashboard user={user} />} />
                <Route path="schedule" element={<Schedule />} />
                <Route path="assignments" element={<Assignments />} />
                <Route path="notes" element={<Notes />} />
                <Route path="gpa" element={<GpaCalculator />} />
                <Route path="timer" element={<StudyTimer />} />
                <Route path="calendar" element={<Calendar />} />
              </Route>
            )}
          </Routes>
        </AnimatePresence>
      </div>
    </Router>
  );
}

export default App;