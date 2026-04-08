// src/hooks/useDashboard.js
import { useState, useEffect, useRef } from 'react';
import api from '../utils/api';
import { navigate } from '../utils/navigation';
import { toast } from '../utils/toast';

export function useDashboard() {
  const [user, setUser] = useState(null);
  const [data, setData] = useState([]);
  
  // STATE LOADING DIBAGI DUA:
  const [isLoading, setIsLoading] = useState(true); 
  const [isFetchingData, setIsFetchingData] = useState(true); 

  const [selectedItem, setSelectedItem] = useState(null); 
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const [searchInput, setSearchInput] = useState('');
  const [queryParams, setQueryParams] = useState({ search: '', isLocked: '', sort: '' });
  const [isRefreshing, setIsRefreshing] = useState(false); 
  const [typingProgress, setTypingProgress] = useState(false);
  const isFirstRender = useRef(true);

  // 1. FETCH BERURUTAN (User Dulu -> Buka Layar -> Data Kemudian)
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
            setData(dataResult.data);
          } else {
            toast.error(dataResult.message);
          }
          setIsFetchingData(false);

        } else {
          toast.error(userResult.message);
          navigate('/');
          return;
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

  // 2. DEBOUNCE & PROGRESS BAR LOGIC
  useEffect(() => {
    if (searchInput === queryParams.search) {
      setTypingProgress(false);
      return;
    }

    setTypingProgress(false);
    const animationTimer = setTimeout(() => {
      setTypingProgress(true);
    }, 50);

    const timer = setTimeout(() => {
      setQueryParams(prev => {
        if (prev.search === searchInput) return prev;
        return { ...prev, search: searchInput };
      });
    }, 2000); 

    return () => {
      clearTimeout(animationTimer);
      clearTimeout(timer);
    };
  }, [searchInput, queryParams.search]);

  // 3. FETCH ULANG SAAT QUERY BERUBAH (Search/Filter)
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
            setData(result.data);
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

  const handleForceRefresh = async () => {
    setIsRefreshing(true);
    try {
      const result = await api.data.getAll(queryParams);
      if (result.success) {
        setData(result.data);
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
    try {
      await api.auth.logout();
    } catch (error) {}
    localStorage.removeItem('accessToken');
    navigate('/');
  };

  const handleItemClick = (item) => { setSelectedItem(item); };
  const handleCloseModal = () => { setSelectedItem(null); };
  const handleOpenAddModal = () => { setIsAddModalOpen(true); };
  const handleCloseAddModal = () => { setIsAddModalOpen(false); };
  
  const handleDataAdded = (newData) => {
    setData((prevData) => [newData, ...prevData]);
  };

  const handleDataUpdated = (updatedData) => {
    setData((prevData) =>
      prevData.map((item) => (item.id === updatedData.id ? updatedData : item))
    );
    setSelectedItem((prev) => {
      if (prev && prev.id === updatedData.id) return updatedData;
      return prev;
    });
  };

  const handleDataDeleted = (deletedId) => {
    setData((prevData) => prevData.filter((item) => item.id !== deletedId));
    setSelectedItem(null);
  };

  return {
    user, data, isLoading, isFetchingData, selectedItem, isAddModalOpen,
    searchInput, setSearchInput, queryParams, setQueryParams,
    isRefreshing, typingProgress, handleForceRefresh, handleLogout,
    handleItemClick, handleCloseModal, handleOpenAddModal, handleCloseAddModal,
    handleDataAdded, handleDataUpdated, handleDataDeleted
  };
}