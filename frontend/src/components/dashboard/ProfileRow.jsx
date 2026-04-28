// src/components/dashboard/ProfileRow.jsx
import React from 'react';
import { Edit2, Loader2 } from 'lucide-react';
import { useTranslation } from 'react-i18next'; // <-- IMPORT
import { VALIDATION } from '../../utils/constants'; // <-- 1. IMPORT KONSTANTA

export default function ProfileRow({
  field,
  label,
  icon: Icon,
  value,
  isPassword = false,
  editingField,
  editValue,
  setEditValue,
  errors,
  successMsg,
  isSaving,
  handleCancelEdit,
  handleSave,
  handleEditClick,
  onForgotPassword
}) {
  const { t } = useTranslation(); // <-- HOOK
  const isEditing = editingField === field;

  // 2. HELPER UNTUK MENENTUKAN LIMIT BERDASARKAN FIELD
  const getMaxLength = () => {
    if (field === 'displayName') return VALIDATION.USER.MAX_USERNAME;
    if (field === 'email') return VALIDATION.USER.MAX_EMAIL;
    if (field === 'publicKey') return VALIDATION.USER.MAX_PUBLIC_KEY;
    if (field === 'password') return VALIDATION.USER.MAX_PASSWORD;
    return undefined;
  };

  const renderActionButtons = () => (
    <>
      {isEditing ? (
        <>
          <button 
            onClick={handleCancelEdit} 
            disabled={isSaving}
            className="h-8 px-2 sm:px-3 text-xs font-bold text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors cursor-pointer flex items-center justify-center disabled:opacity-50"
          >
            {t('dashboard.profile.btnCancel')}
          </button>
          <button 
            onClick={() => handleSave(field)} 
            disabled={isSaving}
            className="h-8 min-w-[3rem] px-2 sm:px-3 bg-[var(--foreground)] text-[var(--background)] text-xs font-bold rounded-md sm:rounded-lg hover:opacity-90 transition-opacity cursor-pointer shadow-md flex items-center justify-center disabled:opacity-70"
          >
            {isSaving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : t('dashboard.profile.btnSave')}
          </button>
        </>
      ) : (
        <button onClick={() => handleEditClick(field, isPassword ? '' : value)} className="h-8 w-8 sm:w-auto sm:px-3 bg-[var(--background)] border border-zinc-200 dark:border-zinc-700 hover:bg-[var(--secondary)] text-[var(--foreground)] text-xs font-bold rounded-md sm:rounded-lg transition-colors cursor-pointer shadow-sm flex items-center justify-center">
          <Edit2 className="w-3.5 h-3.5" />
          <span className="hidden sm:inline sm:ml-1.5">{t('dashboard.profile.btnChange')}</span>
        </button>
      )}
    </>
  );

  return (
    <div className="py-4 flex flex-col sm:flex-row sm:items-center justify-between transition-all">
      
      <div className="flex items-center gap-2 sm:hidden mb-1.5">
        <div className="p-1.5 bg-[var(--secondary)] rounded-md text-[var(--muted-foreground)] flex-shrink-0">
          <Icon className="w-3.5 h-3.5" />
        </div>
        <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--muted-foreground)]">
          {label}
        </p>
      </div>

      <div className="flex items-center justify-between w-full sm:w-auto gap-3">
        <div className="hidden sm:block p-2 bg-[var(--secondary)] rounded-lg text-[var(--muted-foreground)] flex-shrink-0">
          <Icon className="w-4 h-4" />
        </div>

        <div className="min-w-0 flex-1 sm:flex-none">
          <p className="hidden sm:block text-[10px] font-bold uppercase tracking-wider text-[var(--muted-foreground)] mb-0.5">
            {label}
          </p>
          
          {isEditing ? (
            <div className="flex flex-col w-full">
              {isPassword ? (
                <div className="flex flex-col gap-2 py-1">
                  <div>
                    <input 
                      type="password"
                      autoFocus
                      disabled={isSaving}
                      value={editValue.oldPassword || ''}
                      onChange={(e) => setEditValue({ ...editValue, oldPassword: e.target.value })}
                      placeholder={t('dashboard.profile.placeOldPass')}
                      maxLength={VALIDATION.USER.MAX_PASSWORD} // <-- 3. LIMIT PASSWORD LAMA
                      className="h-7 bg-transparent border-b border-[var(--primary)] outline-none text-sm font-medium text-[var(--foreground)] w-full disabled:opacity-50"
                    />
                    {errors.oldPassword && (
                      <p className="text-[10px] text-[var(--destructive)] mt-1 font-bold">{errors.oldPassword}</p>
                    )}
                  </div>
                  <div>
                    <input 
                      type="password"
                      disabled={isSaving}
                      value={editValue.newPassword || ''}
                      onChange={(e) => setEditValue({ ...editValue, newPassword: e.target.value })}
                      placeholder={t('dashboard.profile.placeNewPass')}
                      maxLength={VALIDATION.USER.MAX_PASSWORD} // <-- 3. LIMIT PASSWORD BARU
                      className="h-7 bg-transparent border-b border-[var(--primary)] outline-none text-sm font-medium text-[var(--foreground)] w-full disabled:opacity-50"
                    />
                    {errors.newPassword && (
                      <p className="text-[10px] text-[var(--destructive)] mt-1 font-bold">{errors.newPassword}</p>
                    )}
                    {errors[field] && !errors.oldPassword && !errors.newPassword && (
                      <p className="text-[10px] text-[var(--destructive)] mt-1 font-bold">{errors[field]}</p>
                    )}
                  </div>
                </div>
              ) : (
                <div className="flex items-center min-h-[32px] w-full">
                  <input 
                    type="text"
                    autoFocus
                    disabled={isSaving}
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    placeholder={t('dashboard.profile.placeNew', { label: label.toLowerCase() })}
                    maxLength={getMaxLength()} // <-- 3. LIMIT DINAMIS (Username/Email/Key)
                    className="h-7 bg-transparent border-b border-[var(--primary)] outline-none text-sm font-medium text-[var(--foreground)] w-full disabled:opacity-50" 
                  />
                </div>
              )}
              
              {errors[field] && !isPassword && (
                <p className="text-[10px] text-[var(--destructive)] mt-1 font-bold">{errors[field]}</p>
              )}
              
              {successMsg && successMsg[field] && (
                <p className="text-[10px] text-green-500 mt-1 font-bold">{successMsg[field]}</p>
              )}

              {field === 'password' && errors && Object.keys(errors).length > 0 && (
                <button 
                  onClick={onForgotPassword} 
                  className="text-[10px] text-[var(--primary)] hover:underline mt-1 font-bold text-left cursor-pointer w-fit transition-colors"
                >
                  {t('dashboard.profile.forgotPass')}
                </button>
              )}
            </div>
          ) : (
            <div className="flex items-center min-h-[32px]">
              <p className="font-semibold text-sm text-[var(--foreground)] truncate max-w-[180px] sm:max-w-[250px]">
                {isPassword ? '••••••••' : (value || <span className="italic opacity-50">{t('dashboard.profile.notSet')}</span>)}
              </p>
            </div>
          )}
        </div>

        <div className="flex items-center gap-1.5 sm:hidden flex-shrink-0">
          {renderActionButtons()}
        </div>
      </div>

      <div className="hidden sm:flex items-center gap-2 flex-shrink-0">
        {renderActionButtons()}
      </div>
    </div>
  );
}