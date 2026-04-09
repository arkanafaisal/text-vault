// src/hooks/usePublicPage.js
import { useState, useEffect } from 'react';
import api from '../utils/api';
import { toast } from '../utils/toast';

export function usePublicPage() {
  const [formData, setFormData] = useState(() => {
    const parts = typeof window !== 'undefined' ? window.location.pathname.split('/') : [];
    return {
      username: parts[2] ? decodeURIComponent(parts[2]) : '',
      publicKey: parts[3] ? decodeURIComponent(parts[3]) : ''
    };
  });
  
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  useEffect(() => {
    if (formData.username && formData.publicKey && !hasSearched) {
      handleSearch();
    } else if (!formData.username || !formData.publicKey) {
      toast.info("Public Access Mode. Enter credentials to unlock shared records.");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSearch = async (e) => {
    if (e) e.preventDefault();
    
    if (!formData.username.trim() || !formData.publicKey.trim()) {
      toast.error('Both Username and Public Key are required.');
      return;
    }

    setIsLoading(true);
    setHasSearched(true);
    setData([]);

    try {
      const result = await api.public.getData({
        username: formData.username.trim(),
        publicKey: formData.publicKey.trim()
      });

      if (result.success) {
        setData(result.data);
        toast.success(result.message);
        
        const newPath = `/public/${encodeURIComponent(formData.username.trim())}/${encodeURIComponent(formData.publicKey.trim())}`;
        window.history.replaceState({}, '', newPath);
      } else {
        toast.error(result.message); 
      }
    } catch (error) {
      toast.error('Network error occurred while fetching public data.');
    } finally {
      setIsLoading(false);
    }
  };

  const formatDecoratedDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return `${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}, ${date.toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}`;
  };

  return {
    formData,
    data,
    isLoading,
    hasSearched,
    selectedItem,
    setSelectedItem,
    handleInputChange,
    handleSearch,
    formatDecoratedDate
  };
}