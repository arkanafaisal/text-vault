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
    let isMounted = true;

    // Di dalam src/pages/LandingPage.jsx (Fokus pada fungsi checkAuth)

    const checkAuth = async () => {
      try {
        // Cukup ambil 'success' dari objek kembalian
        const { success } = await api.users.getMe();
        
        if (!isMounted) {
          return;
        }

        // Pengecekan menjadi jauh lebih bersih
        if (success) {
          navigate('/dashboard');
          return; 
        } else {
          localStorage.removeItem('accessToken');
        }
      } catch (error) {
        // Abaikan error jaringan saat pengecekan di background
      } finally {
        if (isMounted) {
          setIsCheckingAuth(false);
        }
      }
    };

    // Langsung panggil tanpa pengecekan token lokal
    checkAuth();

    return () => {
      isMounted = false;
    };
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