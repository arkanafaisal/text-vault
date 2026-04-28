// src/helpers/authValidation.js
import { VALIDATION } from '../utils/constants'; // <-- 1. IMPORT KONSTANTA

export const validateAuthForm = (type, formData, t) => {
  const newErrors = {};
  const cleanId = formData.identifier.trim();
  const cleanPw = formData.password.trim();
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // --- Validasi untuk Lupa Password ---
  if (type === 'forgot-password') {
    if (!cleanId) {
      newErrors.identifier = t('auth.errRequired');
    } else if (!emailRegex.test(cleanId)) {
      newErrors.identifier = t('auth.errEmailInvalid');
    } else if (cleanId.length > VALIDATION.USER.MAX_EMAIL) { // <-- KONSTANTA
      newErrors.identifier = t('auth.errMax255');
    }
    
    return {
      isValid: Object.keys(newErrors).length === 0,
      errors: newErrors
    };
  }

  // --- Validasi untuk Login & Signup ---

  // Validasi Identifier (Dinamis antara Username / Email)
  if (!cleanId) {
    newErrors.identifier = t('auth.errRequired');
  } else if (type === 'signup' && cleanId.length > VALIDATION.USER.MAX_USERNAME) { // <-- KONSTANTA
    newErrors.identifier = t('auth.errMax50');
  } else if (type === 'login' && cleanId.length > VALIDATION.USER.MAX_EMAIL) { // <-- KONSTANTA (Login bisa email)
    newErrors.identifier = t('auth.errMax255');
  }

  // Validasi Password
  if (!cleanPw) {
    newErrors.password = t('auth.errRequired');
  } else if (cleanPw.length < VALIDATION.USER.MIN_PASSWORD) { // <-- KONSTANTA
    newErrors.password = t('auth.errMin6');
  } else if (cleanPw.length > VALIDATION.USER.MAX_PASSWORD) { // <-- KONSTANTA
    newErrors.password = t('auth.errMax255');
  }

  // Validasi Confirm Password (hanya untuk signup)
  if (type === 'signup') {
    const cleanCfpw = formData.confirmPassword.trim();
    if (!cleanCfpw) {
      newErrors.confirmPassword = t('auth.errConfirm');
    } else if (cleanCfpw !== cleanPw) {
      newErrors.confirmPassword = t('auth.errMatch');
    }
  }

  return {
    isValid: Object.keys(newErrors).length === 0,
    errors: newErrors
  };
};