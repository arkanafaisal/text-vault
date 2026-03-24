// src/pages/LandingPage.jsx
import React from 'react';
import Navbar from '../components/landing/Navbar';
import HeroSection from '../components/landing/HeroSection';
import FeatureSection from '../components/landing/FeatureSection';
import Footer from '../components/landing/Footer';

export default function LandingPage({ isDarkMode, toggleTheme }) {
  const [authModal, setAuthModal] = React.useState({ isOpen: false, type: 'login' });

  const openAuthModal = (type) => setAuthModal({ isOpen: true, type });

  return (
    <div className="min-h-screen flex flex-col items-center">
      {/* Kirim state dan fungsi ke Navbar */}
      <Navbar 
        isDarkMode={isDarkMode} 
        toggleTheme={toggleTheme} 
        authModal={authModal} 
        setAuthModal={setAuthModal} 
      />

      <main className="w-full flex-1 flex flex-col items-center">
        <HeroSection />
        {/* Kirim fungsi openModal ke FeatureSection */}
        <FeatureSection openAuthModal={openAuthModal} />
      </main>

      <Footer />
    </div>
  );
}