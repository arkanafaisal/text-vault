// src/hooks/useAddData.js
import { useState } from 'react';
import api from '../utils/api';
import { toast } from '../utils/toast';

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
    if (apiError) {
      setApiError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError('');
    setIsSubmitting(true);
    
    const tagsArray = formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag);
    const payload = { 
      title: formData.title.trim(), 
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
      console.log(error);
      setApiError('A network error occurred. Please check your connection.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    formData,
    isSubmitting,
    apiError,
    handleInputChange,
    handleSubmit
  };
}