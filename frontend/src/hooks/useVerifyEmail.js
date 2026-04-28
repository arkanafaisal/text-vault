// src/hooks/useVerifyEmail.js
import { useState, useEffect } from 'react';
import api from '../utils/api';

export function useVerifyEmail(token) {
  const [status, setStatus] = useState('loading'); // 'loading' | 'success' | 'error'
  const [message, setMessage] = useState('Verifying your email address...');

  useEffect(() => {
    let isMounted = true;

    const verifyToken = async () => {
      // 1. Validasi format token
      if (!token || token.length !== 64) {
        setStatus('error');
        setMessage('Invalid or missing verification token.');
        return;
      }

      try {
        // 2. Eksekusi API
        const result = await api.auth.verifyEmail(token);
        
        if (isMounted) {
          setMessage(result.message);
          setStatus(result.success ? 'success' : 'error');
        }
      } catch (error) {
        if (isMounted) {
          setStatus('error');
          setMessage(SYSTEM_MESSAGES.NETWORK_ERROR); // <-- 2. GANTI TEKS STATIS
        }
      }
    };

    verifyToken();

    return () => {
      isMounted = false;
    };
  }, [token]);

  return {
    status,
    message
  };
}