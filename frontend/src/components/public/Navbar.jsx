// src/components/public/Navbar.jsx
import React from 'react';
import { Zap, Moon, Sun, ArrowLeft } from 'lucide-react';
import { useTranslation } from 'react-i18next'; // <-- IMPORT
import { navigate } from '../../utils/navigation';

export default function Navbar({ isDarkMode, toggleTheme }) {
  const { t } = useTranslation(); // <-- HOOK

  return (
    <header className="w-full sticky top-0 z-40 bg-[var(--background)]/80 backdrop-blur-md border-b border-[var(--border)] shadow-sm">
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
            onClick={() => navigate('/')}
            className="flex items-center gap-1.5 text-xs md:text-sm font-bold text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors cursor-pointer px-2 py-1.5 rounded-lg hover:bg-[var(--secondary)] group"
          >
            <ArrowLeft className="w-3.5 h-3.5 md:w-4 md:h-4 group-hover:-translate-x-0.5 transition-transform" />
            <span className="hidden sm:inline">{t('public.navbar.backHome')}</span>
            <span className="sm:hidden">{t('public.navbar.back')}</span>
          </button>
        </div>
      </div>
    </header>
  );
}