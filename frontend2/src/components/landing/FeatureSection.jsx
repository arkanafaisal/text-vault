// src/components/landing/FeatureSection.jsx
import React from 'react';
import { Lock, Globe, ArrowRight, ClipboardCopy, Smartphone } from 'lucide-react';

export default function FeatureSection() {
  return (
    <section className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-6 px-4 pb-20">
      {/* Private Access Card */}
      <div className="flex flex-col text-left p-8 rounded-3xl bg-[var(--card)] border border-[var(--border)] shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
        <div className="w-12 h-12 bg-[var(--secondary)] rounded-2xl flex items-center justify-center mb-6 border">
          <Lock className="w-6 h-6 text-[var(--foreground)]" />
        </div>
        <h3 className="text-2xl font-bold mb-3">Private Access</h3>
        <p className="text-[var(--muted-foreground)] leading-relaxed flex-1 z-10">
          Encrypted data accessible only by you. Login on any device to copy your data instantly without messy chat histories.
        </p>
        <div className="mt-8 flex items-center text-sm font-medium hover:text-[var(--primary)] cursor-pointer transition-colors w-fit z-10">
          Go to Private Dashboard <ArrowRight className="w-4 h-4 ml-1" />
        </div>
        <div className="absolute -bottom-6 -right-6 opacity-10 group-hover:opacity-20 transition-opacity">
          <Smartphone className="w-40 h-40" />
        </div>
      </div>

      {/* Public Access Card */}
      <div className="flex flex-col text-left p-8 rounded-3xl bg-[var(--card)] border border-[var(--border)] shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
        <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-950/50 rounded-2xl flex items-center justify-center mb-6 border border-emerald-200 dark:border-emerald-900">
          <Globe className="w-6 h-6 text-[var(--primary)]" />
        </div>
        <h3 className="text-2xl font-bold mb-3">Public Access</h3>
        <p className="text-[var(--muted-foreground)] leading-relaxed flex-1 z-10">
          Perfect for campus PCs or cybercafes. Open access to specific data using a <code className="text-xs bg-[var(--muted)] px-1 py-0.5 rounded">publicKey</code>. You or your friends can copy it without logging in.
        </p>
        <div className="mt-8 flex items-center text-sm font-medium hover:text-[var(--primary)] cursor-pointer transition-colors w-fit z-10">
          Try Public Simulation <ArrowRight className="w-4 h-4 ml-1" />
        </div>
        <div className="absolute -bottom-6 -right-6 opacity-10 group-hover:opacity-20 transition-opacity">
          <ClipboardCopy className="w-40 h-40" />
        </div>
      </div>
    </section>
  );
}