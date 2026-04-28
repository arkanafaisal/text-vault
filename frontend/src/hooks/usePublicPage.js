// src/hooks/usePublicPage.js
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next'; // <-- IMPORT
import api from '../utils/api';
import { toast } from '../utils/toast';
import { VALIDATION, SYSTEM_MESSAGES } from '../utils/constants';

export function usePublicPage() {
  const { t } = useTranslation(); // <-- HOOK

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

  useEffect(() => {
    if (formData.username && formData.publicKey && !hasSearched) {
      handleSearch();
    } else if (!formData.username || !formData.publicKey) {
      toast.info(t('public.messages.infoMode')); // <-- i18n
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCopy = async (content) => {
    if (!content) return;
    try {
      await navigator.clipboard.writeText(content);
      toast.success(t('public.messages.copySuccess')); // <-- i18n
    } catch (err) {
      toast.error(t('public.messages.copyError')); // <-- i18n
    }
  };

  const handleSearch = async (e) => {
    if (e) e.preventDefault();
    
    const cleanUsername = formData.username.trim();
    const cleanPublicKey = formData.publicKey.trim();

    if (!cleanUsername || !cleanPublicKey) {
      toast.error(t('public.messages.errRequired')); // <-- i18n
      return;
    }

    if (cleanUsername.length > VALIDATION.USER.MAX_USERNAME) {
      toast.error(t('public.messages.errMaxUser', { max: VALIDATION.USER.MAX_USERNAME })); // <-- i18n
      return;
    }

    if (cleanPublicKey.length > VALIDATION.USER.MAX_PUBLIC_KEY) {
      toast.error(t('public.messages.errMaxKey', { max: VALIDATION.USER.MAX_PUBLIC_KEY })); // <-- i18n
      return;
    }

    setIsLoading(true);
    setHasSearched(true);
    setData([]);

    try {
      const result = await api.public.getData({
        username: cleanUsername,
        publicKey: cleanPublicKey
      });

      if (result.success) {
        setData(result.data);
        toast.success(result.message);
        
        const newPath = `/public/${encodeURIComponent(cleanUsername)}/${encodeURIComponent(cleanPublicKey)}`;
        window.history.replaceState({}, '', newPath);
      } else {
        toast.error(result.message); 
      }
    } catch (error) {
      toast.error(SYSTEM_MESSAGES.NETWORK_ERROR);
    } finally {
      setIsLoading(false);
    }
  };

  return { 
    formData, 
    data, 
    isLoading, 
    hasSearched, 
    handleInputChange, 
    handleSearch, 
    handleCopy 
  };
}