// src/pages/ResetPassword.jsx
import React, { useState } from 'react';
import { Lock, ShieldCheck, Loader2, ArrowRight, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import api from '../utils/api';
import { navigate } from '../utils/navigation';

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

export default function ResetPassword({ token }) {
  const { t } = useTranslation();

  const [passwords, setPasswords] = useState({ password: '', confirmPassword: '' });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [feedback, setFeedback] = useState({ text: '', isSuccess: false });
  const [isSuccessState, setIsSuccessState] = useState(false);

  // === VALIDASI TOKEN DI AWAL ===
  if (!token || token.length !== 64) {
    return (
      <div className="min-h-screen bg-[var(--background)] flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-[var(--card)] border border-[var(--border-strong)] rounded-[2rem] shadow-xl p-8 text-center animate-in fade-in zoom-in-95 duration-300">
          <div className="p-4 bg-[var(--destructive)]/10 rounded-full w-fit mx-auto mb-6">
            <XCircle className="w-12 h-12 text-[var(--destructive)]" />
          </div>
          <h2 className="text-2xl font-bold text-[var(--foreground)] mb-2">Invalid Link</h2>
          <p className="text-[var(--muted-foreground)] text-sm mb-8 leading-relaxed">
            The password reset link is invalid, malformed, or has expired. Please request a new one.
          </p>
          <button
            onClick={() => navigate('/')}
            className="w-full bg-[var(--foreground)] text-[var(--background)] py-3.5 rounded-xl font-bold shadow-md hover:opacity-90 transition-all cursor-pointer active:scale-[0.98]"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }
  // ==============================

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

  const inputWrapperClass = (error) => `flex items-center bg-[var(--background)] px-4 py-2 rounded-xl border transition-all duration-300 shadow-inner ${error ? 'border-[var(--destructive)] ring-1 ring-[var(--destructive)]' : 'border-zinc-200 dark:border-zinc-700 focus-within:ring-2 focus-within:ring-[var(--ring)]'}`;
  const inputClass = "w-full bg-transparent outline-none text-sm text-[var(--foreground)] placeholder:text-[var(--muted-foreground)]";
  
  return (
    <div className="min-h-screen bg-[var(--background)] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-[var(--card)] border border-[var(--border-strong)] rounded-[2rem] shadow-xl p-8 animate-in fade-in zoom-in-95 duration-300">
          
          {isSuccessState ? (
            <div className="text-center animate-in fade-in zoom-in">
              <CheckCircle className="w-16 h-16 mx-auto text-green-500 mb-4" />
              <h2 className="text-2xl font-bold text-[var(--foreground)] mb-2">Success!</h2>
              <p className="text-[var(--muted-foreground)] text-sm leading-relaxed">
                {feedback.text || t('resetPassword.successDesc')}
              </p>
            </div>
          ) : (
            <>
              <div className="text-center mb-8">
                <h1 className="text-2xl font-bold tracking-tight text-[var(--foreground)]">{t('resetPassword.title')}</h1>
                <p className="text-sm text-[var(--muted-foreground)] mt-1">{t('resetPassword.desc')}</p>
              </div>

              {feedback.text && (
                <div className={`mb-6 p-4 border rounded-xl flex items-start gap-3 text-xs font-bold animate-in fade-in slide-in-from-top-2 ${
                  feedback.isSuccess 
                    ? 'bg-green-500/10 border-green-500/20 text-green-600 dark:text-green-400' 
                    : 'bg-[var(--destructive)]/10 border-[var(--destructive)]/20 text-[var(--destructive)]'
                }`}>
                  <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  <p className="leading-relaxed">{feedback.text}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-[var(--muted-foreground)] ml-1">
                    {t('resetPassword.labelPassword')}
                  </label>
                  <div className={inputWrapperClass(errors.password)}>
                    <Lock className={`w-4 h-4 mr-3 flex-shrink-0 ${errors.password ? 'text-[var(--destructive)]' : 'text-[var(--muted-foreground)]'}`} />
                    <input 
                      type="password" 
                      name="password" 
                      value={passwords.password} 
                      onChange={handleInputChange} 
                      placeholder={t('auth.placeholderPassword')} 
                      className={inputClass} 
                      disabled={isLoading} 
                    />
                  </div>
                  {errors.password && (
                    <p className="text-[var(--destructive)] text-[10px] ml-1 font-bold animate-in fade-in slide-in-from-left-1">{errors.password}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-[var(--muted-foreground)] ml-1">
                    {t('resetPassword.labelConfirm')}
                  </label>
                  <div className={inputWrapperClass(errors.confirmPassword)}>
                    <ShieldCheck className={`w-4 h-4 mr-3 flex-shrink-0 ${errors.confirmPassword ? 'text-[var(--destructive)]' : 'text-[var(--muted-foreground)]'}`} />
                    <input 
                      type="password" 
                      name="confirmPassword" 
                      value={passwords.confirmPassword} 
                      onChange={handleInputChange} 
                      placeholder={t('resetPassword.placeholderConfirm')} 
                      className={inputClass} 
                      disabled={isLoading} 
                    />
                  </div>
                  {errors.confirmPassword && (
                    <p className="text-[var(--destructive)] text-[10px] ml-1 font-bold animate-in fade-in slide-in-from-left-1">{errors.confirmPassword}</p>
                  )}
                </div>

                <button 
                  type="submit" 
                  disabled={isLoading}
                  className="w-full bg-[var(--primary)] text-[var(--primary-foreground)] py-3.5 rounded-xl font-bold shadow-lg hover:opacity-90 transition-all duration-300 flex items-center justify-center gap-2 mt-4 cursor-pointer active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
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