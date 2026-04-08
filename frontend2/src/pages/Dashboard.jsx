// src/pages/Dashboard.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import api from '../utils/api';
import { navigate } from '../utils/navigation';
import { Loader2, Search, Plus, ChevronDown } from 'lucide-react'; 
import { toast } from '../utils/toast'; 

import Navbar from '../components/dashboard/Navbar';
import Bento from '../components/dashboard/Bento';
import AddDataModal from '../components/dashboard/AddDataModal';
import DataDetailsModal from '../components/dashboard/DataDetailsModal';

export default function Dashboard({ isDarkMode, toggleTheme }) {
  const { t } = useTranslation();
  const [user, setUser] = useState(null);
  const [data, setData] = useState([]);
  
  // STATE LOADING DIBAGI DUA:
  const [isLoading, setIsLoading] = useState(true); // Untuk Full Screen (User Auth)
  const [isFetchingData, setIsFetchingData] = useState(true); // Untuk Area Bento Grid

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
        // --- TAHAP 1: VALIDASI USER ---
        const userResult = await api.users.getMe();

        if (!isMounted) return;

        if (userResult.success && userResult.data) {
          setUser(userResult.data);
          toast.success(userResult.message); 
          
          // Matikan loading full screen SEKARANG! UI Dashboard langsung muncul.
          setIsLoading(false); 
          
          // --- TAHAP 2: AMBIL DATA (Background / Area Khusus) ---
          setIsFetchingData(true);
          const dataResult = await api.data.getAll(queryParams);

          if (!isMounted) return;

          if (dataResult.success) {
            setData(dataResult.data);
          } else {
            toast.error(dataResult.message);
          }
          // Matikan loading area khusus
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
  }, [searchInput]);

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

  // FULL SCREEN LOADING (Hanya untuk User Auth)
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--background)] text-[var(--foreground)]">
        <Loader2 className="w-8 h-8 animate-spin text-[var(--primary)]" />
      </div>
    );
  }

  if (!user) { return null; }

  return (
    <div className="min-h-screen flex flex-col bg-[var(--background)] text-[var(--foreground)]">
      <Navbar isDarkMode={isDarkMode} toggleTheme={toggleTheme} user={user} onLogout={handleLogout} onUpdateUser={() => {}} />

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 md:px-8 py-8 md:py-12 relative">
        
        <div className="mb-4 md:mb-6">
          <h1 className="text-3xl md:text-4xl font-black tracking-tight mb-1">
            Your Secured Vault
          </h1>
          <p className="text-[var(--muted-foreground)] text-xs sm:text-sm">
            Manage and organize your encrypted records safely.
          </p>
        </div>

        <div className="sticky top-[57px] md:top-[61px] z-30 bg-[var(--background)]/95 backdrop-blur-md py-3 -mx-4 px-4 md:-mx-8 md:px-8 border-b border-[var(--border-strong)] mb-6 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 transition-all">
          
          <div className="relative flex-1 sm:max-w-xs md:max-w-sm overflow-hidden bg-[var(--card)] border border-[var(--border-strong)] rounded-xl focus-within:ring-2 focus-within:ring-[var(--primary)]/20 focus-within:border-[var(--primary)] transition-all shadow-sm">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center justify-center z-10">
              {isRefreshing ? (
                <Loader2 className="w-4 h-4 text-[var(--primary)] animate-spin" />
              ) : (
                <Search className="w-4 h-4 text-[var(--muted-foreground)]" />
              )}
            </div>

            <input
              type="text"
              placeholder="Search tags or title..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-transparent outline-none text-sm text-[var(--foreground)]"
            />

            <div
              className={`absolute bottom-0 left-0 h-0.5 bg-[var(--primary)] transition-opacity duration-300 ${isRefreshing ? 'animate-pulse' : ''}`}
              style={{
                width: isRefreshing ? '100%' : (typingProgress ? '100%' : '0%'),
                transitionProperty: 'width',
                transitionTimingFunction: 'linear',
                transitionDuration: isRefreshing ? '0ms' : (typingProgress ? '1950ms' : '0ms'),
                opacity: (typingProgress || isRefreshing) ? 1 : 0
              }}
            />
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2 w-full sm:w-auto">
            <div className="relative flex-none">
              <select
                value={queryParams.isLocked}
                onChange={(e) => setQueryParams(prev => ({ ...prev, isLocked: e.target.value }))}
                className="appearance-none w-full pl-2.5 pr-8 py-1.5 sm:pl-3 sm:pr-9 sm:py-2 bg-[var(--card)] border border-[var(--border-strong)] rounded-lg sm:rounded-xl outline-none focus:ring-2 focus:ring-[var(--primary)]/20 focus:border-[var(--primary)] text-xs sm:text-sm shadow-sm text-[var(--foreground)] cursor-pointer"
              >
                <option value="">All Status</option>
                <option value="true">Locked</option>
                <option value="false">Unlocked</option>
              </select>
              <ChevronDown className="absolute right-2 sm:right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 sm:w-4 sm:h-4 text-[var(--muted-foreground)] pointer-events-none" />
            </div>

            <div className="relative flex-none">
              <select
                value={queryParams.sort}
                onChange={(e) => setQueryParams(prev => ({ ...prev, sort: e.target.value }))}
                className="appearance-none w-full pl-2.5 pr-8 py-1.5 sm:pl-3 sm:pr-9 sm:py-2 bg-[var(--card)] border border-[var(--border-strong)] rounded-lg sm:rounded-xl outline-none focus:ring-2 focus:ring-[var(--primary)]/20 focus:border-[var(--primary)] text-xs sm:text-sm shadow-sm text-[var(--foreground)] cursor-pointer"
              >
                <option value="">Newest</option>
                <option value="oldest">Oldest</option>
                <option value="updated">Updated</option>
              </select>
              <ChevronDown className="absolute right-2 sm:right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 sm:w-4 sm:h-4 text-[var(--muted-foreground)] pointer-events-none" />
            </div>

            <button
              onClick={handleOpenAddModal}
              className="flex-1 sm:flex-none flex items-center justify-center gap-1 sm:gap-2 px-2 py-1.5 sm:px-4 sm:py-2 bg-[var(--foreground)] text-[var(--background)] font-bold rounded-lg sm:rounded-xl hover:opacity-90 transition-opacity shadow-md text-[10px] sm:text-sm cursor-pointer active:scale-95"
            >
              <Plus className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
              <span className="whitespace-nowrap">Add Data</span>
            </button>
          </div>
        </div>

        {/* 3. Data Bento Grid DENGAN LOCALIZED LOADING */}
        <div className={`transition-opacity duration-200 ${isRefreshing ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}>
          {isFetchingData ? (
            <div className="w-full py-20 flex flex-col items-center justify-center text-[var(--muted-foreground)]">
              <Loader2 className="w-10 h-10 animate-spin text-[var(--primary)] mb-4" />
              <p className="text-xs md:text-sm font-bold tracking-widest uppercase animate-pulse">Decrypting Vault...</p>
            </div>
          ) : (
            <Bento data={data} onItemClick={handleItemClick} />
          )}
        </div>
      </main>

      <DataDetailsModal 
        item={selectedItem} 
        onClose={handleCloseModal} 
        onDataUpdated={handleDataUpdated} 
        onDataDeleted={handleDataDeleted} 
        onForceRefresh={handleForceRefresh} 
      />
      {isAddModalOpen && <AddDataModal onClose={handleCloseAddModal} onDataAdded={handleDataAdded} />}
    </div>
  );
}