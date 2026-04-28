// src/components/common/ToastContainer.jsx
import React, { useState, useEffect } from 'react';
import { CheckCircle2, AlertTriangle, Info, X } from 'lucide-react';

export default function ToastContainer() {
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    const handleAddToast = (event) => {
      const newToast = { ...event.detail, isExiting: false };
      setToasts((prev) => [...prev, newToast]);

      setTimeout(() => {
        triggerExit(newToast.id);
      }, 4000);
    };

    // TAMBAHKAN INI: Handler untuk mengosongkan toast
    const handleClearToasts = () => setToasts([]);

    window.addEventListener('app-toast', handleAddToast);
    window.addEventListener('app-toast-clear', handleClearToasts); // Register event
    
    return () => {
      window.removeEventListener('app-toast', handleAddToast);
      window.removeEventListener('app-toast-clear', handleClearToasts); // Cleanup event
    };
  }, []);
  const triggerExit = (id) => {
    setToasts((prev) =>
      prev.map((toast) => (toast.id === id ? { ...toast, isExiting: true } : toast))
    );

    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, 300);
  };

  if (toasts.length === 0) return null;

  return (
    // PERUBAHAN POSISI KETINGGIAN:
    // top-20 (Mobile): Diturunkan agar tidak menutupi navbar/modal header mobile
    // md:top-24 (Tablet): Diturunkan lebih jauh
    // lg:top-28 (Desktop): Ruang ekstra lega di layar besar
    <div className="fixed right-4 left-4 sm:left-auto sm:right-6 top-10 md:top-16 lg:top-18 z-[100] flex flex-col items-end gap-2 md:gap-3 pointer-events-none">
      {toasts.map((toast) => {
        
        const isError = toast.type === 'error';
        const isSuccess = toast.type === 'success';
        
        const bgColor = isError ? 'bg-[var(--destructive)]/10 border-[var(--destructive)]/20 text-[var(--destructive)]' : 
                        isSuccess ? 'bg-green-500/10 border-green-500/20 text-green-600 dark:text-green-400' : 
                        'bg-[var(--primary)]/10 border-[var(--primary)]/20 text-[var(--primary)]';

        return (
          <div 
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-2.5 md:gap-3 p-3 md:p-4 w-full sm:w-auto sm:min-w-[280px] max-w-[380px] rounded-xl md:rounded-2xl border bg-[var(--card)] shadow-xl backdrop-blur-md transition-all duration-300 ease-in-out ${
              toast.isExiting 
                ? 'opacity-0 translate-x-10 scale-95' 
                : 'animate-in slide-in-from-top-4 sm:slide-in-from-right-8 fade-in'
            }`}
          >
            <div className={`p-1.5 md:p-2 rounded-full mt-0.5 flex-shrink-0 ${bgColor}`}>
              {isError ? <AlertTriangle className="w-3.5 h-3.5 md:w-4 md:h-4" /> : 
               isSuccess ? <CheckCircle2 className="w-3.5 h-3.5 md:w-4 md:h-4" /> : 
               <Info className="w-3.5 h-3.5 md:w-4 md:h-4" />}
            </div>
            
            <div className="flex-1 pt-0.5 md:pt-1">
              <p className="text-xs md:text-sm font-bold text-[var(--foreground)] leading-relaxed">
                {toast.message}
              </p>
            </div>

            <button 
              onClick={() => triggerExit(toast.id)}
              className="p-1 -mr-1 md:mr-0 text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--secondary)] rounded-md transition-colors cursor-pointer"
            >
              <X className="w-3.5 h-3.5 md:w-4 md:h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
}