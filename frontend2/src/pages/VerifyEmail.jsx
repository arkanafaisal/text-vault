// src/pages/VerifyEmail.jsx
import React, { useEffect, useState } from 'react';
import { Loader2, CheckCircle2, XCircle, ArrowRight } from 'lucide-react';
import api from '../utils/api';
import apiMessages from '../helpers/apiMessages'; // <-- Import Helper Global
import { navigate } from '../utils/navigation';

export default function VerifyEmail({ token }) {
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
        // 2. Eksekusi API yang sudah menggunakan Service Layer
        const result = await api.auth.verifyEmail(token);
        
        if (isMounted) {
          // 3. Gunakan properti dari objek result yang konsisten
          setMessage(result.message);
          setStatus(result.success ? 'success' : 'error');
        }
      } catch (error) {
        if (isMounted) {
          setStatus('error');
          setMessage('A network error occurred. Please try again later.');
        }
      }
    };

    verifyToken();

    return () => {
      isMounted = false;
    };
  }, [token]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--background)] p-4">
      <div className="bg-[var(--card)] w-full max-w-md rounded-[2rem] border border-[var(--border-strong)] shadow-xl p-8 flex flex-col items-center text-center animate-in fade-in zoom-in-95 duration-300">
        
        <div className="mb-6">
          {status === 'loading' && (
            <div className="p-4 bg-[var(--primary)]/10 rounded-full">
              <Loader2 className="w-12 h-12 text-[var(--primary)] animate-spin" />
            </div>
          )}
          {status === 'success' && (
            <div className="p-4 bg-green-500/10 rounded-full animate-in zoom-in duration-500">
              <CheckCircle2 className="w-12 h-12 text-green-500" />
            </div>
          )}
          {status === 'error' && (
            <div className="p-4 bg-[var(--destructive)]/10 rounded-full animate-in shake duration-500">
              <XCircle className="w-12 h-12 text-[var(--destructive)]" />
            </div>
          )}
        </div>

        <h2 className="text-2xl font-bold text-[var(--foreground)] mb-2">
          {status === 'loading' && 'Verifying Email'}
          {status === 'success' && 'Email Verified!'}
          {status === 'error' && 'Verification Failed'}
        </h2>

        <p className="text-[var(--muted-foreground)] text-sm mb-8 leading-relaxed">
          {message}
        </p>

        {status !== 'loading' && (
          <button
            onClick={() => navigate('/')}
            className="flex items-center justify-center gap-2 w-full py-3.5 bg-[var(--foreground)] text-[var(--background)] font-bold rounded-xl hover:opacity-90 transition-opacity cursor-pointer shadow-md active:scale-[0.98]"
          >
            {status === 'success' ? 'Continue to Login' : 'Back to Home'}
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
        
      </div>
    </div>
  );
}