// src/utils/toast.js

// Fungsi ini menembakkan event ke global window (Gaya Vanilla JS!)
const emitToast = (message, type) => {
  const event = new CustomEvent('app-toast', {
    detail: { id: Date.now(), message, type }
  });
  window.dispatchEvent(event);
};

export const toast = {
  success: (message) => emitToast(message, 'success'),
  error: (message) => emitToast(message, 'error'),
  info: (message) => emitToast(message, 'info'),
  
  // TAMBAHKAN INI: Fungsi untuk menyapu bersih semua toast
  clear: () => window.dispatchEvent(new CustomEvent('app-toast-clear')), 
};