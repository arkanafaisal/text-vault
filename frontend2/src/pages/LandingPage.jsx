// src/pages/LandingPage.jsx
import React from 'react';
import Navbar from '../components/landing/Navbar';
import HeroSection from '../components/landing/HeroSection';
import FeatureSection from '../components/landing/FeatureSection';
import Footer from '../components/landing/Footer';

export default function LandingPage({ isDarkMode, toggleTheme }) {
  return (
    <div className="min-h-screen flex flex-col items-center">
      <Navbar isDarkMode={isDarkMode} toggleTheme={toggleTheme} />

      <main className="w-full flex-1 flex flex-col items-center">
        <HeroSection />
        <FeatureSection />
      </main>

      <Footer />
    </div>
  );
}