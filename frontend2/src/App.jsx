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

  return (
    <>
      <LandingPage isDarkMode={isDarkMode} toggleTheme={toggleTheme} />
      {/* <Toaster /> nantinya akan diletakkan di sini */}
    </>
  );
}