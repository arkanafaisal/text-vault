// src/components/landing/Navbar.jsx
import React, { useState } from 'react';
import { Zap, Moon, Sun } from 'lucide-react';
import AuthModal from './AuthModal';

export default function Navbar({ isDarkMode, toggleTheme }) {
  const [authModal, setAuthModal] = useState({ isOpen: false, type: 'login' });

  const openModal = (type) => setAuthModal({ isOpen: true, type });
  const closeModal = () => setAuthModal(prev => ({ ...prev, isOpen: false }));
  const setModalType = (type) => setAuthModal(prev => ({ ...prev, type }));

  return (
    <>
      <header className="w-full sticky top-0 z-40 bg-[var(--background)]/80 backdrop-blur-md border-b border-zinc-300 dark:border-zinc-800 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 md:px-8 py-3.5 md:py-4 flex justify-between items-center">
          <a href="/" className="flex items-center gap-1.5 md:gap-2 font-bold text-lg md:text-xl tracking-tight cursor-pointer hover:opacity-80 transition-opacity">
            <Zap className="w-5 h-5 md:w-6 md:h-6 text-[var(--primary)]" />
            <span>TextVault</span>
          </a>
          
          <div className="flex items-center gap-2 md:gap-4">
            <button 
              onClick={toggleTheme} 
              className="p-1.5 md:p-2 rounded-full hover:bg-[var(--secondary)] transition-colors text-[var(--muted-foreground)] hover:text-[var(--foreground)] cursor-pointer flex-shrink-0"
              aria-label="Toggle Dark Mode"
            >
              {isDarkMode ? <Sun className="w-4 h-4 md:w-5 md:h-5" /> : <Moon className="w-4 h-4 md:w-5 md:h-5" />}
            </button>
            
            <button 
              onClick={() => openModal('login')}
              className="text-xs md:text-sm font-medium hover:text-[var(--primary)] transition-colors cursor-pointer px-1 md:px-2"
            >
              Login
            </button>
            <button 
              onClick={() => openModal('signup')}
              className="whitespace-nowrap bg-[var(--foreground)] text-[var(--background)] px-3 md:px-4 py-1.5 md:py-2 rounded-[var(--radius)] text-xs md:text-sm font-medium hover:opacity-90 transition-all shadow-md cursor-pointer border border-zinc-800 dark:border-zinc-200"
            >
              Sign Up
            </button>
          </div>
        </div>
      </header>

      <AuthModal 
        isOpen={authModal.isOpen} 
        onClose={closeModal} 
        type={authModal.type} 
        setType={setModalType} 
      />
    </>
  );
}