// src/helpers/authValidation.js
export const validateAuthForm = (type, formData) => {
  const newErrors = {};
  const cleanId = formData.identifier.trim();
  const cleanPw = formData.password.trim();

  // Validasi Identifier (Username/Email)
  if (!cleanId) {
    newErrors.identifier = 'Required.';
  } else if (cleanId.length > 50) {
    newErrors.identifier = 'Max 50 characters.';
  }

  // Validasi Password
  if (!cleanPw) {
    newErrors.password = 'Required.';
  } else if (cleanPw.length < 6) {
    newErrors.password = 'Min 6 characters.';
  } else if (cleanPw.length > 255) {
    newErrors.password = 'Max 255 characters.';
  }

  // Validasi Confirm Password (Hanya Signup)
  if (type === 'signup') {
    const cleanCfpw = formData.confirmPassword.trim();
    if (!cleanCfpw) {
      newErrors.confirmPassword = 'Confirmation required.';
    } else if (cleanCfpw !== cleanPw) {
      newErrors.confirmPassword = 'Passwords do not match.';
    }
  }

  return {
    isValid: Object.keys(newErrors).length === 0,
    errors: newErrors
  };
};