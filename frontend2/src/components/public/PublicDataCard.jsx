// src/components/public/PublicDataCard.jsx
import React, { useState } from 'react';
import { Copy, Eye, X, FileText, Tag } from 'lucide-react';

export default function PublicDataCard({ item, onCopy }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      {/* PREVIEW BAR (Hemat Vertikal) */}
      <div className="bg-[var(--primary)]/10 text-[var(--foreground)] border border-[var(--primary)]/40 rounded-xl p-3 md:p-4 flex items-center justify-between gap-3 shadow-sm hover:border-[var(--primary)] hover:shadow-md transition-all">
        <h3 className="font-bold text-sm md:text-base truncate flex-1" title={item.title}>
          {item.title}
        </h3>
        
        <div className="flex items-center gap-1.5 flex-shrink-0">
          <button 
            onClick={() => onCopy(item.content)}
            className="p-1.5 md:p-2 bg-[var(--background)] hover:bg-[var(--secondary)] border border-[var(--border)] rounded-lg text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors cursor-pointer"
            title="Copy Content"
          >
            <Copy className="w-3.5 h-3.5 md:w-4 md:h-4" />
          </button>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="p-1.5 md:p-2 bg-[var(--foreground)] hover:opacity-90 text-[var(--background)] rounded-lg transition-opacity cursor-pointer shadow-sm"
            title="Inspect Details"
          >
            <Eye className="w-3.5 h-3.5 md:w-4 md:h-4" />
          </button>
        </div>
      </div>

      {/* MODAL DETAILS */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in duration-300">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm cursor-pointer" onClick={() => setIsModalOpen(false)} />
          <div className="bg-[var(--card)] w-full max-w-2xl max-h-[85vh] rounded-[2rem] border border-[var(--border-strong)] shadow-2xl relative z-10 flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between p-5 md:p-6 border-b border-[var(--border)]">
              <h2 className="text-xl font-bold tracking-tight text-[var(--foreground)]">{item.title}</h2>
              <button onClick={() => setIsModalOpen(false)} className="p-2 rounded-full hover:bg-[var(--secondary)] transition-colors text-[var(--muted-foreground)]">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-5 md:p-6 overflow-y-auto custom-scrollbar space-y-4 flex-1 bg-[var(--secondary)]/30">
              <div>
                <label className="text-xs font-bold uppercase tracking-widest text-[var(--muted-foreground)] flex items-center gap-2 mb-2">
                  <FileText className="w-3.5 h-3.5" /> Content
                </label>
                <div className="w-full min-h-[160px] bg-[var(--background)] rounded-xl p-4 border border-[var(--border)] shadow-sm relative group">
                  <p className="text-sm md:text-base leading-relaxed text-[var(--foreground)] whitespace-pre-wrap">{item.content}</p>
                  <button 
                    onClick={() => onCopy(item.content)}
                    className="absolute top-3 right-3 p-2 bg-[var(--secondary)] hover:bg-[var(--border)] text-[var(--muted-foreground)] hover:text-[var(--foreground)] rounded-lg transition-colors cursor-pointer opacity-0 group-hover:opacity-100 shadow-sm"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
              </div>
              {item.tags && item.tags.length > 0 && (
                <div>
                  <label className="text-xs font-bold uppercase tracking-widest text-[var(--muted-foreground)] flex items-center gap-2 mb-2">
                    <Tag className="w-3.5 h-3.5" /> Tags
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {item.tags.map((tag, idx) => (
                      <span key={idx} className="bg-[var(--card)] text-[var(--muted-foreground)] text-xs font-bold tracking-widest uppercase px-2.5 py-1 rounded-md border border-[var(--border)] shadow-sm">{tag}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}