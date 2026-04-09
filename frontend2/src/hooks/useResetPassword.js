// src/hooks/useResetPassword.js
import { useState } from 'react';
import api from '../utils/api';
import { navigate } from '../utils/navigation';

// Fungsi validasi kita pindahkan ke sini agar file komponen UI bersih
const validateResetForm = (passwords, t) => {
  const { password, confirmPassword } = passwords;
  const errors = {};
  if (!password) {
    errors.password = t('auth.errRequired');
  } else if (password.length < 6) {
    errors.password = t('auth.errMin6');
  }
  if (password !== confirmPassword) {
    errors.confirmPassword = t('auth.errMatch');
  }
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

export function useResetPassword(token, t) {
  const [passwords, setPasswords] = useState({ password: '', confirmPassword: '' });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [feedback, setFeedback] = useState({ text: '', isSuccess: false });
  const [isSuccessState, setIsSuccessState] = useState(false);

  // Evaluasi token
  const isTokenValid = token && token.length === 64;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPasswords(prev => ({ ...prev, [name]: value }));
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
    if (feedback.text) {
      setFeedback({ text: '', isSuccess: false });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFeedback({ text: '', isSuccess: false });
    
    const { isValid, errors: validationErrors } = validateResetForm(passwords, t);
    
    if (isValid) {
      setIsLoading(true);
      try {
        const result = await api.auth.resetPassword(token, {
          password: passwords.password
        });
        
        setFeedback({ text: result.message, isSuccess: result.success });

        if (result.success) {
          setIsSuccessState(true);
          // Beri jeda 4 detik untuk melihat animasi sukses sebelum pindah ke Landing
          setTimeout(() => navigate('/'), 4000); 
        }
      } catch (err) {
        setFeedback({ 
          text: 'Connection failed. Please check your internet connection.', 
          isSuccess: false 
        });
      } finally {
        setIsLoading(false);
      }
    } else {
      setErrors(validationErrors);
    }
  };

  return {
    isTokenValid,
    passwords,
    errors,
    isLoading,
    feedback,
    isSuccessState,
    handleInputChange,
    handleSubmit
  };
}