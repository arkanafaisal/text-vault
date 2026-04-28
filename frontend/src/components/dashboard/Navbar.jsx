// src/components/dashboard/Navbar.jsx
import React, { useState } from 'react';
import { Zap, Moon, Sun, User, LogOut, Globe } from 'lucide-react'; // 1. Tambahkan Globe
import { useTranslation } from 'react-i18next'; // <-- IMPORT
import { navigate } from '../../utils/navigation'; // 2. Import navigate
import ProfileModal from './ProfileModal';
import { toast } from '../../utils/toast';

export default function Navbar({ isDarkMode, toggleTheme, user, onLogout, onUpdateUser }) {
  const { t } = useTranslation(); // <-- HOOK
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  return (
    <>
      <header className="w-full sticky top-0 z-40 bg-[var(--background)]/80 backdrop-blur-md border-b border-[var(--border)] shadow-sm">
        <div className="max-w-6xl mx-auto px-4 md:px-8 py-3.5 md:py-4 flex justify-between items-center">
          
          <div className="flex items-center gap-1.5 md:gap-2 font-bold text-lg md:text-xl tracking-tight cursor-default">
            <Zap className="w-5 h-5 md:w-6 md:h-6 text-[var(--primary)]" />
            <span>TextVault</span>
          </div>
          
          <div className="flex items-center gap-1.5 md:gap-4">
            
            {/* 3. TAMBAHAN TOMBOL PUBLIC PAGE */}
            <button 
              onClick={() => {
                toast.clear(); // Hapus notifikasi "Welcome"
                navigate('/public'); // Baru pindah halaman
              }}
              className="p-1.5 md:p-2 rounded-full hover:bg-[var(--secondary)] transition-colors text-[var(--muted-foreground)] hover:text-[var(--primary)] cursor-pointer flex-shrink-0"
              aria-label={t('dashboard.navbar.publicAria')}
              title={t('dashboard.navbar.publicTitle')}
            >
              <Globe className="w-4 h-4 md:w-5 md:h-5" />
            </button>

            <button 
              onClick={toggleTheme} 
              className="p-1.5 md:p-2 rounded-full hover:bg-[var(--secondary)] transition-colors text-[var(--muted-foreground)] hover:text-[var(--foreground)] cursor-pointer flex-shrink-0"
              aria-label={t('dashboard.navbar.themeAria')}
              title={t('dashboard.navbar.themeTitle')}
            >
              {isDarkMode ? <Sun className="w-4 h-4 md:w-5 md:h-5" /> : <Moon className="w-4 h-4 md:w-5 md:h-5" />}
            </button>
            
            <button 
              onClick={() => setIsProfileOpen(true)}
              className="p-1.5 md:p-2 rounded-full hover:bg-[var(--secondary)] transition-colors text-[var(--muted-foreground)] hover:text-[var(--foreground)] cursor-pointer flex-shrink-0"
              aria-label={t('dashboard.navbar.profileAria')}
              title={t('dashboard.navbar.profileTitle')}
            >
              <User className="w-4 h-4 md:w-5 md:h-5" />
            </button>
            
            <button 
              onClick={onLogout}
              className="flex items-center gap-1.5 text-xs md:text-sm font-medium text-[var(--muted-foreground)] hover:text-[var(--destructive)] transition-colors cursor-pointer px-1 md:px-2 p-1.5 rounded-lg hover:bg-[var(--destructive)]/10"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden md:inline">{t('dashboard.navbar.logout')}</span>
            </button>
          </div>
        </div>
      </header>

      {user && (
        <ProfileModal 
          isOpen={isProfileOpen} 
          onClose={() => setIsProfileOpen(false)} 
          user={user}
          onUpdateUser={onUpdateUser}
        />
      )}
    </>
  );
}