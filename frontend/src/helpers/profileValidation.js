// src/helpers/profileValidation.js
import { VALIDATION } from '../utils/constants'; // <-- IMPORT KONSTANTA

export const validateProfileField = (field, value) => {
  const errors = {};

  // Perbaikan bug: tambahkan 'displayName' agar sinkron dengan ProfileModal
  if (field === 'display_name' || field === 'username') {
    const cleanValue = value ? value.trim() : '';
    if (!cleanValue) {
      errors[field] = 'Username is required.';
    } else if (cleanValue.length > VALIDATION.USER.MAX_USERNAME) { // <-- KONSTANTA
      errors[field] = `Max ${VALIDATION.USER.MAX_USERNAME} characters.`;
    }
  }

  if (field === 'email') {
    const cleanValue = value ? value.trim() : '';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (cleanValue && !emailRegex.test(cleanValue)) {
      errors[field] = 'Invalid email format.';
    }
  }

  if (field === 'password') {
    if (!value.oldPassword) {
      errors.oldPassword = 'Old password is required.';
    }
    
    if (!value.newPassword) {
      errors.newPassword = 'New password is required.';
    } else if (value.newPassword.length < VALIDATION.USER.MIN_PASSWORD) { // <-- KONSTANTA
      errors.newPassword = `Min ${VALIDATION.USER.MIN_PASSWORD} characters.`;
    }
  }

  if (field === 'publicKey') {
    const cleanValue = value ? value.trim() : '';
    if (!cleanValue) {
      errors[field] = 'Public key cannot be empty.';
    } else if (cleanValue.length > VALIDATION.USER.MAX_PUBLIC_KEY) { // <-- KONSTANTA
      errors[field] = `Max ${VALIDATION.USER.MAX_PUBLIC_KEY} characters.`;
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};