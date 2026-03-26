// src/App.jsx
import React, { useState, useEffect } from 'react';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import VerifyEmail from './pages/VerifyEmail'; // <-- Import komponennya
import ResetPassword from './pages/ResetPassword';

export default function App() {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') === 'dark' || 
        (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches);
    }
    return false;
  });

  useEffect(() => {
    const root = document.documentElement;
    if (isDarkMode) {
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  const toggleTheme = () => setIsDarkMode(prev => !prev);
  const [currentPath, setCurrentPath] = useState(window.location.pathname);

  useEffect(() => {
    const handleLocationChange = () => {
      setCurrentPath(window.location.pathname);
    };

    window.addEventListener('popstate', handleLocationChange);
    return () => {
      window.removeEventListener('popstate', handleLocationChange);
    };
  }, []);

  if (currentPath === '/dashboard') {
    return <Dashboard isDarkMode={isDarkMode} toggleTheme={toggleTheme} />;
  }

  if (currentPath.startsWith('/auth/verify-email/')) {
    const token = currentPath.split('/verify-email/')[1];
    if (token) {
      return <VerifyEmail token={token} />;
    }
  }

  if (currentPath.startsWith('/auth/reset-password/')) {
    const token = currentPath.split('/reset-password/')[1];
    if (token) {
      return <ResetPassword token={token} />;
    }
  }

  return <LandingPage isDarkMode={isDarkMode} toggleTheme={toggleTheme} />
}