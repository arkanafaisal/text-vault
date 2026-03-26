// src/helpers/authValidation.jsx
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
    } else if (cleanId.length > 50) {
      newErrors.identifier = t('auth.errMax50');
    }
    
    return {
      isValid: Object.keys(newErrors).length === 0,
      errors: newErrors
    };
  }

  // --- Validasi untuk Login & Signup ---

  // Validasi Identifier
  if (!cleanId) {
    newErrors.identifier = t('auth.errRequired');
  } else if (cleanId.length > 50) {
    newErrors.identifier = t('auth.errMax50');
  }

  // Validasi Password
  if (!cleanPw) {
    newErrors.password = t('auth.errRequired');
  } else if (cleanPw.length < 6) {
    newErrors.password = t('auth.errMin6');
  } else if (cleanPw.length > 255) {
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