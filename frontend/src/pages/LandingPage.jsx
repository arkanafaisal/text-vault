// src/pages/LandingPage.jsx
import React from 'react';
import Navbar from '../components/landing/Navbar';
import HeroSection from '../components/landing/HeroSection';
import FeatureSection from '../components/landing/FeatureSection';
import Footer from '../components/landing/Footer';
import { Loader2 } from 'lucide-react';
import { useLanding } from '../hooks/useLanding'; // <-- IMPORT HOOK

export default function LandingPage({ isDarkMode, toggleTheme }) {
  
  // SEMUA STATE DIAMBIL DARI HOOK
  const { 
    authModal, 
    setAuthModal, 
    isCheckingAuth, 
    openAuthModal 
  } = useLanding();

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