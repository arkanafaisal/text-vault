// src/pages/ResetPassword.jsx
import React, { useState } from 'react';
import { Lock, ShieldCheck, Loader2, ArrowRight, AlertTriangle, CheckCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import api from '../utils/api';
import { navigate } from '../utils/navigation'; // Import navigasi kustom

// Simple validation function for this form
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

// Menerima token sebagai prop
export default function ResetPassword({ token }) {
  const { t } = useTranslation();

  const [passwords, setPasswords] = useState({ password: '', confirmPassword: '' });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPasswords(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
    if (apiError) setApiError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError('');
    const { isValid, errors: validationErrors } = validateResetForm(passwords, t);
    
    if (isValid) {
      setIsLoading(true);
      try {
        const { response, result } = await api.auth.resetPassword(token, {
          password: passwords.password
        });
        
        if (response.ok && result.success) {
          setIsSuccess(true);
          // Menggunakan navigasi kustom
          setTimeout(() => navigate('/'), 4000); 
        } else {
          setApiError(result.message || t('resetPassword.errDefault'));
        }
      } catch (err) {
        setApiError(t('resetPassword.errConnection'));
      } finally {
        setIsLoading(false);
      }
    } else {
      setErrors(validationErrors);
    }
  };

  const inputWrapperClass = (error) => `flex items-center bg-white dark:bg-zinc-800 px-4 py-2 rounded-xl border transition-all duration-300 shadow-inner ${error ? 'border-red-500 ring-1 ring-red-500' : 'border-zinc-200 dark:border-zinc-700 focus-within:ring-2 focus-within:ring-[var(--ring)]'}`;
  const inputClass = "w-full bg-transparent outline-none text-sm text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-500";
  
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700/50 rounded-2xl shadow-xl p-8">
          
          {isSuccess ? (
            <div className="text-center animate-in fade-in zoom-in">
              <CheckCircle className="w-16 h-16 mx-auto text-[var(--primary)] mb-4" />
              <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-2">{t('resetPassword.successTitle')}</h2>
              <p className="text-zinc-600 dark:text-zinc-400">{t('resetPassword.successDesc')}</p>
            </div>
          ) : (
            <>
              <div className="text-center mb-8">
                <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">{t('resetPassword.title')}</h1>
                <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">{t('resetPassword.desc')}</p>
              </div>

              {apiError && (
                <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3 text-red-600 dark:text-red-400 text-sm font-medium">
                  <AlertTriangle className="w-5 h-5 flex-shrink-0" />
                  <span>{apiError}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-zinc-600 dark:text-zinc-300 ml-1">{t('resetPassword.labelPassword')}</label>
                  <div className={inputWrapperClass(errors.password)}>
                    <Lock className={`w-4 h-4 mr-3 flex-shrink-0 ${errors.password ? 'text-red-500' : 'text-zinc-400'}`} />
                    <input type="password" name="password" value={passwords.password} onChange={handleInputChange} placeholder={t('auth.placeholderPassword')} className={inputClass} disabled={isLoading} />
                  </div>
                  {errors.password && <p className="text-red-500 text-xs ml-1 font-bold">{errors.password}</p>}
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-zinc-600 dark:text-zinc-300 ml-1">{t('resetPassword.labelConfirm')}</label>
                  <div className={inputWrapperClass(errors.confirmPassword)}>
                    <ShieldCheck className={`w-4 h-4 mr-3 flex-shrink-0 ${errors.confirmPassword ? 'text-red-500' : 'text-zinc-400'}`} />
                    <input type="password" name="confirmPassword" value={passwords.confirmPassword} onChange={handleInputChange} placeholder={t('resetPassword.placeholderConfirm')} className={inputClass} disabled={isLoading} />
                  </div>
                  {errors.confirmPassword && <p className="text-red-500 text-xs ml-1 font-bold">{errors.confirmPassword}</p>}
                </div>

                <button 
                  type="submit" 
                  disabled={isLoading}
                  className="w-full bg-[var(--primary)] text-primary-foreground py-3 rounded-xl font-bold shadow-lg hover:bg-[var(--primary)]/90 transition-all duration-300 flex items-center justify-center gap-2 mt-4 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      {t('resetPassword.btnSubmit')}
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}