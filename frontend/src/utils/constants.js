// src/utils/constants.js

export const VALIDATION = {
  USER: {
    MIN_PASSWORD: 6,
    MAX_PASSWORD: 255,
    MAX_USERNAME: 30,
    MAX_EMAIL: 255, // Standar umum email
    MAX_PUBLIC_KEY: 255,
  },
  RECORD: {
    MAX_TITLE: 31,
    MAX_CONTENT: 1000,
    // Jika nanti butuh batas jumlah tag atau panjang string per tag
    MAX_TAGS_COUNT: 5, 
    MAX_TAG_LENGTH: 12,
    PUBLIC_PAGE_SIZE: 10, 
  },
  FEEDBACK: {
    MIN_MESSAGE: 10,
    MAX_MESSAGE: 300,
  }
};

export const PAGINATION = {
  DASHBOARD_LIMIT: 30,
};

export const UI = {
  SEARCH_DEBOUNCE_MS: 2000,
  TOAST_DURATION_MS: 4000,
  TOAST_ANIMATION_EXIT_MS: 300,
};

// Opsional: Pesan statis yang sering diulang juga bisa ditaruh di sini
// jika Anda tidak ingin menggunakan i18n untuk error sistem murni
export const SYSTEM_MESSAGES = {
  NETWORK_ERROR: 'A network error occurred. Please check your connection.',
};

export const AUTHOR = {
  NAME: 'Arkana',
  GITHUB: 'https://github.com/arkanafaisal/text-vault',
  LINKEDIN: 'https://linkedin.com/in/arkana-faisal-ridho-8a4085344',
  WEBSITE: 'https://arkanafaisal.my.id'
};