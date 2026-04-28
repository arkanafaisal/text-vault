// src/hooks/usePublicPage.js
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import api from '../utils/api';
import { toast } from '../utils/toast';
import { VALIDATION, SYSTEM_MESSAGES } from '../utils/constants';

export function usePublicPage() {
  const { t } = useTranslation();

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
  const [page, setPage] = useState(1); // <-- STATE HALAMAN
  const [hasNextPage, setHasNextPage] = useState(false); // <-- STATE TOMBOL NEXT

  useEffect(() => {
    if (formData.username && formData.publicKey && !hasSearched) {
      handleSearch();
    } else if (!formData.username || !formData.publicKey) {
      toast.info(t('public.messages.infoMode'));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Handler untuk navigasi halaman
  const handleNextPage = () => {
    const nextP = page + 1;
    setPage(nextP);
    handleSearch(null, nextP);
  };

  const handlePrevPage = () => {
    if (page <= 1) return;
    const prevP = page - 1;
    setPage(prevP);
    handleSearch(null, prevP);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCopy = async (content) => {
    if (!content) return;
    try {
      await navigator.clipboard.writeText(content);
      toast.success(t('public.messages.copySuccess'));
    } catch (err) {
      toast.error(t('public.messages.copyError'));
    }
  };

  const handleSearch = async (e, targetPage = 1) => {
    if (e) {
      e.preventDefault();
      setPage(1); // Reset ke hal 1 jika klik tombol search manual
    }
    
    const cleanUsername = formData.username.trim();
    const cleanPublicKey = formData.publicKey.trim();

    if (!cleanUsername || !cleanPublicKey) {
      toast.error(t('public.messages.errRequired'));
      return;
    }

    if (cleanUsername.length > VALIDATION.USER.MAX_USERNAME) {
      toast.error(t('public.messages.errMaxUser', { max: VALIDATION.USER.MAX_USERNAME })); // <-- i18n
      return;
    }

    if (cleanPublicKey.length > VALIDATION.USER.MAX_PUBLIC_KEY) {
      toast.error(t('public.messages.errMaxKey', { max: VALIDATION.USER.MAX_PUBLIC_KEY }));
      return;
    }

    setIsLoading(true);
    setHasSearched(true);

    try {
      const result = await api.public.getData({
        username: cleanUsername,
        publicKey: cleanPublicKey,
        page: targetPage // Gunakan targetPage yang dikirim
      });

      if (result.success) {
        // Logika: jika 11 data, tampilkan 10, munculkan tombol next
        const hasNext = result.data.length > VALIDATION.RECORD.PUBLIC_PAGE_SIZE;
        const displayData = hasNext ? result.data.slice(0, VALIDATION.RECORD.PUBLIC_PAGE_SIZE) : result.data;
        
        setData(displayData);
        setHasNextPage(hasNext);
        
        const newPath = `/public/${encodeURIComponent(cleanUsername)}/${encodeURIComponent(cleanPublicKey)}`;
        window.history.replaceState({}, '', newPath);
      } else {
        toast.error(result.message); 
        setData([]);
      }
    } catch (error) {
      toast.error(SYSTEM_MESSAGES.NETWORK_ERROR);
    } finally {
      setIsLoading(false);
    }
  };

  return { 
    formData, data, isLoading, hasSearched, page, hasNextPage,
    handleInputChange, handleSearch, handleCopy, handleNextPage, handlePrevPage 
  };
}