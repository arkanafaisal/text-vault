// src/components/dashboard/ProfileModal.jsx
import React, { useState, useEffect } from 'react';
import { X, User, Mail, Lock, Key, Loader2 } from 'lucide-react';
import { validateProfileField } from '../../helpers/profileValidation';
import api from '../../utils/api';
import ProfileRow from './ProfileRow';

export default function ProfileModal({ isOpen, onClose, user, onUpdateUser }) {
  const [editingField, setEditingField] = useState(null);
  const [editValue, setEditValue] = useState('');
  const [errors, setErrors] = useState({});
  const [successMsg, setSuccessMsg] = useState({});
  const [isSaving, setIsSaving] = useState(false);
  
  // State untuk Confirmation Modal
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, type: '', targetEmail: '' });

  useEffect(() => {
    const handleKeyDown = (e) => {
      // Escape hanya bekerja jika tidak sedang ada proses save DAN tidak sedang buka confirm modal
      if (e.key === 'Escape' && isOpen && !isSaving && !confirmModal.isOpen) {
        if (editingField) {
          setEditingField(null);
          setSuccessMsg({});
        } else {
          onClose();
        }
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose, editingField, isSaving, confirmModal.isOpen]);

  if (!isOpen) {
    return null;
  }

  const handleEditClick = (field, currentValue) => {
    setEditingField(field);
    setErrors({});
    setSuccessMsg({});
    
    if (field === 'password') {
      setEditValue({ oldPassword: '', newPassword: '' });
    } else {
      setEditValue(currentValue || '');
    }
  };

  const handleCancelEdit = () => {
    setEditingField(null);
    setErrors({});
    setSuccessMsg({});
  };

  const handleForgotPasswordClick = () => {
    if (!user?.email) {
      setConfirmModal({ isOpen: true, type: 'no_email_forgot_password', targetEmail: '' });
    } else {
      setConfirmModal({ isOpen: true, type: 'forgot_password', targetEmail: user.email });
    }
  };

  const handleSave = async (field) => {
    const { isValid, errors: validationErrors } = validateProfileField(field, editValue);
    
    if (!isValid) {
      setErrors(validationErrors);
      setSuccessMsg({});
      return;
    }

    // Intercept untuk Email agar memunculkan modal
    if (field === 'email') {
      if (!user?.email) {
        setConfirmModal({ isOpen: true, type: 'set_new_email', targetEmail: editValue });
      } else {
        setConfirmModal({ isOpen: true, type: 'edit_email', targetEmail: editValue });
      }
      return; 
    }
    
    setIsSaving(true);
    setErrors({});
    setSuccessMsg({});
    let responseData;

    try {
      if (field === 'display_name' || field === 'username') {
        responseData = await api.users.updateUsername({ username: editValue });
      } else if (field === 'password') {
        responseData = await api.users.updatePassword({ 
          oldPassword: editValue.oldPassword, 
          newPassword: editValue.newPassword 
        });
      } else if (field === 'publicKey') {
        responseData = await api.users.updatePublicKey({ publicKey: editValue });
      }

      if (responseData && responseData.response && responseData.response.ok && responseData.result.success) {
        // KITA BIARKAN EDITING FIELD TERBUKA AGAR PESAN SUKSES TERLIHAT
        setSuccessMsg({ 
          [field]: responseData.result.message || 'Successfully updated.' 
        });
        
        if (onUpdateUser) {
          if (field !== 'password') {
            onUpdateUser(field, editValue);
          }
        }
      } else {
        setErrors({ 
          [field]: responseData?.result?.message || 'Failed to update data.' 
        });
      }
    } catch (error) {
      setErrors({ 
        [field]: 'Network error occurred.' 
      });
    } finally {
      setIsSaving(false);
    }
  };

  const executeConfirmAction = async () => {
    setIsSaving(true);
    try {
      if (confirmModal.type === 'edit_email' || confirmModal.type === 'set_new_email') {
        const { response, result } = await api.users.updateEmail({ email: confirmModal.targetEmail });
        
        if (response && response.ok && result && result.success) {
          setSuccessMsg({ email: result.message || 'Verification link sent to your email.' });
          setConfirmModal({ isOpen: false, type: '', targetEmail: '' });
        } else {
          setErrors({ email: result?.message || 'Failed to send verification.' });
          setConfirmModal({ isOpen: false, type: '', targetEmail: '' });
        }
      } else if (confirmModal.type === 'forgot_password') {
        
        // PANGGILAN API FORGOT PASSWORD YANG NYATA
        const { response, result } = await api.auth.forgotPassword({ email: confirmModal.targetEmail });
        
        if (response && response.ok && result && result.success) {
          setSuccessMsg({ password: result.message || 'Password reset link sent to your email.' });
          setErrors({});
          setConfirmModal({ isOpen: false, type: '', targetEmail: '' });
        } else {
          setErrors({ password: result?.message || 'Failed to send reset link. Please try again.' });
          setConfirmModal({ isOpen: false, type: '', targetEmail: '' });
        }
        
      }
    } catch (error) {
      if (confirmModal.type === 'edit_email' || confirmModal.type === 'set_new_email') {
        setErrors({ email: 'Network error occurred.' });
      } else {
        setErrors({ password: 'Network error occurred.' });
      }
      setConfirmModal({ isOpen: false, type: '', targetEmail: '' });
    } finally {
      setIsSaving(false);
    }
  };

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
            <h2 className="text-xl font-bold">Profile</h2>
            <p className="text-[var(--muted-foreground)] text-xs mt-0.5">Manage your account credentials</p>
          </div>
          <button onClick={onClose} disabled={isSaving || confirmModal.isOpen} className="p-2 rounded-full hover:bg-[var(--secondary)] transition-colors text-[var(--muted-foreground)] cursor-pointer disabled:opacity-50">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="px-6 py-2 overflow-y-auto custom-scrollbar flex-1 divide-y divide-zinc-200 dark:divide-zinc-800">
          <ProfileRow field="display_name" label="Username" icon={User} value={user?.display_name} {...sharedProps} />
          <ProfileRow field="email" label="Email" icon={Mail} value={user?.email} {...sharedProps} />
          <ProfileRow field="password" label="Password" icon={Lock} value={null} isPassword={true} {...sharedProps} />
          
          <div className="py-4">
            <ProfileRow field="publicKey" label="Public Key" icon={Key} value={user?.publicKey} {...sharedProps} />
            <p className="text-[10px] text-[var(--muted-foreground)] mt-1 font-medium">
              * Share this key to allow public read-only access to your specific data.
            </p>
          </div>
        </div>

        {/* MODAL KONFIRMASI OVERLAY (Berada di atas Profile Modal) */}
        {confirmModal.isOpen && (
          <div className="absolute inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm rounded-[2rem]">
            <div className="bg-[var(--card)] w-full max-w-sm rounded-2xl border border-zinc-300 dark:border-zinc-600 shadow-xl p-6 flex flex-col animate-in zoom-in-95 duration-200">
              <h3 className="text-lg font-bold mb-2">
                {confirmModal.type === 'no_email_forgot_password' ? 'Cannot Reset Password' : 
                 confirmModal.type === 'forgot_password' ? 'Reset Password' : 
                 'Verify Email'}
              </h3>
              
              <p className="text-sm text-[var(--muted-foreground)] mb-6 leading-relaxed">
                {confirmModal.type === 'no_email_forgot_password' 
                  ? 'You do not have a registered email address. Please set your email first to use the forgot password feature.' 
                  : `We will send a ${confirmModal.type === 'forgot_password' ? 'reset' : 'verification'} link to `}
                
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
                  {confirmModal.type === 'no_email_forgot_password' ? 'Close' : 'Cancel'}
                </button>
                
                {confirmModal.type !== 'no_email_forgot_password' && (
                  <button 
                    onClick={executeConfirmAction}
                    disabled={isSaving}
                    className="flex items-center justify-center min-w-[5rem] px-4 py-2 bg-[var(--foreground)] text-[var(--background)] text-xs font-bold rounded-lg hover:opacity-90 transition-opacity shadow-md disabled:opacity-70 cursor-pointer"
                  >
                    {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Send Link'}
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