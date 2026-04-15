// src/hooks/useDataDetails.js
import { useState, useEffect } from 'react';
import api from '../utils/api';
import { toast } from '../utils/toast';
import { VALIDATION, SYSTEM_MESSAGES } from '../utils/constants'; // <-- 1. IMPORT KONSTANTA

export function useDataDetails({ item, onClose, onDataUpdated, onDataDeleted, onForceRefresh }) {
  const [detailedItem, setDetailedItem] = useState(null);
  const [isLoadingData, setIsLoadingData] = useState(false);
  
  const [isEditingCommon, setIsEditingCommon] = useState(false);
  const [isEditingStatus, setIsEditingStatus] = useState(false);

  const [isDeletingRecord, setIsDeletingRecord] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '', content: '', tags: '', visibility: 'private'
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
            if (result.httpCode === 404) {
              toast.error(result.message || 'Record not found.');
              if (onForceRefresh) onForceRefresh();
              onClose();
              return;
            }

            if (result.success && result.data) {
              const data = result.data;
              
              setDetailedItem(data);
              setFormData({
                title: data.title || '',
                content: data.content || '',
                tags: data.tags ? data.tags.join(', ') : '',
                visibility: data.visibility || 'private'
              });

              if (onDataUpdated) onDataUpdated(data);
            } else {
              toast.error(result.message || 'Failed to load record details.');
              onClose(); 
            }
          }
        } catch (error) {
          if (isMounted) {
            toast.error(SYSTEM_MESSAGES.NETWORK_ERROR); // <-- 2. GANTI PESAN ERROR
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
      return () => { isMounted = false; };
    } else {
      setDetailedItem(null);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [item?.id]);

  const formatDecoratedDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return `${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}, ${date.toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}`;
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
      visibility: detailedItem.visibility || 'private'
    }));
    setIsEditingStatus(false);
  };

  const handleCopy = async (content) => {
    if (!content) return;
    try {
      await navigator.clipboard.writeText(content);
      toast.success('Content copied to clipboard!');
    } catch (err) {
      toast.error('Failed to copy content.');
    }
  };

  const handleDeleteRecord = async () => {
    setIsDeletingRecord(true);
    try {
      const result = await api.data.delete(detailedItem.id);
      
      if (result.httpCode === 404) {
        toast.error(result.message || 'Record already deleted.');
        if (onForceRefresh) onForceRefresh();
        onClose();
        return;
      }

      if (result.success) {
        toast.success(result.message); 
        if (onDataDeleted) onDataDeleted(detailedItem.id);
        onClose();
      } else {
        toast.error(result.message || 'Failed to delete record.');
        setShowDeleteConfirm(false);
      }
    } catch (error) {
      toast.error(SYSTEM_MESSAGES.NETWORK_ERROR); // <-- 2. GANTI PESAN ERROR
      setShowDeleteConfirm(false);
    } finally {
      setIsDeletingRecord(false);
    }
  };

  const handleSaveCommon = async () => {
    setIsSavingCommon(true);
    const newTitle = formData.title.trim();
    const tagsArray = formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag !== '');

    // --- 3. TAMBAHKAN VALIDASI DI SINI SEBELUM CEK PERUBAHAN ---
    if (!newTitle || newTitle.length > VALIDATION.RECORD.MAX_TITLE) {
      toast.error(`Title is required (max ${VALIDATION.RECORD.MAX_TITLE} chars).`);
      setIsSavingCommon(false);
      return;
    }
    if (!formData.content.trim() || formData.content.length > VALIDATION.RECORD.MAX_CONTENT) {
      toast.error(`Content is required (max ${VALIDATION.RECORD.MAX_CONTENT} chars).`);
      setIsSavingCommon(false);
      return;
    }
    if (tagsArray.length > VALIDATION.RECORD.MAX_TAGS_COUNT) {
      toast.error(`Maximum ${VALIDATION.RECORD.MAX_TAGS_COUNT} tags allowed.`);
      setIsSavingCommon(false);
      return;
    }
    const longTag = tagsArray.find(tag => tag.length > VALIDATION.RECORD.MAX_TAG_LENGTH);
    if (longTag) {
      toast.error(`Each tag must be max ${VALIDATION.RECORD.MAX_TAG_LENGTH} characters.`);
      setIsSavingCommon(false);
      return;
    }
    // -------------------------------------------------------------

    const isTitleChanged = newTitle !== (detailedItem.title || '');
    const isContentChanged = formData.content !== (detailedItem.content || '');
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
      } else {
        toast.error(result.message || 'Failed to update general information.');
      }
    } catch (error) {
      toast.error(SYSTEM_MESSAGES.NETWORK_ERROR); // <-- 2. GANTI PESAN ERROR
    } finally {
      setIsSavingCommon(false);
    }
  };

  const handleSaveStatus = async () => {
    setIsSavingStatus(true);
    if (formData.visibility === detailedItem.visibility) {
      setIsEditingStatus(false);
      setIsSavingStatus(false);
      return;
    }
    
    try {
      const result = await api.data.updateStatus(detailedItem.id, { visibility: formData.visibility });

      if (result.httpCode === 404 || result.httpCode === 403) {
        toast.error(result.message);
        if (onForceRefresh) onForceRefresh();
        onClose();
        return;
      }

      if (result && result.success) {
        toast.success(result.message); 
        const updatedData = { ...detailedItem, visibility: formData.visibility, updatedAt: new Date().toISOString() };
        
        setDetailedItem(updatedData);
        if (onDataUpdated) onDataUpdated(updatedData);
        setIsEditingStatus(false);
      } else {
        toast.error(result.message || 'Failed to update access control.');
      }
    } catch (error) {
      toast.error(SYSTEM_MESSAGES.NETWORK_ERROR); // <-- 2. GANTI PESAN ERROR
    } finally {
      setIsSavingStatus(false);
    }
  };

  return {
    detailedItem, isLoadingData, isEditingCommon, isEditingStatus,
    isDeletingRecord, showDeleteConfirm, formData, isSavingCommon, isSavingStatus,
    setIsEditingCommon, setIsEditingStatus, setShowDeleteConfirm,
    handleInputChange, handleCancelCommon, handleCancelStatus, handleDeleteRecord,
    handleSaveCommon, handleSaveStatus, formatDecoratedDate,
    handleCopy 
  };
}