// src/components/dashboard/Bento.jsx
import React from 'react';
import { useTranslation } from 'react-i18next'; // <-- IMPORT

export default function Bento({ data, onItemClick }) {
  const { t } = useTranslation(); // <-- HOOK

  if (!data || data.length === 0) {
    return (
      <div className="w-full py-10 flex items-center justify-center text-[var(--muted-foreground)] border border-dashed border-[var(--border-strong)] rounded-2xl">
        <p className="text-sm font-medium">{t('dashboard.empty')}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap gap-1.5 md:gap-2 lg:gap-3">
      {data.map((item) => {
        // Cek berdasarkan visibility string 'private'
        const colorClass = item.visibility === 'private'
          ? 'bg-[var(--card)] text-[var(--foreground)] border-[var(--border-strong)] shadow-sm hover:border-[var(--muted-foreground)] hover:shadow-md'
          : 'bg-[var(--primary)]/10 text-[var(--foreground)] border-[var(--primary)]/40 shadow-sm hover:bg-[var(--primary)]/20 hover:border-[var(--primary)] hover:shadow-md';

        return (
          <div
            key={item.id}
            onClick={() => onItemClick(item)}
            className={`flex-grow flex items-center justify-center px-2.5 py-1.5 md:px-3 md:py-2 lg:px-4 lg:py-2.5 rounded-lg md:rounded-xl border transition-all duration-300 cursor-pointer min-w-[70px] md:min-w-[90px] lg:min-w-[120px] max-w-full active:scale-[0.98] ${colorClass}`}
          >
            <h3 className="font-bold text-center text-xs md:text-base lg:text-lg break-words w-full leading-tight">
              {item.title}
            </h3>
          </div>
        );
      })}
    </div>
  );
}