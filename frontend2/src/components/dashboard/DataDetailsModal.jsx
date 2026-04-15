// src/components/dashboard/DataDetailsModal.jsx
import React from 'react';
import { X, Tag, Lock, Unlock, Loader2, Save, Edit2, History, ShieldAlert, AlertCircle, Trash2, Copy } from 'lucide-react';
import { useDataDetails } from '../../hooks/useDataDetails';
import { VALIDATION } from '../../utils/constants'; // <-- 1. IMPORT KONSTANTA

export default function DataDetailsModal({ item, onClose, onDataUpdated, onDataDeleted, onForceRefresh }) {
  
  const {
    detailedItem, isLoadingData, isEditingCommon, isEditingStatus,
    isDeletingRecord, showDeleteConfirm, formData, isSavingCommon, isSavingStatus,
    setIsEditingCommon, setIsEditingStatus, setShowDeleteConfirm,
    handleInputChange, handleCancelCommon, handleCancelStatus, handleDeleteRecord,
    handleSaveCommon, handleSaveStatus, formatDecoratedDate,
    handleCopy 
  } = useDataDetails({ item, onClose, onDataUpdated, onDataDeleted, onForceRefresh });

  if (!item) return null;

  const typography = {
    titleView: "font-black text-xl md:text-2xl text-[var(--foreground)] tracking-tight px-1 py-1",
    titleEdit: "font-black text-xl md:text-2xl text-[var(--foreground)] tracking-tight w-full bg-[var(--background)] rounded-lg px-2 md:px-3 py-1.5 outline-none ring-1 ring-[var(--border-strong)] focus:ring-2 focus:ring-[var(--primary)]",
    contentView: "text-sm md:text-base leading-relaxed text-[var(--muted-foreground)] whitespace-pre-wrap p-1",
    contentEdit: "text-sm md:text-base leading-relaxed text-[var(--foreground)] whitespace-pre-wrap w-full h-full min-h-[160px] md:min-h-[180px] lg:min-h-[200px] bg-[var(--background)] rounded-xl p-3 md:p-4 outline-none ring-1 ring-[var(--border-strong)] focus:ring-2 focus:ring-[var(--primary)] resize-none custom-scrollbar transition-all",
    metaView: "text-xs md:text-sm font-semibold text-[var(--foreground)] px-1 py-1",
    metaEdit: "text-xs md:text-sm font-semibold text-[var(--foreground)] w-full bg-[var(--background)] rounded-md px-2 md:px-3 py-1.5 outline-none ring-1 ring-[var(--border-strong)] focus:ring-2 focus:ring-[var(--primary)]",
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-4 md:p-6 lg:p-8 animate-in fade-in duration-300">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={(isLoadingData || isSavingCommon || isSavingStatus) ? null : onClose} />
      
      <div className="bg-[var(--background)] w-full h-full sm:h-auto sm:max-w-4xl sm:max-h-[90vh] rounded-none sm:rounded-[2rem] border-0 sm:border border-[var(--border-strong)] shadow-2xl relative z-10 flex flex-col overflow-hidden animate-in zoom-in-95 sm:slide-in-from-bottom-0 slide-in-from-bottom-full duration-300 ease-out">
        
        {/* HEADER */}
        <div className="flex items-center justify-between p-4 md:p-5 lg:p-6 border-b border-[var(--border)] bg-[var(--card)] flex-shrink-0">
          <div>
            <h2 className="text-lg md:text-xl font-bold tracking-tight text-[var(--foreground)]">Record Details</h2>
            {detailedItem && !isLoadingData && (
              <div className="flex items-center gap-1.5 text-[10px] md:text-xs text-[var(--muted-foreground)] opacity-70 mt-1">
                <History className="w-3 h-3 md:w-3.5 md:h-3.5 flex-shrink-0" />
                <span>Last updated: {formatDecoratedDate(detailedItem.updatedAt)}</span>
              </div>
            )}
          </div>
          <button onClick={onClose} disabled={isLoadingData || isSavingCommon || isSavingStatus} className="p-2 md:p-2.5 rounded-full hover:bg-[var(--secondary)] transition-colors text-[var(--muted-foreground)] cursor-pointer disabled:opacity-50 flex-shrink-0">
            <X className="w-5 h-5 md:w-6 h-6" />
          </button>
        </div>
        
        {/* BODY */}
        {isLoadingData ? (
          <div className="flex-1 flex flex-col items-center justify-center p-10 min-h-[40vh]">
            <Loader2 className="w-10 h-10 md:w-12 md:h-12 animate-spin text-[var(--primary)] mb-4" />
            <p className="text-xs md:text-sm font-bold tracking-widest uppercase text-[var(--muted-foreground)] animate-pulse">
              Decrypting Content...
            </p>
          </div>
        ) : detailedItem ? (
          <div className="flex-1 overflow-y-auto custom-scrollbar p-4 md:p-5 lg:p-6 space-y-4 md:space-y-6">
            
            {/* INFORMATION SECTION */}
            <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl md:rounded-[1.5rem] overflow-hidden shadow-sm">
              <div className="p-4 md:p-5 lg:p-6 space-y-4 md:space-y-5">
                <div className="min-h-[40px] md:min-h-[44px] flex items-center">
                  {isEditingCommon ? (
                    <input 
                      type="text" 
                      name="title" 
                      value={formData.title} 
                      onChange={handleInputChange} 
                      className={typography.titleEdit} 
                      placeholder="Record title..." 
                      autoFocus 
                      maxLength={VALIDATION.RECORD.MAX_TITLE} // <-- 2. TAMBAH MAXLENGTH
                    />
                  ) : (
                    <h3 className={typography.titleView}>{detailedItem.title}</h3>
                  )}
                </div>

                <div className="relative mt-2 md:mt-3">
                  <label className="absolute -top-2.5 md:-top-3 left-3 md:left-4 bg-[var(--card)] px-2 text-[10px] md:text-xs font-bold uppercase tracking-widest text-[var(--muted-foreground)] z-10">Data Content</label>
                  <div className="w-full h-[180px] md:h-[200px] lg:h-[220px] border border-[var(--border)] rounded-xl md:rounded-2xl overflow-hidden relative group">
                    {isEditingCommon ? (
                      <textarea 
                        name="content" 
                        value={formData.content} 
                        onChange={handleInputChange} 
                        className={typography.contentEdit} 
                        placeholder="Enter your confidential data..." 
                        maxLength={VALIDATION.RECORD.MAX_CONTENT} // <-- 2. TAMBAH MAXLENGTH
                      />
                    ) : (
                      <div className="w-full h-full overflow-y-auto custom-scrollbar p-3 md:p-4 bg-[var(--secondary)]/30 relative">
                        <p className={typography.contentView}>{detailedItem.content || <span className="italic opacity-50">Empty content</span>}</p>
                        
                        {detailedItem.content && (
                          <button 
                            onClick={() => handleCopy(detailedItem.content)}
                            className="absolute top-3 right-3 p-2 bg-[var(--background)] hover:bg-[var(--secondary)] border border-[var(--border)] text-[var(--muted-foreground)] hover:text-[var(--foreground)] rounded-lg transition-all cursor-pointer opacity-0 group-hover:opacity-100 shadow-sm"
                            title="Copy to Clipboard"
                          >
                            <Copy className="w-4 h-4 md:w-5 md:h-5" />
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-2 pt-2 md:pt-3">
                  <div className="flex items-center gap-2.5 text-[var(--muted-foreground)]">
                    <Tag className="w-3.5 h-3.5 md:w-4 md:h-4 flex-shrink-0" />
                    <label className="text-[10px] md:text-xs font-bold uppercase tracking-widest">Tags (Comma Separated)</label>
                  </div>
                  <div className="min-h-[32px] md:min-h-[36px] flex items-center">
                    {isEditingCommon ? (
                      <input 
                        type="text" 
                        name="tags" 
                        value={formData.tags} 
                        onChange={handleInputChange} 
                        className={typography.metaEdit} 
                        placeholder={`e.g. work, private (max ${VALIDATION.RECORD.MAX_TAGS_COUNT} tags)`} // <-- 3. UPDATE PLACEHOLDER
                      />
                    ) : (
                      <div className={`${typography.metaView} flex flex-wrap gap-1.5 md:gap-2`}>
                        {detailedItem.tags && detailedItem.tags.length > 0 ? detailedItem.tags.map((tag, idx) => (
                          <span key={idx} className="bg-[var(--secondary)] text-[var(--muted-foreground)] text-[10px] md:text-xs font-bold tracking-widest uppercase px-2 md:px-2.5 py-0.5 md:py-1 rounded-md md:rounded-lg border border-[var(--border)]">{tag}</span>
                        )) : <span className="italic opacity-50 text-xs md:text-sm">No tags</span>}
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="bg-[var(--secondary)]/50 border-t border-[var(--border)] p-3 md:p-4 flex justify-end gap-2 md:gap-3">
                {isEditingCommon ? (
                  <>
                    <button onClick={handleCancelCommon} disabled={isSavingCommon} className="px-3 md:px-4 py-2 text-xs md:text-sm font-bold text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors disabled:opacity-50 cursor-pointer">Cancel</button>
                    {/* 4. DISABLED JIKA KOSONG */}
                    <button 
                      onClick={handleSaveCommon} 
                      disabled={isSavingCommon || !formData.title.trim() || !formData.content.trim()} 
                      className="flex items-center gap-1.5 md:gap-2 px-4 md:px-5 py-2 bg-[var(--foreground)] text-[var(--background)] text-xs md:text-sm font-bold rounded-lg lg:rounded-xl hover:opacity-90 transition-opacity shadow-md disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
                    >
                      {isSavingCommon ? <Loader2 className="w-3.5 h-3.5 md:w-4 md:h-4 animate-spin" /> : <Save className="w-3.5 h-3.5 md:w-4 md:h-4" />}
                      <span>Save Information</span>
                    </button>
                  </>
                ) : (
                  <button onClick={() => setIsEditingCommon(true)} disabled={isSavingStatus || isEditingStatus} className="flex items-center gap-1.5 md:gap-2 px-4 md:px-5 py-2 bg-[var(--card)] border border-[var(--border-strong)] text-[var(--foreground)] text-xs md:text-sm font-bold rounded-lg lg:rounded-xl hover:bg-[var(--secondary)] transition-colors shadow-sm disabled:opacity-50 cursor-pointer">
                    <Edit2 className="w-3.5 h-3.5 md:w-4 md:h-4" />
                    <span>Edit Information</span>
                  </button>
                )}
              </div>
            </div>

            {/* SECURITY SECTION */}
            <div className="bg-[var(--card)] border border-[var(--destructive)]/30 rounded-2xl md:rounded-[1.5rem] overflow-hidden shadow-sm relative">
              <div className="absolute top-0 left-0 w-1 md:w-1.5 h-full bg-[var(--destructive)]/50"></div>
              <div className="p-4 md:p-5 lg:p-6">
                <div className="flex items-center gap-2 mb-4 md:mb-5 text-[var(--destructive)]">
                  <ShieldAlert className="w-4 h-4 md:w-5 md:h-5" />
                  <h3 className="text-sm md:text-base font-bold tracking-tight">Access & Security Control</h3>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 md:gap-4 p-3 md:p-4 rounded-xl md:rounded-2xl border border-[var(--border)] bg-[var(--background)]">
                  <div className="space-y-1 lg:space-y-1.5">
                    <div className="flex items-center gap-2">
                      {formData.visibility === 'private' ? <Lock className="w-3.5 h-3.5 md:w-4 md:h-4 text-[var(--muted-foreground)]" /> : <Unlock className="w-3.5 h-3.5 md:w-4 md:h-4 text-[var(--muted-foreground)]" />}
                      <label className="text-[10px] md:text-xs font-bold uppercase tracking-wider text-[var(--foreground)]">Visibility Status</label>
                    </div>
                    <p className="text-[10px] md:text-xs text-[var(--muted-foreground)] leading-relaxed max-w-sm lg:max-w-md">
                      {formData.visibility === 'private' 
                        ? "Strictly private. Only you can read this data when logged in." 
                        : "Publicly accessible via your Public Key. Anyone with the link can read this."}
                    </p>
                  </div>
                  <div className="min-w-[140px] md:min-w-[160px] mt-2 sm:mt-0">
                    {isEditingStatus ? (
                      <select name="visibility" value={formData.visibility} onChange={handleInputChange} className={typography.metaEdit}>
                        <option value="private">Private</option>
                        <option value="public">Public</option>
                      </select>
                    ) : (
                      <div className="px-3 py-2 md:px-4 md:py-2.5 bg-[var(--secondary)] rounded-lg md:rounded-xl text-xs md:text-sm font-bold text-center border border-[var(--border)] text-[var(--foreground)] shadow-sm">
                        {detailedItem.visibility === 'private' ? 'Private' : 'Public'}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="bg-[var(--destructive)]/5 border-t border-[var(--destructive)]/20 p-3 md:p-4 flex justify-end gap-2 md:gap-3">
                {isEditingStatus ? (
                  <>
                    <button onClick={handleCancelStatus} disabled={isSavingStatus} className="px-3 md:px-4 py-2 text-xs md:text-sm font-bold text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors disabled:opacity-50 cursor-pointer">Cancel</button>
                    <button onClick={handleSaveStatus} disabled={isSavingStatus} className="flex items-center gap-1.5 md:gap-2 px-4 md:px-5 py-2 bg-[var(--destructive)] text-white text-xs md:text-sm font-bold rounded-lg lg:rounded-xl hover:bg-[var(--destructive)]/90 transition-opacity shadow-md disabled:opacity-70 cursor-pointer">
                      {isSavingStatus ? <Loader2 className="w-3.5 h-3.5 md:w-4 md:h-4 animate-spin" /> : <ShieldAlert className="w-3.5 h-3.5 md:w-4 md:h-4" />}
                      <span>Save Security</span>
                    </button>
                  </>
                ) : (
                  <button onClick={() => setIsEditingStatus(true)} disabled={isSavingCommon || isEditingCommon} className="flex items-center gap-1.5 md:gap-2 px-4 md:px-5 py-2 bg-[var(--card)] border border-[var(--destructive)]/30 text-[var(--destructive)] text-xs md:text-sm font-bold rounded-lg lg:rounded-xl hover:bg-[var(--destructive)]/10 transition-colors shadow-sm disabled:opacity-50 cursor-pointer">
                    <Edit2 className="w-3.5 h-3.5 md:w-4 md:h-4" />
                    <span>Edit Security</span>
                  </button>
                )}
              </div>
            </div>

            {/* DANGER ZONE */}
            <div className="mt-4 md:mt-6 pt-4 md:pt-6 border-t border-[var(--border)]">
              <div className="bg-[var(--destructive)]/5 border border-[var(--destructive)]/20 rounded-2xl p-4 md:p-5">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <h3 className="text-sm md:text-base font-bold text-[var(--destructive)] flex items-center gap-2">
                      <AlertCircle className="w-4 h-4" />
                      Danger Zone
                    </h3>
                    <p className="text-[10px] md:text-xs text-[var(--muted-foreground)] mt-1">
                      Once you delete a record, there is no going back. Please be certain.
                    </p>
                  </div>

                  {!showDeleteConfirm ? (
                    <button 
                      onClick={() => setShowDeleteConfirm(true)}
                      disabled={isSavingCommon || isSavingStatus}
                      className="flex items-center justify-center gap-2 px-4 py-2 bg-transparent border border-[var(--destructive)]/30 text-[var(--destructive)] text-xs md:text-sm font-bold rounded-xl hover:bg-[var(--destructive)] hover:text-white transition-all cursor-pointer disabled:opacity-50"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      Delete Record
                    </button>
                  ) : (
                    <div className="flex items-center gap-2 animate-in slide-in-from-right-2">
                      <button 
                        onClick={() => setShowDeleteConfirm(false)}
                        className="px-3 py-2 text-xs font-bold text-[var(--muted-foreground)] hover:text-[var(--foreground)] cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button 
                        onClick={handleDeleteRecord}
                        disabled={isDeletingRecord}
                        className="flex items-center gap-2 px-4 py-2 bg-[var(--destructive)] text-white text-xs md:text-sm font-bold rounded-xl hover:opacity-90 shadow-md cursor-pointer disabled:opacity-70"
                      >
                        {isDeletingRecord ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                        Confirm Delete
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}