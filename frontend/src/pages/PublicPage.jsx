// src/pages/PublicPage.jsx
import React from 'react';
import { Globe, Search, User, Key, Loader2, ChevronLeft, ChevronRight } from 'lucide-react'; // <-- TAMBAH ICON
import { useTranslation } from 'react-i18next';
import Navbar from '../components/public/Navbar'; 
import PublicDataCard from '../components/public/PublicDataCard'; 
import FeedbackFooter from '../components/common/FeedbackFooter'; // <-- PASTIKAN ADA
import { usePublicPage } from '../hooks/usePublicPage';
import { VALIDATION } from '../utils/constants';

export default function PublicPage({ isDarkMode, toggleTheme }) {
  const { t } = useTranslation();
  
  const {
    formData, data, isLoading, hasSearched, page, hasNextPage,
    handleInputChange, handleSearch, handleCopy, handleNextPage, handlePrevPage
  } = usePublicPage();

  return (
    <div className="min-h-screen flex flex-col bg-[var(--background)] text-[var(--foreground)] relative">
      <Navbar isDarkMode={isDarkMode} toggleTheme={toggleTheme} />

      <main className="flex-1 w-full max-w-5xl mx-auto px-4 py-8 md:py-12 flex flex-col items-center">
        
        <div className="text-center mb-8 md:mb-12">
          <div className="w-16 h-16 bg-[var(--primary)]/10 text-[var(--primary)] rounded-2xl flex items-center justify-center mx-auto mb-4 border border-[var(--primary)]/20 shadow-sm">
            <Globe className="w-8 h-8" />
          </div>
          <h1 className="text-3xl md:text-4xl font-black tracking-tight mb-3">{t('public.hero.title')}</h1>
          <p className="text-[var(--muted-foreground)] text-sm md:text-base max-w-xl mx-auto">
            {t('public.hero.desc')}
          </p>
        </div>

        <div className="w-full max-w-2xl bg-[var(--card)] p-4 md:p-6 rounded-[2rem] border border-[var(--border-strong)] shadow-xl mb-10">
          <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-3 md:gap-4">
            <div className="flex-1 relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2"><User className="w-4 h-4 text-[var(--muted-foreground)]" /></div>
              <input 
                type="text" name="username" value={formData.username} onChange={handleInputChange} 
                placeholder={t('public.form.username')} required disabled={isLoading} 
                maxLength={VALIDATION.USER.MAX_USERNAME}
                className="w-full pl-9 pr-4 py-3 bg-[var(--background)] border border-[var(--border)] rounded-xl outline-none focus:ring-2 focus:ring-[var(--primary)] text-sm shadow-inner transition-shadow" 
              />
            </div>
            <div className="flex-1 relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2"><Key className="w-4 h-4 text-[var(--muted-foreground)]" /></div>
              <input 
                type="text" name="publicKey" value={formData.publicKey} onChange={handleInputChange} 
                placeholder={t('public.form.publicKey')} required disabled={isLoading} 
                maxLength={VALIDATION.USER.MAX_PUBLIC_KEY}
                className="w-full pl-9 pr-4 py-3 bg-[var(--background)] border border-[var(--border)] rounded-xl outline-none focus:ring-2 focus:ring-[var(--primary)] text-sm shadow-inner transition-shadow" 
              />
            </div>
            <button type="submit" disabled={isLoading} className="px-6 py-3 bg-[var(--foreground)] text-[var(--background)] font-bold rounded-xl hover:opacity-90 shadow-md transition-all active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70">
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
              <span className="md:hidden lg:inline">{t('public.form.btn')}</span>
            </button>
          </form>
        </div>

        <div className="w-full flex-1">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader2 className="w-10 h-10 text-[var(--primary)] animate-spin mb-4" />
              <p className="text-[var(--muted-foreground)] font-bold tracking-widest uppercase text-xs animate-pulse">{t('public.status.loading')}</p>
            </div>
          ) : hasSearched ? (
            data.length > 0 ? (
              <>
                <div className="flex flex-wrap gap-2 md:gap-3">
                  {data.map(item => (
                    <PublicDataCard key={item.id} item={item} onCopy={handleCopy} />
                  ))}
                </div>

                {/* UI PAGINASI */}
                {(page > 1 || hasNextPage) && (
                  <div className="mt-10 flex items-center justify-center gap-3 animate-in fade-in slide-in-from-bottom-2">
                    <button
                      onClick={handlePrevPage}
                      disabled={page === 1 || isLoading}
                      className="flex items-center gap-1 px-4 py-2 bg-[var(--card)] border border-[var(--border-strong)] text-[var(--foreground)] text-sm font-bold rounded-xl hover:bg-[var(--secondary)] transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                    >
                      <ChevronLeft className="w-4 h-4" />
                      {t('dashboard.paginationPrev')}
                    </button>
                    
                    <div className="px-4 py-2 bg-[var(--secondary)] border border-[var(--border)] rounded-xl text-sm font-bold text-[var(--foreground)] shadow-inner">
                      {t('dashboard.paginationPage')} {page}
                    </div>

                    <button
                      onClick={handleNextPage}
                      disabled={!hasNextPage || isLoading}
                      className="flex items-center gap-1 px-4 py-2 bg-[var(--card)] border border-[var(--border-strong)] text-[var(--foreground)] text-sm font-bold rounded-xl hover:bg-[var(--secondary)] transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                    >
                      {t('dashboard.paginationNext')}
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="w-full py-12 flex flex-col items-center justify-center text-[var(--muted-foreground)] border-2 border-dashed border-[var(--border-strong)] rounded-[2rem] bg-[var(--card)]/50 px-6 text-center">
                <Globe className="w-12 h-12 mb-3 opacity-20" />
                <p className="text-sm md:text-base font-bold mb-1 text-[var(--foreground)]">{t('public.status.noDataTitle')}</p>
                <p className="text-xs md:text-sm">{t('public.status.noDataDesc')}</p>
              </div>
            )
          ) : null}
        </div>
      </main>
      
      <FeedbackFooter />
    </div>
  );
}