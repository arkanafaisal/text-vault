// src/pages/LandingPage.jsx
import React, { useState, useEffect } from 'react';
import Navbar from '../components/landing/Navbar';
import HeroSection from '../components/landing/HeroSection';
import FeatureSection from '../components/landing/FeatureSection';
import Footer from '../components/landing/Footer';
import api from '../utils/api';
import { navigate } from '../utils/navigation';
import { Loader2 } from 'lucide-react';

export default function LandingPage({ isDarkMode, toggleTheme }) {
  const [authModal, setAuthModal] = useState({ isOpen: false, type: 'login' });
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const { response, result } = await api.users.getMe();
      
      if (response && response.ok && result && result.success) {
        navigate('/dashboard');
        return;
      } else {
        // Opsional: Bersihkan token yang tidak valid agar tidak nyangkut
        localStorage.removeItem('accessToken');
      }

      setIsCheckingAuth(false);
    };

    checkAuth();
  }, []);

  const openAuthModal = (type) => {
    setAuthModal({ isOpen: true, type });
  };

  if (isCheckingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--background)] text-[var(--foreground)]">
        <Loader2 className="w-8 h-8 animate-spin text-[var(--primary)]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center">
      <Navbar 
        isDarkMode={isDarkMode} 
        toggleTheme={toggleTheme} 
        authModal={authModal} 
        setAuthModal={setAuthModal} 
      />

      <main className="w-full flex-1 flex flex-col items-center">
        <HeroSection />
        <FeatureSection openAuthModal={openAuthModal} />
      </main>

      <Footer />
    </div>
  );
}