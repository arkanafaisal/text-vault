// src/App.jsx
import React, { useState, useEffect } from 'react';
import LandingPage from './pages/LandingPage';

export default function App() {
  // Inisialisasi state: Cek localStorage ATAU preferensi sistem OS
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') === 'dark' || 
        (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches);
    }
    return false;
  });

  // Terapkan class 'dark' ke <html> setiap state berubah
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

  // Fungsi untuk dipassing ke komponen anak
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
    // return <Dashboard />;
  }
  
  if (currentPath.startsWith('/profile/')) {
    const publicId = currentPath.split('/profile/')[1];
    if (publicId) {
      // return <Profile publicId={publicId} />;
    }
  }

  // Routing untuk Verify Email
  if (currentPath.startsWith('/verify-email/')) {
    const token = currentPath.split('/verify-email/')[1];
    // if (token) return <VerifyEmail token={token} />;
  }

  // Routing untuk Reset Password
  if (currentPath.startsWith('/reset-password/')) {
    const token = currentPath.split('/reset-password/')[1];
    // if (token) return <ResetPassword token={token} />;
  }

  return (
    <>
      <LandingPage isDarkMode={isDarkMode} toggleTheme={toggleTheme} />
      {/* <Toaster /> nantinya akan diletakkan di sini */}
    </>
  );
}