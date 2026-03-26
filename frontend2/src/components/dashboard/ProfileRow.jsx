// src/components/dashboard/ProfileRow.jsx
import React from 'react';
import { Edit2, Loader2 } from 'lucide-react';

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
  const isEditing = editingField === field;

  const renderActionButtons = () => (
    <>
      {isEditing ? (
        <>
          {/* Tombol Cancel & Save dikunci persis h-8 (32px) agar sejajar dengan Change */}
          <button 
            onClick={handleCancelEdit} 
            disabled={isSaving}
            className="h-8 px-2 sm:px-3 text-xs font-bold text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors cursor-pointer flex items-center justify-center disabled:opacity-50"
          >
            Cancel
          </button>
          <button 
            onClick={() => handleSave(field)} 
            disabled={isSaving}
            className="h-8 min-w-[3rem] px-2 sm:px-3 bg-[var(--foreground)] text-[var(--background)] text-xs font-bold rounded-md sm:rounded-lg hover:opacity-90 transition-opacity cursor-pointer shadow-md flex items-center justify-center disabled:opacity-70"
          >
            {isSaving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : 'Save'}
          </button>
        </>
      ) : (
        <button onClick={() => handleEditClick(field, isPassword ? '' : value)} className="h-8 w-8 sm:w-auto sm:px-3 bg-[var(--background)] border border-zinc-200 dark:border-zinc-700 hover:bg-[var(--secondary)] text-[var(--foreground)] text-xs font-bold rounded-md sm:rounded-lg transition-colors cursor-pointer shadow-sm flex items-center justify-center">
          <Edit2 className="w-3.5 h-3.5" />
          <span className="hidden sm:inline sm:ml-1.5">Change</span>
        </button>
      )}
    </>
  );

  return (
    <div className="py-4 flex flex-col sm:flex-row sm:items-center justify-between transition-all">
      
      {/* Label Mobile */}
      <div className="flex items-center gap-2 sm:hidden mb-1.5">
        <div className="p-1.5 bg-[var(--secondary)] rounded-md text-[var(--muted-foreground)] flex-shrink-0">
          <Icon className="w-3.5 h-3.5" />
        </div>
        <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--muted-foreground)]">
          {label}
        </p>
      </div>

      <div className="flex items-center justify-between w-full sm:w-auto gap-3">
        {/* Ikon Desktop */}
        <div className="hidden sm:block p-2 bg-[var(--secondary)] rounded-lg text-[var(--muted-foreground)] flex-shrink-0">
          <Icon className="w-4 h-4" />
        </div>

        <div className="min-w-0 flex-1 sm:flex-none">
          {/* Label Desktop */}
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
                      placeholder="Current password"
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
                      placeholder="New password"
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
                /* Kontainer Edit Non-Password: min-h-[32px] agar sama dengan mode baca */
                <div className="flex items-center min-h-[32px] w-full">
                  <input 
                    type="text"
                    autoFocus
                    disabled={isSaving}
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    placeholder={`Enter new ${label.toLowerCase()}`}
                    className="h-7 bg-transparent border-b border-[var(--primary)] outline-none text-sm font-medium text-[var(--foreground)] w-full disabled:opacity-50" 
                  />
                </div>
              )}
              
              {/* Notifikasi Error/Sukses ditempatkan di luar min-h-[32px] agar expand natural */}
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
                  Forgot password?
                </button>
              )}
            </div>
          ) : (
            /* Kontainer Baca Teks Biasa: min-h-[32px] agar sama persis dengan mode edit */
            <div className="flex items-center min-h-[32px]">
              <p className="font-semibold text-sm text-[var(--foreground)] truncate max-w-[180px] sm:max-w-[250px]">
                {isPassword ? '••••••••' : (value || <span className="italic opacity-50">Not set</span>)}
              </p>
            </div>
          )}
        </div>

        {/* Tombol Aksi Mobile - BERSIH dari mt-2 dan items-start */}
        <div className="flex items-center gap-1.5 sm:hidden flex-shrink-0">
          {renderActionButtons()}
        </div>
      </div>

      {/* Tombol Aksi Desktop */}
      <div className="hidden sm:flex items-center gap-2 flex-shrink-0">
        {renderActionButtons()}
      </div>
    </div>
  );
}