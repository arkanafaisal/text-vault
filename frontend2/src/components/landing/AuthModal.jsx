// src/components/landing/AuthModal.jsx
import React, { useState, useEffect } from 'react';
import { X, User, Lock, ArrowRight, AlertTriangle, ShieldCheck, Loader2, MailCheck, CheckCircle2 } from 'lucide-react';
import { validateAuthForm } from '../../helpers/authValidation';
import apiMessages from '../../helpers/apiMessages';
import { useTranslation } from 'react-i18next';
import api from '../../utils/api';
import { navigate } from '../../utils/navigation';

export default function AuthModal({ isOpen, onClose, type, setType }) {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({ identifier: '', password: '', confirmPassword: '' });
  const [errors, setErrors] = useState({});
  
  const [isLoading, setIsLoading] = useState(false);
  
  // State tunggal untuk pesan balikan dari backend (Sukses / Error)
  const [feedback, setFeedback] = useState({ text: '', isSuccess: false });
  const [isForgotPasswordSuccess, setIsForgotPasswordSuccess] = useState(false);

  useEffect(() => {
    setFormData({ identifier: '', password: '', confirmPassword: '' });
    setErrors({});
    setFeedback({ text: '', isSuccess: false });
    setIsForgotPasswordSuccess(false);
  }, [isOpen, type]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
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
    const { isValid, errors: validationErrors } = validateAuthForm(type, formData, t);
    
    if (isValid) {
      setIsLoading(true);
      
      try {
        let result;

        // 1. Eksekusi API sesuai tipe form (Semuanya sekarang mengembalikan Service Object)
        if (type === 'login') {
          result = await api.auth.login({
            identifier: formData.identifier.trim(),
            password: formData.password.trim()
          });
        } else if (type === 'signup') {
          result = await api.auth.register({
            username: formData.identifier.trim(),
            password: formData.password.trim()
          });
        } else if (type === 'forgot-password') {
          result = await api.auth.forgotPassword({ 
            email: formData.identifier.trim() 
          });
        }

        // 2. Tampilkan pesan feedback langsung dari objek result
        setFeedback({ text: result.message, isSuccess: result.success });

        // 3. Tangani aksi setelah sukses
        if (result.success) {
          if (type === 'forgot-password') {
            setIsForgotPasswordSuccess(true);
          } else {
            // Token diambil dari result.data (Berlaku untuk login maupun register)
            const token = result.data?.accessToken || (typeof result.data === 'string' ? result.data : null);

            if (token) {
              localStorage.setItem('accessToken', token);
            }
            
            setTimeout(() => {
              setFormData({ identifier: '', password: '', confirmPassword: '' });
              onClose();
              navigate('/dashboard');
            }, 500);
          }
        }
      } catch (err) {
        setFeedback({ text: 'Failed to process request. Please check your connection.', isSuccess: false });
      } finally {
        setIsLoading(false);
      }
    } else {
      setErrors(validationErrors);
    }
  };

  if (!isOpen) {
    return null;
  }

  const getTitle = () => {
    if (type === 'login') return t('auth.loginTitle');
    if (type === 'signup') return t('auth.signupTitle');
    return t('auth.forgotPasswordTitle');
  };

  const getDescription = () => {
    if (type === 'login') return t('auth.loginDesc');
    if (type === 'signup') return t('auth.signupDesc');
    return t('auth.forgotPasswordDesc');
  };

  const inputWrapperClass = (error) => `flex items-center bg-[var(--background)] px-4 py-2 rounded-xl border transition-all duration-300 shadow-inner ${error ? 'border-[var(--destructive)] ring-1 ring-[var(--destructive)]' : 'border-zinc-200 dark:border-zinc-800 focus-within:ring-2 focus-within:ring-[var(--ring)]'}`;
  const inputClass = "w-full bg-transparent outline-none text-sm text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] [box-shadow:0_0_0_30px_var(--background)_inset!important] [-webkit-text-fill-color:var(--foreground)!important]";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm cursor-default transition-opacity duration-300" onClick={onClose} />
      
      <div className="bg-[var(--card)] w-full max-w-md p-6 md:p-7 rounded-3xl border border-zinc-300 dark:border-zinc-800 shadow-2xl relative z-10 animate-in fade-in zoom-in duration-300 ease-out">
        <button onClick={onClose} className="absolute right-4 top-4 p-2 rounded-full hover:bg-[var(--secondary)] transition-colors text-[var(--muted-foreground)] cursor-pointer z-20">
          <X className="w-5 h-5" />
        </button>

        {isForgotPasswordSuccess ? (
          <div className="text-center py-8 animate-in fade-in zoom-in">
            <MailCheck className="w-16 h-16 mx-auto text-green-500 mb-4" />
            <h2 className="text-xl font-bold mb-2">{t('auth.successTitle')}</h2>
            <p className="text-[var(--muted-foreground)] text-sm mb-6">{t('auth.successDesc')}</p>
            <button 
              onClick={onClose}
              className="w-full bg-[var(--primary)] text-[var(--primary-foreground)] py-3 rounded-xl font-bold shadow-lg hover:opacity-90 transition-all duration-300"
            >
              {t('auth.btnClose')}
            </button>
          </div>
        ) : (
          <>
            <div className="mb-6">
              <h2 className="text-xl md:text-2xl font-bold mb-1">{getTitle()}</h2>
              <p className="text-[var(--muted-foreground)] text-xs md:text-sm">{getDescription()}</p>
            </div>

            {/* FEEDBACK BANNER (Bisa Berwarna Merah atau Hijau Tergantung response.ok) */}
            {feedback.text && (
              <div className={`mb-4 p-3 border rounded-xl flex items-start gap-2.5 text-xs font-bold animate-in fade-in zoom-in slide-in-from-top-2 ${
                feedback.isSuccess 
                  ? 'bg-green-500/10 border-green-500/20 text-green-600 dark:text-green-400' 
                  : 'bg-[var(--destructive)]/10 border-[var(--destructive)]/20 text-[var(--destructive)]'
              }`}>
                {feedback.isSuccess ? (
                  <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5" />
                ) : (
                  <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                )}
                <p className="leading-relaxed">{feedback.text}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5 relative">
                <label className="text-[10px] font-bold uppercase tracking-wider text-[var(--muted-foreground)] ml-1">
                  {type === 'login' ? t('auth.labelIdLogin') : (type === 'signup' ? t('auth.labelIdSignup') : t('auth.labelEmail'))}
                </label>
                <div className={inputWrapperClass(errors.identifier)}>
                  <User className={`w-4 h-4 mr-3 flex-shrink-0 ${errors.identifier ? 'text-[var(--destructive)]' : 'text-[var(--muted-foreground)]'}`} />
                  <input 
                    type={type === 'forgot-password' ? 'email' : 'text'}
                    name="identifier" 
                    value={formData.identifier} 
                    onChange={handleInputChange} 
                    placeholder={type === 'login' ? t('auth.placeholderIdLogin') : (type === 'signup' ? t('auth.placeholderIdSignup') : t('auth.placeholderEmail'))}
                    className={inputClass} 
                    disabled={isLoading}
                  />
                </div>
                {errors.identifier && (
                  <p className="text-[var(--destructive)] text-[10px] ml-1 font-bold animate-in fade-in slide-in-from-left-1">{errors.identifier}</p>
                )}
              </div>

              {type !== 'forgot-password' && (
                <>
                  <div className="space-y-1.5 relative">
                     <div className="flex justify-between items-center">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-[var(--muted-foreground)] ml-1">{t('auth.labelPassword')}</label>
                      {type === 'login' && (
                        <button 
                          type="button"
                          onClick={() => setType('forgot-password')}
                          className="text-[10px] font-bold text-[var(--muted-foreground)] hover:text-[var(--primary)] transition-colors pr-1"
                        >
                          {t('auth.linkForgotPassword')}
                        </button>
                      )}
                    </div>
                    <div className={inputWrapperClass(errors.password)}>
                      <Lock className={`w-4 h-4 mr-3 flex-shrink-0 ${errors.password ? 'text-[var(--destructive)]' : 'text-[var(--muted-foreground)]'}`} />
                      <input type="password" name="password" value={formData.password} onChange={handleInputChange} placeholder={t('auth.placeholderPassword')} className={inputClass} disabled={isLoading} />
                    </div>
                    {errors.password && (
                      <p className="text-[var(--destructive)] text-[10px] ml-1 font-bold animate-in fade-in slide-in-from-left-1">{errors.password}</p>
                    )}
                  </div>
                </>
              )}

              <div className={`grid transition-all duration-500 ease-in-out ${type === 'signup' ? 'grid-rows-[1fr] opacity-100 mb-2' : 'grid-rows-[0fr] opacity-0'}`}>
                <div className="overflow-hidden">
                  <div className="space-y-1.5 pt-2 relative">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-[var(--muted-foreground)] ml-1">{t('auth.labelConfirm')}</label>
                    <div className={inputWrapperClass(errors.confirmPassword)}>
                      <ShieldCheck className={`w-4 h-4 mr-3 flex-shrink-0 ${errors.confirmPassword ? 'text-[var(--destructive)]' : 'text-[var(--muted-foreground)]'}`} />
                      <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleInputChange} placeholder={t('auth.placeholderPassword')} className={inputClass} disabled={isLoading} />
                    </div>
                    {errors.confirmPassword && (
                      <p className="text-[var(--destructive)] text-[10px] ml-1 font-bold animate-in fade-in slide-in-from-left-1">{errors.confirmPassword}</p>
                    )}
                  </div>
                </div>
              </div>

              <button 
                type="submit" 
                disabled={isLoading}
                className="w-full bg-[var(--primary)] text-[var(--primary-foreground)] py-3 rounded-xl font-bold shadow-lg hover:opacity-90 transition-all duration-300 flex items-center justify-center gap-2 mt-2 cursor-pointer active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed text-sm"
              >
                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    {type === 'login' ? t('auth.btnLogin') : (type === 'signup' ? t('auth.btnSignup') : t('auth.btnForgotPassword'))}
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-6 text-center text-xs text-[var(--muted-foreground)] font-medium">
              <p>
                {type === 'login' ? t('auth.noAccount') : (type === 'signup' ? t('auth.hasAccount') : t('auth.rememberPassword'))} 
                <button 
                  type="button"
                  disabled={isLoading}
                  onClick={() => setType(type === 'forgot-password' ? 'login' : (type === 'login' ? 'signup' : 'login'))} 
                  className="text-[var(--foreground)] ml-1 font-bold cursor-pointer hover:underline decoration-[var(--primary)] underline-offset-4 transition-all disabled:opacity-50 disabled:cursor-not-allowed bg-transparent border-none p-0"
                >
                  {type === 'login' ? t('auth.linkSignup') : t('auth.linkLogin')}
                </button>
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}