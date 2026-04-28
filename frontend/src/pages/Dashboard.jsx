// src/pages/Dashboard.jsx
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Loader2, Search, Plus, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react'; 

import Navbar from '../components/dashboard/Navbar';
import Bento from '../components/dashboard/Bento';
import AddDataModal from '../components/dashboard/AddDataModal';
import DataDetailsModal from '../components/dashboard/DataDetailsModal';
import { useDashboard } from '../hooks/useDashboard';
import { VALIDATION } from '../utils/constants'; // <-- 1. IMPORT KONSTANTA

export default function Dashboard({ isDarkMode, toggleTheme }) {
  const { t } = useTranslation();
  
  const {
    user, data, isLoading, isFetchingData, selectedItem, isAddModalOpen,
    searchInput, setSearchInput, queryParams, setQueryParams,
    isRefreshing, typingProgress, hasNextPage,
    handleForceRefresh, handleLogout,
    handleItemClick, handleCloseModal, handleOpenAddModal, handleCloseAddModal,
    handleDataAdded, handleDataUpdated, handleDataDeleted,
    handleNextPage, handlePrevPage
  } = useDashboard();

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
              maxLength={VALIDATION.RECORD.MAX_TITLE} // <-- 2. TAMBAHKAN MAXLENGTH DI SINI
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
                value={queryParams.visibility}
                onChange={(e) => setQueryParams(prev => ({ ...prev, visibility: e.target.value, page: 1 }))}
                className="appearance-none w-full pl-2.5 pr-8 py-1.5 sm:pl-3 sm:pr-9 sm:py-2 bg-[var(--card)] border border-[var(--border-strong)] rounded-lg sm:rounded-xl outline-none focus:ring-2 focus:ring-[var(--primary)]/20 focus:border-[var(--primary)] text-xs sm:text-sm shadow-sm text-[var(--foreground)] cursor-pointer"
              >
                <option value="">All Status</option>
                <option value="private">Private</option> 
                <option value="public">Public</option>
            </select>
              <ChevronDown className="absolute right-2 sm:right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 sm:w-4 sm:h-4 text-[var(--muted-foreground)] pointer-events-none" />
            </div>

            <div className="relative flex-none">
              <select
                value={queryParams.sort}
                onChange={(e) => setQueryParams(prev => ({ ...prev, sort: e.target.value, page: 1 }))}
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

        <div className={`transition-opacity duration-200 ${isRefreshing ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}>
          {isFetchingData ? (
            <div className="w-full py-20 flex flex-col items-center justify-center text-[var(--muted-foreground)]">
              <Loader2 className="w-10 h-10 animate-spin text-[var(--primary)] mb-4" />
              <p className="text-xs md:text-sm font-bold tracking-widest uppercase animate-pulse">Decrypting Vault...</p>
            </div>
          ) : (
            <>
              <Bento data={data} onItemClick={handleItemClick} />
              
              {(queryParams.page > 1 || hasNextPage) && (
                <div className="mt-8 flex items-center justify-center gap-3">
                  <button
                    onClick={handlePrevPage}
                    disabled={queryParams.page === 1}
                    className="flex items-center gap-1 px-4 py-2 bg-[var(--card)] border border-[var(--border-strong)] text-[var(--foreground)] text-sm font-bold rounded-xl hover:bg-[var(--secondary)] transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Prev
                  </button>
                  
                  <div className="px-4 py-2 bg-[var(--secondary)] border border-[var(--border)] rounded-xl text-sm font-bold text-[var(--foreground)] shadow-inner">
                    Page {queryParams.page}
                  </div>

                  <button
                    onClick={handleNextPage}
                    disabled={!hasNextPage}
                    className="flex items-center gap-1 px-4 py-2 bg-[var(--card)] border border-[var(--border-strong)] text-[var(--foreground)] text-sm font-bold rounded-xl hover:bg-[var(--secondary)] transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                  >
                    Next
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </>
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