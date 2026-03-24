// src/utils/navigation.js

/**
 * Fungsi navigasi manual untuk memicu re-render pada App.jsx
 * tanpa perlu reload halaman penuh.
 */
export const navigate = (path) => {
  window.history.pushState({}, '', path);
  // Memicu event agar useEffect di App.jsx menangkap perubahan path
  const navEvent = new PopStateEvent('popstate');
  window.dispatchEvent(navEvent);
};