// src/components/layout/Footer.jsx
import React from 'react';
import { Github, Twitter, Globe } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="w-full max-w-6xl mx-auto px-4 md:px-8 py-8 mt-auto border-t border-[var(--border)]/50 flex flex-col sm:flex-row justify-between items-center gap-4 text-[var(--muted-foreground)]">
      <div className="text-sm font-medium">
        Built by <span className="text-[var(--foreground)]">Arkana</span>
      </div>
      
      <div className="flex items-center gap-5">
        <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="hover:text-[var(--foreground)] transition-colors cursor-pointer" aria-label="GitHub">
          <Github className="w-5 h-5" />
        </a>
        <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-[var(--foreground)] transition-colors cursor-pointer" aria-label="Twitter">
          <Twitter className="w-5 h-5" />
        </a>
        <a href="https://yourwebsite.com" target="_blank" rel="noopener noreferrer" className="hover:text-[var(--foreground)] transition-colors cursor-pointer" aria-label="Website">
          <Globe className="w-5 h-5" />
        </a>
      </div>
    </footer>
  );
}