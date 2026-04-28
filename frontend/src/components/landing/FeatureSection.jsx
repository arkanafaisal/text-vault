import React from 'react';
import { Lock, Globe, ArrowRight, ClipboardCopy, Smartphone } from 'lucide-react';
import { navigate } from '../../utils/navigation';
import { useTranslation } from 'react-i18next';

export default function FeatureSection({ openAuthModal }) {
  const { t } = useTranslation();

  return (
    <section className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-8 px-4 pb-20">
      {/* Private Access Card */}
      <div className="flex flex-col text-left p-8 rounded-3xl bg-[var(--card)] border border-[var(--border)] shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 relative overflow-hidden group">
        <div className="w-12 h-12 bg-[var(--secondary)] rounded-2xl flex items-center justify-center mb-6 border border-[var(--border)] shadow-sm">
          <Lock className="w-6 h-6 text-[var(--foreground)]" />
        </div>
        <h3 className="text-2xl font-bold mb-3 tracking-tight">{t('feature.private.title')}</h3>
        <p className="text-[var(--muted-foreground)] leading-relaxed flex-1 z-10 text-sm md:text-base">
          {t('feature.private.desc')}
        </p>
        <button 
          onClick={() => openAuthModal('login')}
          className="mt-8 flex items-center text-sm font-bold text-[var(--primary)] hover:opacity-80 cursor-pointer transition-all w-fit z-10 group/btn"
        >
          {t('feature.private.btn')}
          <ArrowRight className="w-4 h-4 ml-1.5 group-hover/btn:translate-x-1 transition-transform" />
        </button>
        <div className="absolute -bottom-6 -right-6 text-[var(--foreground)] opacity-[0.08] dark:opacity-10 group-hover:opacity-20 transition-opacity duration-300">
          <Smartphone className="w-40 h-40" />
        </div>
      </div>

      {/* Public Access Card */}
      <div className="flex flex-col text-left p-8 rounded-3xl bg-[var(--card)] border border-[var(--border)] shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 relative overflow-hidden group">
        <div className="w-12 h-12 bg-[var(--secondary)] rounded-2xl flex items-center justify-center mb-6 border border-[var(--border)] shadow-sm">
          <Globe className="w-6 h-6 text-[var(--primary)]" />
        </div>
        <h3 className="text-2xl font-bold mb-3 tracking-tight">{t('feature.public.title')}</h3>
        <p className="text-[var(--muted-foreground)] leading-relaxed flex-1 z-10 text-sm md:text-base">
          {t('feature.public.descPart1')} <code className="text-xs font-bold bg-[var(--secondary)] text-[var(--foreground)] border border-[var(--border)] px-1.5 py-0.5 rounded shadow-sm">{t('feature.public.descCode')}</code> {t('feature.public.descPart2')}
        </p>
        <button 
          onClick={() => navigate('/public')}
          className="mt-8 flex items-center text-sm font-bold text-[var(--primary)] hover:opacity-80 cursor-pointer transition-all w-fit z-10 group/btn"
        >
          {t('feature.public.btn')}
          <ArrowRight className="w-4 h-4 ml-1.5 group-hover/btn:translate-x-1 transition-transform" />
        </button>
        <div className="absolute -bottom-6 -right-6 text-[var(--foreground)] opacity-[0.08] dark:opacity-10 group-hover:opacity-20 transition-opacity duration-300">
          <ClipboardCopy className="w-40 h-40" />
        </div>
      </div>
    </section>
  );
}