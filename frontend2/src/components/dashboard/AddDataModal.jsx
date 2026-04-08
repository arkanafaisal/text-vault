// src/components/dashboard/AddDataModal.jsx
import React from 'react';
import { X, Loader2, AlertTriangle, FileText, Tag, AlignLeft, Plus } from 'lucide-react';
import { useAddData } from '../../hooks/useAddData';

export default function AddDataModal({ onClose, onDataAdded }) {
  
  // Panggil hook di sini
  const { 
    formData, 
    isSubmitting, 
    apiError, 
    handleInputChange, 
    handleSubmit 
  } = useAddData({ onClose, onDataAdded });

  const typography = {
    label: "text-[10px] md:text-xs font-bold uppercase tracking-widest text-[var(--muted-foreground)] flex items-center gap-2 mb-2",
    input: "w-full bg-[var(--background)] rounded-lg px-4 py-3 outline-none ring-1 ring-[var(--border-strong)] focus:ring-2 focus:ring-[var(--primary)] text-sm md:text-base text-[var(--foreground)] transition-shadow",
    textarea: "w-full h-full min-h-[160px] md:min-h-[200px] bg-[var(--background)] rounded-xl p-4 outline-none ring-1 ring-[var(--border-strong)] focus:ring-2 focus:ring-[var(--primary)] text-sm md:text-base text-[var(--foreground)] resize-none custom-scrollbar transition-shadow",
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6 lg:p-8 animate-in fade-in duration-300">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={isSubmitting ? null : onClose} />
      
      <div className="bg-[var(--card)] w-full max-w-2xl max-h-[90vh] rounded-[2rem] border border-[var(--border-strong)] shadow-2xl relative z-10 flex flex-col overflow-hidden animate-in zoom-in-95 duration-300 ease-out">
        
        <div className="flex items-center justify-between p-5 md:p-6 border-b border-[var(--border)] bg-[var(--card)] flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-[var(--primary)]/10 text-[var(--primary)]">
              <Plus className="w-5 h-5 md:w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg md:text-xl font-bold tracking-tight text-[var(--foreground)]">Add New Data</h2>
              <p className="text-[10px] md:text-xs text-[var(--muted-foreground)] opacity-70 mt-0.5">Create a new secured record in your vault</p>
            </div>
          </div>
          <button onClick={onClose} disabled={isSubmitting} className="p-2 rounded-full hover:bg-[var(--secondary)] transition-colors text-[var(--muted-foreground)] cursor-pointer disabled:opacity-50">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto custom-scrollbar flex flex-col">
          <div className="p-5 md:p-6 space-y-6 flex-1 bg-[var(--secondary)]/30">
            
            {/* Pesan Error di DALAM Modal */}
            {apiError && (
              <div className="p-4 bg-[var(--destructive)]/10 border border-[var(--destructive)]/20 rounded-xl flex items-start gap-3 text-[var(--destructive)] text-xs font-bold mb-2">
                <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <p className="leading-relaxed">{apiError}</p>
              </div>
            )}

            <div>
              <label htmlFor="title" className={typography.label}>
                <FileText className="w-4 h-4" />
                <span>Record Title</span>
              </label>
              <input id="title" type="text" value={formData.title} onChange={handleInputChange} className={typography.input} placeholder="Enter a clear title (max 31 chars)..." maxLength="31" required autoFocus />
            </div>

            <div className="flex-1 flex flex-col">
              <label htmlFor="content" className={typography.label}>
                <AlignLeft className="w-4 h-4" />
                <span>Secured Content</span>
              </label>
              <div className="flex-1 relative">
                <textarea id="content" value={formData.content} onChange={handleInputChange} className={typography.textarea} placeholder="Enter your confidential data, notes, or credentials here..." maxLength="1000" required />
              </div>
            </div>

            <div>
              <label htmlFor="tags" className={typography.label}>
                <Tag className="w-4 h-4" />
                <span>Tags (Optional)</span>
              </label>
              <input id="tags" type="text" value={formData.tags} onChange={handleInputChange} className={typography.input} placeholder="e.g. work, private, api-keys (comma separated)" />
            </div>

          </div>
          
          <div className="p-5 md:p-6 border-t border-[var(--border)] bg-[var(--card)] flex items-center justify-end gap-3 flex-shrink-0">
            <button type="button" onClick={onClose} disabled={isSubmitting} className="px-5 py-2.5 text-xs md:text-sm font-bold text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors disabled:opacity-50 cursor-pointer">
              Cancel
            </button>
            <button type="submit" disabled={isSubmitting || !formData.title.trim() || !formData.content.trim()} className="flex items-center gap-2 px-6 py-2.5 bg-[var(--foreground)] text-[var(--background)] text-xs md:text-sm font-bold rounded-xl hover:opacity-90 transition-opacity shadow-md disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer">
              {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
              <span>{isSubmitting ? 'Saving...' : 'Save to Vault'}</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}