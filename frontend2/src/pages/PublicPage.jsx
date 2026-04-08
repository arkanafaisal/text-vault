// src/pages/PublicPage.jsx
import React, { useState, useEffect } from 'react';
import { Globe, Search, User, Key, Loader2, FileText, Tag, History, X } from 'lucide-react';
import { navigate } from '../utils/navigation';
import api from '../utils/api';
import { toast } from '../utils/toast';
import Navbar from '../components/public/Navbar'; 

export default function PublicPage({ isDarkMode, toggleTheme }) {
  const [formData, setFormData] = useState(() => {
    const parts = typeof window !== 'undefined' ? window.location.pathname.split('/') : [];
    return {
      username: parts[2] ? decodeURIComponent(parts[2]) : '',
      publicKey: parts[3] ? decodeURIComponent(parts[3]) : ''
    };
  });
  
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  useEffect(() => {
    if (formData.username && formData.publicKey && !hasSearched) {
      // Jika masuk dari link yang sudah ada isinya, langsung cari data
      handleSearch();
    } else if (!formData.username || !formData.publicKey) {
      // TAMBAHKAN INI: Jika input masih kosong, tampilkan notifikasi sambutan
      toast.info("Public Access Mode. Enter credentials to unlock shared records.");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSearch = async (e) => {
    if (e) e.preventDefault();
    
    if (!formData.username.trim() || !formData.publicKey.trim()) {
      toast.error('Both Username and Public Key are required.');
      return;
    }

    setIsLoading(true);
    setHasSearched(true);
    setData([]);

    try {
      const result = await api.public.getData({
        username: formData.username.trim(),
        publicKey: formData.publicKey.trim()
      });

      // KEMBALI KE LOGIKA STANDAR KARENA BACKEND SUDAH PRESISI
      if (result.success) {
        setData(result.data);
        toast.success(result.message); // 200 OK
        
        const newPath = `/public/${encodeURIComponent(formData.username.trim())}/${encodeURIComponent(formData.publicKey.trim())}`;
        window.history.replaceState({}, '', newPath);
      } else {
        toast.error(result.message); // Menampilkan pesan 400 atau 404 dari apiMessages.js
      }
    } catch (error) {
      toast.error('Network error occurred while fetching public data.');
    } finally {
      setIsLoading(false);
    }
  };

  const formatDecoratedDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return `${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}, ${date.toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}`;
  };

  const PublicDataModal = () => {
    if (!selectedItem) return null;
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in duration-300">
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm cursor-pointer" onClick={() => setSelectedItem(null)} />
        <div className="bg-[var(--card)] w-full max-w-2xl max-h-[85vh] rounded-[2rem] border border-[var(--border-strong)] shadow-2xl relative z-10 flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
          <div className="flex items-center justify-between p-5 md:p-6 border-b border-[var(--border)]">
            <div>
              <h2 className="text-xl font-bold tracking-tight text-[var(--foreground)]">{selectedItem.title}</h2>
              <div className="flex items-center gap-1.5 text-xs text-[var(--muted-foreground)] mt-1">
                <History className="w-3.5 h-3.5" />
                <span>Last updated: {formatDecoratedDate(selectedItem.updatedAt)}</span>
              </div>
            </div>
            <button onClick={() => setSelectedItem(null)} className="p-2 rounded-full hover:bg-[var(--secondary)] transition-colors text-[var(--muted-foreground)]">
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="p-5 md:p-6 overflow-y-auto custom-scrollbar space-y-4 flex-1 bg-[var(--secondary)]/30">
            <div>
              <label className="text-xs font-bold uppercase tracking-widest text-[var(--muted-foreground)] flex items-center gap-2 mb-2">
                <FileText className="w-3.5 h-3.5" /> Content
              </label>
              <div className="w-full min-h-[160px] bg-[var(--background)] rounded-xl p-4 border border-[var(--border)] shadow-sm">
                <p className="text-sm md:text-base leading-relaxed text-[var(--foreground)] whitespace-pre-wrap">{selectedItem.content}</p>
              </div>
            </div>
            {selectedItem.tags && selectedItem.tags.length > 0 && (
              <div>
                <label className="text-xs font-bold uppercase tracking-widest text-[var(--muted-foreground)] flex items-center gap-2 mb-2">
                  <Tag className="w-3.5 h-3.5" /> Tags
                </label>
                <div className="flex flex-wrap gap-2">
                  {selectedItem.tags.map((tag, idx) => (
                    <span key={idx} className="bg-[var(--card)] text-[var(--muted-foreground)] text-xs font-bold tracking-widest uppercase px-2.5 py-1 rounded-md border border-[var(--border)] shadow-sm">{tag}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-[var(--background)] text-[var(--foreground)] relative">
      <Navbar isDarkMode={isDarkMode} toggleTheme={toggleTheme} />

      <main className="flex-1 w-full max-w-5xl mx-auto px-4 py-8 md:py-12 flex flex-col items-center">
        
        <div className="text-center mb-8 md:mb-12">
          <div className="w-16 h-16 bg-[var(--primary)]/10 text-[var(--primary)] rounded-2xl flex items-center justify-center mx-auto mb-4 border border-[var(--primary)]/20 shadow-sm">
            <Globe className="w-8 h-8" />
          </div>
          <h1 className="text-3xl md:text-4xl font-black tracking-tight mb-3">Public Access Vault</h1>
          <p className="text-[var(--muted-foreground)] text-sm md:text-base max-w-xl mx-auto">
            Access unlocked data shared by users. You need the correct Username and Public Key to view the records.
          </p>
        </div>

        <div className="w-full max-w-2xl bg-[var(--card)] p-4 md:p-6 rounded-[2rem] border border-[var(--border-strong)] shadow-xl mb-10">
          <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-3 md:gap-4">
            <div className="flex-1 relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2"><User className="w-4 h-4 text-[var(--muted-foreground)]" /></div>
              <input type="text" name="username" value={formData.username} onChange={handleInputChange} placeholder="Target Username" required disabled={isLoading} className="w-full pl-9 pr-4 py-3 bg-[var(--background)] border border-[var(--border)] rounded-xl outline-none focus:ring-2 focus:ring-[var(--primary)] text-sm shadow-inner transition-shadow" />
            </div>
            <div className="flex-1 relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2"><Key className="w-4 h-4 text-[var(--muted-foreground)]" /></div>
              <input type="text" name="publicKey" value={formData.publicKey} onChange={handleInputChange} placeholder="Public Key" required disabled={isLoading} className="w-full pl-9 pr-4 py-3 bg-[var(--background)] border border-[var(--border)] rounded-xl outline-none focus:ring-2 focus:ring-[var(--primary)] text-sm shadow-inner transition-shadow" />
            </div>
            <button type="submit" disabled={isLoading} className="px-6 py-3 bg-[var(--foreground)] text-[var(--background)] font-bold rounded-xl hover:opacity-90 shadow-md transition-all active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70">
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
              <span className="md:hidden lg:inline">Access</span>
            </button>
          </form>
        </div>

        <div className="w-full flex-1">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader2 className="w-10 h-10 text-[var(--primary)] animate-spin mb-4" />
              <p className="text-[var(--muted-foreground)] font-bold tracking-widest uppercase text-xs animate-pulse">Retrieving Data...</p>
            </div>
          ) : hasSearched ? (
            data.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 md:gap-4">
                {data.map(item => (
                  <div key={item.id} onClick={() => setSelectedItem(item)} className="bg-[var(--primary)]/10 text-[var(--foreground)] border border-[var(--primary)]/40 hover:bg-[var(--primary)]/20 hover:border-[var(--primary)] hover:shadow-md rounded-xl p-4 flex flex-col items-center justify-center min-h-[100px] text-center cursor-pointer transition-all active:scale-95 shadow-sm">
                    <h3 className="font-bold text-sm md:text-base break-words w-full leading-tight">{item.title}</h3>
                  </div>
                ))}
              </div>
            ) : (
              <div className="w-full py-12 flex flex-col items-center justify-center text-[var(--muted-foreground)] border-2 border-dashed border-[var(--border-strong)] rounded-[2rem] bg-[var(--card)]/50 px-6 text-center">
                <Globe className="w-12 h-12 mb-3 opacity-20" />
                <p className="text-sm md:text-base font-bold mb-1 text-[var(--foreground)]">No Data Available</p>
                <p className="text-xs md:text-sm">We couldn't find any public records matching your request.</p>
              </div>
            )
          ) : null}
        </div>
      </main>
      <PublicDataModal />
    </div>
  );
}