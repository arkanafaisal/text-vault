// src/components/dashboard/DataDetailsModal.jsx
import React, { useState, useEffect } from 'react';
import { X, Tag, Lock, Unlock, Loader2, Save, Edit2, History, ShieldAlert, AlertCircle, Trash2 } from 'lucide-react';
import api from '../../utils/api';
import { toast } from '../../utils/toast';

export default function DataDetailsModal({ item, onClose, onDataUpdated, onDataDeleted, onForceRefresh }) {
  const [detailedItem, setDetailedItem] = useState(null);
  const [isLoadingData, setIsLoadingData] = useState(false);
  
  const [isEditingCommon, setIsEditingCommon] = useState(false);
  const [isEditingStatus, setIsEditingStatus] = useState(false);

  const [isDeletingRecord, setIsDeletingRecord] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    tags: '',
    isLocked: false
  });

  const [isSavingCommon, setIsSavingCommon] = useState(false);
  const [isSavingStatus, setIsSavingStatus] = useState(false);

  useEffect(() => {
    if (item?.id) {
      let isMounted = true;
      const fetchDetails = async () => {
        setIsLoadingData(true);
        try {
          const result = await api.data.getById(item.id);
          
          if (isMounted) {
            // CEGAH 404
            if (result.httpCode === 404) {
              toast.error(result.message || 'Record not found.');
              if (onForceRefresh) onForceRefresh();
              onClose();
              return;
            }

            if (result.success && result.data) {
              const data = result.data;
              const isLockedBool = data.isLocked === 1 || data.isLocked === true || data.isLocked === 'true';
              data.isLocked = isLockedBool; 
              
              setDetailedItem(data);
              setFormData({
                title: data.title || '',
                content: data.content || '',
                tags: data.tags ? data.tags.join(', ') : '',
                isLocked: isLockedBool
              });
            } else {
              toast.error(result.message || 'Failed to load record details.');
              onClose(); 
            }
          }
        } catch (error) {
          if (isMounted) {
            toast.error('Network error while loading details.');
            onClose();
          }
        } finally {
          if (isMounted) {
            setIsLoadingData(false);
            setIsEditingCommon(false);
            setIsEditingStatus(false);
            setShowDeleteConfirm(false); 
          }
        }
      };
      
      fetchDetails();
      
      return () => {
        isMounted = false;
      };
    } else {
      setDetailedItem(null);
    }
  }, [item?.id, onClose]);

  if (!item) {
    return null;
  }

  const formatDecoratedDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const time = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const day = date.toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' });
    return `${time}, ${day}`;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCancelCommon = () => {
    setFormData(prev => ({
      ...prev,
      title: detailedItem.title || '',
      content: detailedItem.content || '',
      tags: detailedItem.tags ? detailedItem.tags.join(', ') : ''
    }));
    setIsEditingCommon(false);
  };

  const handleCancelStatus = () => {
    setFormData(prev => ({
      ...prev,
      isLocked: detailedItem.isLocked || false
    }));
    setIsEditingStatus(false);
  };

  const handleDeleteRecord = async () => {
    setIsDeletingRecord(true);
    try {
      const result = await api.data.delete(detailedItem.id);
      
      // CEGAH 404
      if (result.httpCode === 404) {
        toast.error(result.message || 'Record already deleted.');
        if (onForceRefresh) onForceRefresh();
        onClose();
        return;
      }

      if (result.success) {
        toast.success(result.message); 
        if (onDataDeleted) {
          onDataDeleted(detailedItem.id);
        }
        onClose();
      } else {
        toast.error(result.message || 'Failed to delete record.');
        setShowDeleteConfirm(false);
      }
    } catch (error) {
      toast.error('A network error occurred while deleting the record.');
      setShowDeleteConfirm(false);
    } finally {
      setIsDeletingRecord(false);
    }
  };

  const handleSaveCommon = async () => {
    setIsSavingCommon(true);
    
    const newTitle = formData.title.trim();
    const isTitleChanged = newTitle !== (detailedItem.title || '');
    const isContentChanged = formData.content !== (detailedItem.content || '');
    
    const tagsArray = formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag !== '');
    const oldTags = detailedItem.tags || [];
    const isTagsChanged = JSON.stringify(oldTags) !== JSON.stringify(tagsArray);

    if (!isTitleChanged && !isContentChanged && !isTagsChanged) {
      setIsEditingCommon(false);
      setIsSavingCommon(false);
      return;
    }

    const commonPayload = {};
    if (isTitleChanged) commonPayload.title = newTitle;
    if (isContentChanged) commonPayload.content = formData.content;
    if (isTagsChanged) commonPayload.tags = tagsArray.length > 0 ? tagsArray : null; 

    try {
      const result = await api.data.updateCommon(detailedItem.id, commonPayload);

      // CEGAH 404 DAN 403
      if (result.httpCode === 404 || result.httpCode === 403) {
        toast.error(result.message);
        if (onForceRefresh) onForceRefresh();
        onClose();
        return;
      }

      if (result && result.success) {
        toast.success(result.message); 
        
        const updatedData = { ...detailedItem };
        if (isTitleChanged) updatedData.title = newTitle;
        if (isContentChanged) updatedData.content = formData.content;
        if (isTagsChanged) updatedData.tags = tagsArray;
        updatedData.updatedAt = new Date().toISOString();
        
        setDetailedItem(updatedData);
        if (onDataUpdated) onDataUpdated(updatedData);
        
        setIsEditingCommon(false);
        onClose();
      } else {
        toast.error(result.message || 'Failed to update general information.');
      }
    } catch (error) {
      toast.error('A network error occurred while saving information.');
    } finally {
      setIsSavingCommon(false);
    }
  };

  const handleSaveStatus = async () => {
    setIsSavingStatus(true);
    
    const newIsLocked = formData.isLocked === 'true' || formData.isLocked === true || formData.isLocked === 1;
    const oldIsLocked = detailedItem.isLocked === 'true' || detailedItem.isLocked === true || detailedItem.isLocked === 1;

    if (newIsLocked === oldIsLocked) {
      setIsEditingStatus(false);
      setIsSavingStatus(false);
      return;
    }
    
    const statusPayload = { isLocked: newIsLocked };

    try {
      const result = await api.data.updateStatus(detailedItem.id, statusPayload);

      // CEGAH 404 DAN 403
      if (result.httpCode === 404 || result.httpCode === 403) {
        toast.error(result.message);
        if (onForceRefresh) onForceRefresh();
        onClose();
        return;
      }

      if (result && result.success) {
        toast.success(result.message); 
        
        const updatedData = { ...detailedItem, isLocked: newIsLocked };
        updatedData.updatedAt = new Date().toISOString(); 
        
        setDetailedItem(updatedData);
        if (onDataUpdated) onDataUpdated(updatedData);
        
        setIsEditingStatus(false);
        onClose(); 
      } else {
        toast.error(result.message || 'Failed to update access control.');
      }
    } catch (error) {
      toast.error('A network error occurred while updating access control.');
    } finally {
      setIsSavingStatus(false);
    }
  };

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
                    <input type="text" name="title" value={formData.title} onChange={handleInputChange} className={typography.titleEdit} placeholder="Record title..." autoFocus />
                  ) : (
                    <h3 className={typography.titleView}>{detailedItem.title}</h3>
                  )}
                </div>

                <div className="relative mt-2 md:mt-3">
                  <label className="absolute -top-2.5 md:-top-3 left-3 md:left-4 bg-[var(--card)] px-2 text-[10px] md:text-xs font-bold uppercase tracking-widest text-[var(--muted-foreground)] z-10">Data Content</label>
                  <div className="w-full h-[180px] md:h-[200px] lg:h-[220px] border border-[var(--border)] rounded-xl md:rounded-2xl overflow-hidden relative">
                    {isEditingCommon ? (
                      <textarea name="content" value={formData.content} onChange={handleInputChange} className={typography.contentEdit} placeholder="Enter your confidential data..." />
                    ) : (
                      <div className="w-full h-full overflow-y-auto custom-scrollbar p-3 md:p-4 bg-[var(--secondary)]/30">
                        <p className={typography.contentView}>{detailedItem.content || <span className="italic opacity-50">Empty content</span>}</p>
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
                      <input type="text" name="tags" value={formData.tags} onChange={handleInputChange} className={typography.metaEdit} placeholder="work, private, api" />
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
                    <button onClick={handleSaveCommon} disabled={isSavingCommon} className="flex items-center gap-1.5 md:gap-2 px-4 md:px-5 py-2 bg-[var(--foreground)] text-[var(--background)] text-xs md:text-sm font-bold rounded-lg lg:rounded-xl hover:opacity-90 transition-opacity shadow-md disabled:opacity-70 cursor-pointer">
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
                      {formData.isLocked === 'true' || formData.isLocked === true ? <Lock className="w-3.5 h-3.5 md:w-4 md:h-4 text-[var(--muted-foreground)]" /> : <Unlock className="w-3.5 h-3.5 md:w-4 md:h-4 text-[var(--muted-foreground)]" />}
                      <label className="text-[10px] md:text-xs font-bold uppercase tracking-wider text-[var(--foreground)]">Visibility Status</label>
                    </div>
                    <p className="text-[10px] md:text-xs text-[var(--muted-foreground)] leading-relaxed max-w-sm lg:max-w-md">
                      {formData.isLocked === 'true' || formData.isLocked === true 
                        ? "Strictly private. Only you can read this data when logged in." 
                        : "Publicly accessible via your Public Key. Anyone with the link can read this."}
                    </p>
                  </div>
                  <div className="min-w-[140px] md:min-w-[160px] mt-2 sm:mt-0">
                    {isEditingStatus ? (
                      <select name="isLocked" value={formData.isLocked} onChange={handleInputChange} className={typography.metaEdit}>
                        <option value={true}>Locked (Private)</option>
                        <option value={false}>Unlocked (Public)</option>
                      </select>
                    ) : (
                      <div className="px-3 py-2 md:px-4 md:py-2.5 bg-[var(--secondary)] rounded-lg md:rounded-xl text-xs md:text-sm font-bold text-center border border-[var(--border)] text-[var(--foreground)] shadow-sm">
                        {detailedItem.isLocked ? 'Locked (Private)' : 'Unlocked (Public)'}
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