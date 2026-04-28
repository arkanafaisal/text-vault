// src/hooks/useProfile.js
import { useState, useEffect } from 'react';
import api from '../utils/api';
import { validateProfileField } from '../helpers/profileValidation';
import { SYSTEM_MESSAGES } from '../utils/constants';
import { toast } from '../utils/toast';
import { useTranslation } from 'react-i18next';


export function useProfile({ isOpen, onClose, user, onUpdateUser }) {
  const { t } = useTranslation()

  const [editingField, setEditingField] = useState(null);
  const [editValue, setEditValue] = useState('');
  const [errors, setErrors] = useState({});
  const [successMsg, setSuccessMsg] = useState({});
  const [isSaving, setIsSaving] = useState(false);
  
  // State untuk Confirmation Modal
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, type: '', targetEmail: '' });

  const [deleteModal, setDeleteModal] = useState({ isOpen: false, confirmUsername: '' });
  const [isDeleting, setIsDeleting] = useState(false);

  // Pindahkan useEffect listener tombol Escape ke sini
  useEffect(() => {
    const handleKeyDown = (e) => {
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
    
    try {
      let result;

      if (field === 'displayName' || field === 'username') {
        result = await api.users.updateUsername({ username: typeof editValue === 'string' ? editValue.trim() : editValue });
      } else if (field === 'password') {
        result = await api.users.updatePassword({ 
          oldPassword: editValue.oldPassword, 
          newPassword: editValue.newPassword 
        });
      } else if (field === 'publicKey') {
        result = await api.users.updatePublicKey({ publicKey: typeof editValue === 'string' ? editValue.trim() : editValue });
      }

      if (result && result.success) {
        setSuccessMsg({ [field]: result.message });
        
        if (onUpdateUser && field !== 'password') {
          onUpdateUser(field, editValue);
        }
      } else {
        setErrors({ [field]: result.message });
      }
    } catch (error) {
      setErrors({ [field]: SYSTEM_MESSAGES.NETWORK_ERROR });
    } finally {
      setIsSaving(false);
    }
  };

  const executeConfirmAction = async () => {
    setIsSaving(true);
    try {
      let result;

      if (confirmModal.type === 'edit_email' || confirmModal.type === 'set_new_email') {
        result = await api.users.updateEmail({ email: confirmModal.targetEmail });
        
        if (result && result.success) {
          setSuccessMsg({ email: result.message });
          setConfirmModal({ isOpen: false, type: '', targetEmail: '' });
        } else {
          setErrors({ email: result.message });
          setConfirmModal({ isOpen: false, type: '', targetEmail: '' });
        }
        
      } else if (confirmModal.type === 'forgot_password') {
        result = await api.auth.forgotPassword({ email: confirmModal.targetEmail });
        
        if (result && result.success) {
          setSuccessMsg({ password: result.message });
          setErrors({});
          setConfirmModal({ isOpen: false, type: '', targetEmail: '' });
        } else {
          setErrors({ password: result.message });
          setConfirmModal({ isOpen: false, type: '', targetEmail: '' });
        }
      }
    } catch (error) {
      if (confirmModal.type === 'edit_email' || confirmModal.type === 'set_new_email') {
        setErrors({ email: SYSTEM_MESSAGES.NETWORK_ERROR });
      } else {
        setErrors({ password: SYSTEM_MESSAGES.NETWORK_ERROR });
      }
      setConfirmModal({ isOpen: false, type: '', targetEmail: '' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteUser = async () => {
    if (deleteModal.confirmUsername !== user.displayName) {
      toast.error(t('dashboard.profile.errUsernameMatch'));
      return;
    }

    setIsDeleting(true);
    try {
      const result = await api.users.deleteMe({ username: deleteModal.confirmUsername });
      
      if (result.success) {
        toast.success(result.message);
        // Paksa refresh ke halaman utama untuk membersihkan semua state/cookies
        window.location.href = '/'; 
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error(SYSTEM_MESSAGES.NETWORK_ERROR);
    } finally {
      setIsDeleting(false);
    }
  };

  return {
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
    executeConfirmAction,
    deleteModal, // <-- EXPORT STATE INI
    setDeleteModal, // <-- EXPORT FUNGSI INI
    isDeleting, // <-- EXPORT STATE INI
    handleDeleteUser
  };
}