import React from 'react';
import { Github, Linkedin, Globe } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="w-full max-w-6xl mx-auto px-4 md:px-8 py-8 mt-auto border-t border-[var(--border)] flex flex-col sm:flex-row justify-between items-center gap-4 text-[var(--muted-foreground)]">
      <div className="text-sm font-medium">
        {t('footer.builtBy')} <span className="text-[var(--foreground)]">Arkana</span>
      </div>
      
      <div className="flex items-center gap-5">
        <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="hover:text-[var(--foreground)] transition-colors cursor-pointer" aria-label="GitHub">
          <Github className="w-5 h-5" />
        </a>
        <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="hover:text-[var(--foreground)] transition-colors cursor-pointer" aria-label="LinkedIn">
          <Linkedin className="w-5 h-5" />
        </a>
        <a href="https://yourwebsite.com" target="_blank" rel="noopener noreferrer" className="hover:text-[var(--foreground)] transition-colors cursor-pointer" aria-label="Website">
          <Globe className="w-5 h-5" />
        </a>
      </div>
    </footer>
  );
}