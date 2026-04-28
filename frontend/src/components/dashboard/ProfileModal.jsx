// src/components/dashboard/ProfileModal.jsx
import React from 'react';
import { X, User, Mail, Lock, Key, Loader2 } from 'lucide-react';
import { useTranslation } from 'react-i18next'; // <-- IMPORT
import ProfileRow from './ProfileRow';
import { useProfile } from '../../hooks/useProfile'; // <-- IMPORT HOOK

export default function ProfileModal({ isOpen, onClose, user, onUpdateUser }) {
  const { t } = useTranslation(); // <-- HOOK
  
  // Panggil hook di sini
  const {
    editingField,
    editValue,
    setEditValue,
    errors,
    successMsg,
    isSaving,
    confirmModal,
    setConfirmModal,
    handleCancelEdit,
    handleSave,
    handleEditClick,
    handleForgotPasswordClick,
    executeConfirmAction
  } = useProfile({ isOpen, onClose, user, onUpdateUser });

  if (!isOpen) {
    return null;
  }

  const sharedProps = {
    editingField,
    editValue,
    setEditValue,
    errors,
    successMsg,
    isSaving,
    handleCancelEdit,
    handleSave,
    handleEditClick,
    onForgotPassword: handleForgotPasswordClick
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300" />
      
      <div className="bg-[var(--card)] w-full max-w-lg rounded-[2rem] border border-zinc-300 dark:border-zinc-600 shadow-[0_8px_30px_rgb(0,0,0,0.12)] dark:shadow-[0_20px_60px_rgba(0,0,0,0.8)] ring-1 ring-black/5 dark:ring-white/5 relative z-10 flex flex-col max-h-[85vh] animate-in fade-in zoom-in duration-300">
        
        <div className="flex items-center justify-between px-6 py-5 flex-shrink-0">
          <div>
            <h2 className="text-xl font-bold">{t('dashboard.profile.title')}</h2>
            <p className="text-[var(--muted-foreground)] text-xs mt-0.5">{t('dashboard.profile.subtitle')}</p>
          </div>
          <button onClick={onClose} disabled={isSaving || confirmModal.isOpen} className="p-2 rounded-full hover:bg-[var(--secondary)] transition-colors text-[var(--muted-foreground)] cursor-pointer disabled:opacity-50">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="px-6 py-2 overflow-y-auto custom-scrollbar flex-1 divide-y divide-zinc-200 dark:divide-zinc-800">
          <ProfileRow field="displayName" label={t('dashboard.profile.lblUsername')} icon={User} value={user?.displayName} {...sharedProps} />
          <ProfileRow field="email" label={t('dashboard.profile.lblEmail')} icon={Mail} value={user?.email} {...sharedProps} />
          <ProfileRow field="password" label={t('dashboard.profile.lblPassword')} icon={Lock} value={null} isPassword={true} {...sharedProps} />
          
          <div className="py-4">
            <ProfileRow field="publicKey" label={t('dashboard.profile.lblPublicKey')} icon={Key} value={user?.publicKey} {...sharedProps} />
            <p className="text-[10px] text-[var(--muted-foreground)] mt-1 font-medium">
              {t('dashboard.profile.keyWarning')}
            </p>
          </div>
        </div>

        {/* MODAL KONFIRMASI OVERLAY */}
        {confirmModal.isOpen && (
          <div className="absolute inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm rounded-[2rem]">
            <div className="bg-[var(--card)] w-full max-w-sm rounded-2xl border border-zinc-300 dark:border-zinc-600 shadow-xl p-6 flex flex-col animate-in zoom-in-95 duration-200">
              <h3 className="text-lg font-bold mb-2">
                {confirmModal.type === 'no_email_forgot_password' ? t('dashboard.profile.confirmCannotReset') : 
                 confirmModal.type === 'forgot_password' ? t('dashboard.profile.confirmReset') : 
                 t('dashboard.profile.confirmVerify')}
              </h3>
              
              <p className="text-sm text-[var(--muted-foreground)] mb-6 leading-relaxed">
                {confirmModal.type === 'no_email_forgot_password' 
                  ? t('dashboard.profile.descCannotReset') 
                  : confirmModal.type === 'forgot_password' ? t('dashboard.profile.descResetLink') : t('dashboard.profile.descVerifyLink')}
                
                {confirmModal.type !== 'no_email_forgot_password' && (
                  <span className="font-bold text-[var(--foreground)]">{confirmModal.targetEmail}</span>
                )}
                
                {confirmModal.type !== 'no_email_forgot_password' && '?'}
              </p>
              
              <div className="flex justify-end gap-3">
                <button 
                  onClick={() => setConfirmModal({ isOpen: false, type: '', targetEmail: '' })}
                  disabled={isSaving}
                  className="px-4 py-2 text-xs font-bold text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors disabled:opacity-50 cursor-pointer"
                >
                  {confirmModal.type === 'no_email_forgot_password' ? t('dashboard.profile.btnClose') : t('dashboard.profile.btnCancel')}
                </button>
                
                {confirmModal.type !== 'no_email_forgot_password' && (
                  <button 
                    onClick={executeConfirmAction}
                    disabled={isSaving}
                    className="flex items-center justify-center min-w-[5rem] px-4 py-2 bg-[var(--foreground)] text-[var(--background)] text-xs font-bold rounded-lg hover:opacity-90 transition-opacity shadow-md disabled:opacity-70 cursor-pointer"
                  >
                    {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : t('dashboard.profile.btnSendLink')}
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}