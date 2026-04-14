// src/hooks/useDashboard.js
import { useState, useEffect, useRef } from 'react';
import api from '../utils/api';
import { navigate } from '../utils/navigation';
import { toast } from '../utils/toast';

export function useDashboard() {
  const [user, setUser] = useState(null);
  const [data, setData] = useState([]);
  
  const [isLoading, setIsLoading] = useState(true); 
  const [isFetchingData, setIsFetchingData] = useState(true); 

  const [selectedItem, setSelectedItem] = useState(null); 
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const [searchInput, setSearchInput] = useState('');
  
  // 1. TAMBAHKAN PAGE DI SINI
  const [queryParams, setQueryParams] = useState({ 
    search: '', 
    visibility: '', // Ganti isLocked menjadi visibility
    sort: '', 
    page: 1 
  });
  const [hasNextPage, setHasNextPage] = useState(false); // Penanda tombol Next

  const [isRefreshing, setIsRefreshing] = useState(false); 
  const [typingProgress, setTypingProgress] = useState(false);
  const isFirstRender = useRef(true);

  // Fungsi internal untuk memproses dan memotong data dari backend (30 dari 51)
  const processPaginationData = (rawData) => {
    if (!rawData) return;
    if (rawData.length > 30) {
      setHasNextPage(true);
      setData(rawData.slice(0, 30)); // Ambil 30 saja, timpa data lama
    } else {
      setHasNextPage(false);
      setData(rawData); // Timpa data lama
    }
  };

  useEffect(() => {
    let isMounted = true;

    const fetchDashboardData = async () => {
      setIsLoading(true);
      try {
        const userResult = await api.users.getMe();
        if (!isMounted) return;

        if (userResult.success && userResult.data) {
          setUser(userResult.data);
          toast.success(userResult.message); 
          setIsLoading(false); 
          
          setIsFetchingData(true);
          const dataResult = await api.data.getAll(queryParams);
          if (!isMounted) return;

          if (dataResult.success) {
            processPaginationData(dataResult.data);
          } else {
            toast.error(dataResult.message);
          }
          setIsFetchingData(false);

        } else {
          toast.error(userResult.message);
          navigate('/');
        }
      } catch (error) {
        if (isMounted) {
          toast.error('Failed to connect to the server.');
          setIsLoading(false);
          setIsFetchingData(false);
        }
      }
    };

    fetchDashboardData();
    return () => { isMounted = false; };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); 

  useEffect(() => {
    if (searchInput === queryParams.search) {
      setTypingProgress(false);
      return;
    }

    setTypingProgress(false);
    const animationTimer = setTimeout(() => { setTypingProgress(true); }, 50);

    const timer = setTimeout(() => {
      setQueryParams(prev => {
        if (prev.search === searchInput) return prev;
        // 2. JIKA USER MENGETIK PENCARIAN, KEMBALIKAN KE PAGE 1
        return { ...prev, search: searchInput, page: 1 }; 
      });
    }, 2000); 

    return () => {
      clearTimeout(animationTimer);
      clearTimeout(timer);
    };
  }, [searchInput, queryParams.search]);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return; 
    }

    let isMounted = true;
    const fetchFilteredData = async () => {
      setIsRefreshing(true);
      try {
        const result = await api.data.getAll(queryParams);
        if (isMounted) {
          if (result.success) {
            processPaginationData(result.data);
          } else {
            toast.error(result.message);
          }
        }
      } catch (error) {
        if (isMounted) toast.error('Failed to fetch filtered data.');
      } finally {
        if (isMounted) {
          setIsRefreshing(false);
          setTypingProgress(false); 
        }
      }
    };

    fetchFilteredData();
    return () => { isMounted = false; };
  }, [queryParams]);

  // 3. FUNGSI KONTROL PAGINASI
  const handleNextPage = () => {
    setQueryParams(prev => ({ ...prev, page: prev.page + 1 }));
    window.scrollTo({ top: 0, behavior: 'smooth' }); // UX mulus kembali ke atas
  };

  const handlePrevPage = () => {
    setQueryParams(prev => ({ ...prev, page: Math.max(1, prev.page - 1) }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleForceRefresh = async () => {
    setIsRefreshing(true);
    try {
      const result = await api.data.getAll(queryParams);
      if (result.success) {
        processPaginationData(result.data);
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error('Failed to sync vault data.');
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleLogout = async () => {
    try { await api.auth.logout(); } catch (error) {}
    localStorage.removeItem('accessToken');
    navigate('/');
  };

  const handleItemClick = (item) => { setSelectedItem(item); };
  const handleCloseModal = () => { setSelectedItem(null); };
  const handleOpenAddModal = () => { setIsAddModalOpen(true); };
  const handleCloseAddModal = () => { setIsAddModalOpen(false); };
  
  const handleDataAdded = (newData) => { setData((prev) => [newData, ...prev]); };
  const handleDataUpdated = (updatedData) => {
    setData((prevData) => prevData.map((item) => (item.id === updatedData.id ? updatedData : item)));
    setSelectedItem((prev) => {
      if (prev && prev.id === updatedData.id) return updatedData;
      return prev;
    });
  };
  const handleDataDeleted = (deletedId) => {
    setData((prev) => prev.filter((item) => item.id !== deletedId));
    setSelectedItem(null);
  };

  return {
    user, data, isLoading, isFetchingData, selectedItem, isAddModalOpen,
    searchInput, setSearchInput, queryParams, setQueryParams,
    isRefreshing, typingProgress, hasNextPage, // <-- Export state baru
    handleForceRefresh, handleLogout,
    handleItemClick, handleCloseModal, handleOpenAddModal, handleCloseAddModal,
    handleDataAdded, handleDataUpdated, handleDataDeleted,
    handleNextPage, handlePrevPage // <-- Export fungsi baru
  };
}