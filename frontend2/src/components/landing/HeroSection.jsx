// src/components/landing/HeroSection.jsx
import React, { useState } from 'react';
import { Search, Zap, ArrowRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { navigate } from '../../utils/navigation'; // <-- 1. Import navigate

export default function HeroSection() {
  const { t } = useTranslation();
  const [searchUsername, setSearchUsername] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    const trimmedUsername = searchUsername.trim();
    if (!trimmedUsername) return;
    
    // 2. Arahkan ke /public beserta username-nya (di-encode agar aman untuk URL)
    navigate(`/public/${encodeURIComponent(trimmedUsername)}`);
  };

  return (
    <section className="w-full flex flex-col items-center justify-center px-4 pt-4 pb-10 md:pt-6 md:pb-16 lg:pt-16 lg:pb-20 text-center">
      
      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--secondary)] text-[var(--secondary-foreground)] text-xs md:text-sm font-medium mb-8 md:mb-8 border border-zinc-300 dark:border-zinc-700 shadow-sm">
        <Zap className="w-4 h-4 text-[var(--primary)]" />
        <span>{t('hero.badge')}</span>
      </div>
      
      <h1 className="text-3xl md:text-5xl lg:text-6xl font-extrabold tracking-tight max-w-4xl leading-tight md:leading-[1.1] mb-4 md:mb-6 drop-shadow-sm">
        {t('hero.titleMain')} <span className="text-[var(--primary)] drop-shadow-md">{t('hero.titleHighlight')}</span>
      </h1>
      
      <p className="text-base md:text-xl text-[var(--muted-foreground)] max-w-2xl mb-7 md:mb-10 leading-relaxed">
        {t('hero.descPart1')} <span className="font-mono font-semibold text-emerald-700 dark:text-emerald-400 bg-zinc-200/80 dark:bg-zinc-800/80 border border-zinc-300 dark:border-zinc-700 px-1.5 py-0.5 rounded-md shadow-sm">{t('hero.descCode')}</span> {t('hero.descPart2')}
      </p>

      <div className="w-full max-w-md bg-[var(--card)] p-2 rounded-2xl border border-zinc-300 dark:border-zinc-800 shadow-lg flex flex-col md:flex-row gap-2 mb-6 md:mb-10">
        <form onSubmit={handleSearch} className="flex-1 flex items-center bg-[var(--background)] px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 focus-within:ring-2 focus-within:ring-[var(--ring)] focus-within:border-transparent transition-all shadow-inner">
          <Search className="w-5 h-5 text-[var(--muted-foreground)] mr-3 flex-shrink-0" />
          <input 
            type="text" 
            placeholder={t('hero.searchPlaceholder')}
            className="w-full bg-transparent outline-none placeholder:text-[var(--muted-foreground)] text-[var(--foreground)]"
            value={searchUsername}
            onChange={(e) => setSearchUsername(e.target.value)}
          />
        </form>
        <button 
          onClick={handleSearch} // Tambahkan trigger klik pada tombol juga
          type="submit"
          className="bg-[var(--primary)] text-[var(--primary-foreground)] px-6 py-3 rounded-xl font-medium flex items-center justify-center gap-2 hover:opacity-90 transition-opacity active:scale-[0.98] cursor-pointer shadow-md"
        >
          {t('hero.btn')}
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </section>
  );
}