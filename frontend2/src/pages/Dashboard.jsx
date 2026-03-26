// src/pages/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import api from '../utils/api';
import { navigate } from '../utils/navigation';
import { Loader2, User } from 'lucide-react';

// Import komponen Navbar khusus Dashboard
import DashboardNavbar from '../components/dashboard/Navbar';

export default function Dashboard({ isDarkMode, toggleTheme }) {
  const { t } = useTranslation();
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      setIsLoading(true);
      const { response, result } = await api.users.getMe();
      
      if (response.ok && result.success && result.data) {
        setUser(result.data);
      } else {
        navigate('/');
      }
      setIsLoading(false);
    };

    fetchUserData();
  }, []);

  const handleUpdateUser = (field, value) => {
    setUser((prev) => {
      const updatedUser = { ...prev };

      // Tangkap keduanya agar kebal dari perubahan nama field
      if (field === 'username' || field === 'display_name') {
        updatedUser.display_name = value; // Untuk UI
        updatedUser.username = value.toLowerCase(); // Untuk kebutuhan sistem
      } else {
        updatedUser[field] = value; // Untuk email, publicKey, dll
      }

      return updatedUser;
    });
  };

  const handleLogout = async () => {
    await api.auth.logout();
    localStorage.removeItem('accessToken');
    navigate('/');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--background)] text-[var(--foreground)]">
        <Loader2 className="w-8 h-8 animate-spin text-[var(--primary)]" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen flex flex-col bg-[var(--background)] text-[var(--foreground)]">
      
      {/* Panggil DashboardNavbar di sini */}
      <DashboardNavbar 
        isDarkMode={isDarkMode} 
        toggleTheme={toggleTheme} 
        user={user} 
        onLogout={handleLogout} 
        onUpdateUser={handleUpdateUser}
      />

      {/* Konten Utama */}
      <main className="flex-1 w-full max-w-6xl mx-auto px-4 md:px-8 py-8 md:py-12">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">
            {t('dashboard.welcome')}, <span className="text-[var(--primary)]">{user.display_name}</span>!
          </h1>
        </div>

        {/* Kartu Profil Sementara */}
        <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-6 md:p-8 shadow-sm max-w-xl">
          <div className="flex items-center gap-3 mb-6 pb-6 border-b border-[var(--border)]">
            <div className="p-3 bg-[var(--secondary)] rounded-xl border border-[var(--border)]">
              <User className="w-6 h-6 text-[var(--foreground)]" />
            </div>
            <h2 className="text-xl font-bold">{t('dashboard.profileInfo')}</h2>
          </div>
          
          <div className="space-y-4 text-sm md:text-base">
            <div className="grid grid-cols-3 gap-4">
              <span className="text-[var(--muted-foreground)] font-medium">{t('dashboard.username')}</span>
              <span className="col-span-2 font-semibold text-[var(--foreground)]">{user.username}</span>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <span className="text-[var(--muted-foreground)] font-medium">{t('dashboard.email')}</span>
              <span className="col-span-2 font-semibold text-[var(--foreground)]">
                {user.email || <span className="italic text-[var(--muted-foreground)]">{t('dashboard.notAvailable')}</span>}
              </span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}