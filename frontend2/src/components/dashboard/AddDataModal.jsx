import React, { useState } from 'react';
import { X } from 'lucide-react';
import api from '../../utils/api';

const AddDataModal = ({ onClose, onDataAdded }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const tagsArray = tags.split(',').map(tag => tag.trim()).filter(tag => tag);
    
    const { response, result } = await api.data.create({ 
      title, 
      content, 
      tags: tagsArray.length > 0 ? tagsArray : null
    });

    if (response.ok && result.success) {
      onDataAdded(result.data);
      onClose();
    } else {
      alert('Failed to add data');
    }
    setIsSubmitting(false);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl shadow-lg w-full max-w-2xl">
        <div className="p-6 border-b border-[var(--border)] flex justify-between items-center">
          <h2 className="text-2xl font-bold">Add New Data</h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-[var(--hover)]">
            <X className="w-6 h-6" />
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="p-6 space-y-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-[var(--muted-foreground)] mb-1">Title</label>
              <input
                id="title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 bg-[var(--background)] border border-[var(--border)] rounded-md"
                maxLength="31"
                required
              />
            </div>
            <div>
              <label htmlFor="content" className="block text-sm font-medium text-[var(--muted-foreground)] mb-1">Content</label>
              <textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full px-3 py-2 bg-[var(--background)] border border-[var(--border)] rounded-md"
                rows="5"
                maxLength="1000"
                required
              />
            </div>
            <div>
              <label htmlFor="tags" className="block text-sm font-medium text-[var(--muted-foreground)] mb-1">Tags (comma-separated)</label>
              <input
                id="tags"
                type="text"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                className="w-full px-3 py-2 bg-[var(--background)] border border-[var(--border)] rounded-md"
              />
            </div>
          </div>
          <div className="p-6 border-t border-[var(--border)] flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-[var(--primary)] text-[var(--primary-foreground)] rounded-md disabled:opacity-50"
            >
              {isSubmitting ? 'Adding...' : 'Add Data'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddDataModal;
