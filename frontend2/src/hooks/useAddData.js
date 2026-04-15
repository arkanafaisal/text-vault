// src/hooks/useAddData.js
import { useState } from 'react';
import api from '../utils/api';
import { toast } from '../utils/toast';
import { SYSTEM_MESSAGES, VALIDATION } from '../utils/constants'; // <-- Import Konstanta

export function useAddData({ onClose, onDataAdded }) {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    tags: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState('');

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
    if (apiError) setApiError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError('');

    const trimmedTitle = formData.title.trim();
    const tagsArray = formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag);

    // --- VALIDASI LOGIC ---
    
    // 1. Validasi Title & Content
    if (!trimmedTitle || trimmedTitle.length > VALIDATION.RECORD.MAX_TITLE) {
      setApiError(`Title is required (max ${VALIDATION.RECORD.MAX_TITLE} chars).`);
      return;
    }
    if (!formData.content.trim() || formData.content.length > VALIDATION.RECORD.MAX_CONTENT) {
      setApiError(`Content is required (max ${VALIDATION.RECORD.MAX_CONTENT} chars).`);
      return;
    }

    // 2. Validasi Jumlah Tag
    if (tagsArray.length > VALIDATION.RECORD.MAX_TAGS_COUNT) {
      setApiError(`Maximum ${VALIDATION.RECORD.MAX_TAGS_COUNT} tags allowed.`);
      return;
    }

    // 3. Validasi Panjang Tiap Tag
    const longTag = tagsArray.find(tag => tag.length > VALIDATION.RECORD.MAX_TAG_LENGTH);
    if (longTag) {
      setApiError(`Each tag must be max ${VALIDATION.RECORD.MAX_TAG_LENGTH} characters.`);
      return;
    }

    setIsSubmitting(true);
    
    const payload = { 
      title: trimmedTitle, 
      content: formData.content
    };

    if (tagsArray.length > 0) {
      payload.tags = tagsArray;
    }

    try {
      const result = await api.data.create(payload);
      if (result && result.success) {
        toast.success(result.message); 
        if (onDataAdded && result.data) {
          onDataAdded(result.data, result.message);
        }
        onClose();
      } else {
        setApiError(result.message || 'Failed to add data.');
      }
    } catch (error) {
      setApiError(SYSTEM_MESSAGES.NETWORK_ERROR);
    } finally {
      setIsSubmitting(false);
    }
  };

  return { formData, isSubmitting, apiError, handleInputChange, handleSubmit };
}