// src/helpers/profileValidation.js

export const validateProfileField = (field, value) => {
  const errors = {};

  if (field === 'displayName' || field === 'username') {
    const cleanValue = value ? value.trim() : '';
    if (!cleanValue) {
      errors[field] = 'Username is required.';
    } else if (cleanValue.length > 50) {
      errors[field] = 'Max 50 characters.';
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
    // value sekarang berupa objek { oldPassword: '', newPassword: '' }
    if (!value.oldPassword) {
      errors.oldPassword = 'Old password is required.';
    }
    
    if (!value.newPassword) {
      errors.newPassword = 'New password is required.';
    } else if (value.newPassword.length < 6) {
      errors.newPassword = 'Min 6 characters.';
    }
  }

  if (field === 'publicKey') {
    const cleanValue = value ? value.trim() : '';
    if (!cleanValue) {
      errors[field] = 'Public key cannot be empty.';
    } else if (cleanValue.length > 100) {
      errors[field] = 'Max 100 characters.';
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};