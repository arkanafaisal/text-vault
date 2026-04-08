// src/hooks/useDataDetails.js
import { useState, useEffect } from 'react';
import api from '../utils/api';
import { toast } from '../utils/toast';

export function useDataDetails({ item, onClose, onDataUpdated, onDataDeleted, onForceRefresh }) {
  const [detailedItem, setDetailedItem] = useState(null);
  const [isLoadingData, setIsLoadingData] = useState(false);
  
  const [isEditingCommon, setIsEditingCommon] = useState(false);
  const [isEditingStatus, setIsEditingStatus] = useState(false);

  const [isDeletingRecord, setIsDeletingRecord] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '', content: '', tags: '', isLocked: false
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
              const isLockedBool = data.isLocked === 1 || data.isLocked === true || data.isLocked === 'true';
              data.isLocked = isLockedBool; 
              
              setDetailedItem(data);
              setFormData({
                title: data.title || '',
                content: data.content || '',
                tags: data.tags ? data.tags.join(', ') : '',
                isLocked: isLockedBool
              });

              if (onDataUpdated) onDataUpdated(data);
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
      isLocked: detailedItem.isLocked || false
    }));
    setIsEditingStatus(false);
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
    
    try {
      const result = await api.data.updateStatus(detailedItem.id, { isLocked: newIsLocked });

      if (result.httpCode === 404 || result.httpCode === 403) {
        toast.error(result.message);
        if (onForceRefresh) onForceRefresh();
        onClose();
        return;
      }

      if (result && result.success) {
        toast.success(result.message); 
        const updatedData = { ...detailedItem, isLocked: newIsLocked, updatedAt: new Date().toISOString() };
        
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

  return {
    detailedItem, isLoadingData, isEditingCommon, isEditingStatus,
    isDeletingRecord, showDeleteConfirm, formData, isSavingCommon, isSavingStatus,
    setIsEditingCommon, setIsEditingStatus, setShowDeleteConfirm,
    handleInputChange, handleCancelCommon, handleCancelStatus, handleDeleteRecord,
    handleSaveCommon, handleSaveStatus, formatDecoratedDate
  };
}