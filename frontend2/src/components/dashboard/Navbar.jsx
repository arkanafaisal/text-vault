// src/components/dashboard/Navbar.jsx
import React, { useState } from 'react';
import { Zap, Moon, Sun, User, LogOut } from 'lucide-react';
import ProfileModal from './ProfileModal';

export default function DashboardNavbar({ isDarkMode, toggleTheme, user, onLogout, onUpdateUser }) {
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  return (
    <>
      <header className="w-full sticky top-0 z-40 bg-[var(--background)]/80 backdrop-blur-md border-b border-[var(--border)] shadow-sm">
        <div className="max-w-6xl mx-auto px-4 md:px-8 py-3.5 md:py-4 flex justify-between items-center">
          
          <div className="flex items-center gap-1.5 md:gap-2 font-bold text-lg md:text-xl tracking-tight">
            <Zap className="w-5 h-5 md:w-6 md:h-6 text-[var(--primary)]" />
            <span>TextVault</span>
          </div>
          
          <div className="flex items-center gap-2 md:gap-4">
            <button 
              onClick={toggleTheme} 
              className="p-1.5 md:p-2 rounded-full hover:bg-[var(--secondary)] transition-colors text-[var(--muted-foreground)] hover:text-[var(--foreground)] cursor-pointer flex-shrink-0"
              aria-label="Toggle Dark Mode"
            >
              {isDarkMode ? <Sun className="w-4 h-4 md:w-5 md:h-5" /> : <Moon className="w-4 h-4 md:w-5 md:h-5" />}
            </button>
            
            {/* Mengganti ikon Settings menjadi User untuk Profile */}
            <button 
              onClick={() => setIsProfileOpen(true)}
              className="p-1.5 md:p-2 rounded-full hover:bg-[var(--secondary)] transition-colors text-[var(--muted-foreground)] hover:text-[var(--foreground)] cursor-pointer flex-shrink-0"
              aria-label="Profile"
            >
              <User className="w-4 h-4 md:w-5 md:h-5" />
            </button>
            
            <button 
              onClick={onLogout}
              className="flex items-center gap-1.5 text-xs md:text-sm font-medium text-[var(--muted-foreground)] hover:text-[var(--destructive)] transition-colors cursor-pointer px-1 md:px-2 p-1.5 rounded-lg hover:bg-[var(--destructive)]/10"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden md:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Render ProfileModal */}
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