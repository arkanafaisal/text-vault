// src/pages/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import api from '../utils/api';
import { navigate } from '../utils/navigation';
import { Loader2, Search, Plus, Lock, Unlock } from 'lucide-react';

// Import komponen Navbar khusus Dashboard
import Navbar from '../components/dashboard/Navbar';
import Bento from '../components/dashboard/Bento';
import Modal from '../components/dashboard/Modal';
import AddDataModal from '../components/dashboard/AddDataModal';
import EditDataModal from '../components/dashboard/EditDataModal';

export default function Dashboard({ isDarkMode, toggleTheme }) {
  const { t } = useTranslation();
  const [user, setUser] = useState(null);
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState(null);
  const [filter, setFilter] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setIsLoading(true);
      const userPromise = api.users.getMe();
      const dataPromise = api.data.getAll();

      const [userResponse, dataResponse] = await Promise.all([userPromise, dataPromise]);

      if (userResponse.response.ok && userResponse.result.success) {
        setUser(userResponse.result.data);
      } else {
        navigate('/');
      }

      if (dataResponse.response.ok && dataResponse.result.success) {
        setData(dataResponse.result.data);
      }

      setIsLoading(false);
    };

    fetchDashboardData();
  }, []);

  const handleLogout = async () => {
    await api.auth.logout();
    localStorage.removeItem('accessToken');
    navigate('/');
  };

  const handleItemClick = (item) => {
    setSelectedItem(item);
  };

  const handleCloseModal = () => {
    setSelectedItem(null);
  };

  const handleFilterChange = (e) => {
    setFilter(e.target.value);
  };

  const handleOpenAddModal = () => {
    setIsAddModalOpen(true);
  };

  const handleCloseAddModal = () => {
    setIsAddModalOpen(false);
  };

  const handleDataAdded = (newData) => {
    setData((prevData) => [newData, ...prevData]);
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setIsEditModalOpen(true);
    setSelectedItem(null);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setEditingItem(null);
  };

  const handleDataUpdated = (updatedData) => {
    setData((prevData) =>
      prevData.map((item) => (item.id === updatedData.id ? updatedData : item))
    );
  };

  const handleLockToggle = async (itemToToggle) => {
    const updatedItem = { ...itemToToggle, isLocked: !itemToToggle.isLocked };
    
    // Optimistic update
    handleDataUpdated(updatedItem);

    const { response } = await api.data.updateStatus(itemToToggle.id, {
      isLocked: !itemToToggle.isLocked,
      expiresAt: itemToToggle.expiresAt,
    });

    if (!response.ok) {
      // Revert on failure
      handleDataUpdated(itemToToggle);
      alert('Failed to update lock status');
    }
  };

  const filteredData = data.filter((item) =>
    item.title.toLowerCase().includes(filter.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--background)] text-[var(--foreground)]">
        <Loader2 className="w-8 h-8 animate-spin text-[var(--primary)]" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen flex flex-col bg-[var(--background)] text-[var(--foreground)]">
      <Navbar 
        isDarkMode={isDarkMode} 
        toggleTheme={toggleTheme} 
        user={user} 
        onLogout={handleLogout} 
        onUpdateUser={() => {}} // Placeholder, as onUpdateUser is not used here anymore
      />

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 md:px-8 py-8 md:py-12">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">
              Your Data Bento
            </h1>
            <p className="text-[var(--muted-foreground)]">Click on a card to see the details.</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--muted-foreground)]" />
              <input
                type="text"
                placeholder="Filter by title..."
                value={filter}
                onChange={handleFilterChange}
                className="pl-10 pr-4 py-2 bg-[var(--card)] border border-[var(--border)] rounded-md"
              />
            </div>
            <button
              onClick={handleOpenAddModal}
              className="flex items-center gap-2 px-4 py-2 bg-[var(--primary)] text-[var(--primary-foreground)] rounded-md"
            >
              <Plus className="w-5 h-5" />
              <span>Add Data</span>
            </button>
          </div>
        </div>

        <Bento data={filteredData} onItemClick={handleItemClick} onLockToggle={handleLockToggle} />
      </main>

      <Modal item={selectedItem} onClose={handleCloseModal} onEdit={handleEdit} />
      {isAddModalOpen && <AddDataModal onClose={handleCloseAddModal} onDataAdded={handleDataAdded} />}
      {isEditModalOpen && <EditDataModal item={editingItem} onClose={handleCloseEditModal} onDataUpdated={handleDataUpdated} />}
    </div>
  );
}