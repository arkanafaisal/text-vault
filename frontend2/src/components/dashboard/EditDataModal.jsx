import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import api from '../../utils/api';

const EditDataModal = ({ item, onClose, onDataUpdated }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');
  const [expiresAt, setExpiresAt] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (item) {
      setTitle(item.title);
      setContent(item.content);
      setTags(item.tags ? item.tags.join(', ') : '');
      setExpiresAt(item.expiresAt ? new Date(item.expiresAt).toISOString().slice(0, 16) : '');
    }
  }, [item]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const tagsArray = tags.split(',').map(tag => tag.trim()).filter(tag => tag);
    const promises = [];
    let updatedData = { ...item };

    const commonDataChanged =
      item.title !== title ||
      item.content !== content ||
      JSON.stringify(item.tags || []) !== JSON.stringify(tagsArray);

    const expiresAtChanged =
      (item.expiresAt ? new Date(item.expiresAt).toISOString().slice(0, 16) : '') !== expiresAt;

    if (commonDataChanged) {
      const commonPayload = { title, content, tags: tagsArray.length > 0 ? tagsArray : null };
      promises.push(api.data.updateCommon(item.id, commonPayload));
      updatedData = { ...updatedData, ...commonPayload };
    }

    if (expiresAtChanged) {
      const statusPayload = { isLocked: item.isLocked, expiresAt: expiresAt || null };
      promises.push(api.data.updateIsLocked(item.id, statusPayload));
      updatedData = { ...updatedData, ...statusPayload };
    }

    if (promises.length > 0) {
      const responses = await Promise.all(promises);
      const allOk = responses.every(res => res.response.ok);

      if (allOk) {
        onDataUpdated(updatedData);
        onClose();
      } else {
        alert('Failed to update data');
      }
    } else {
      onClose(); // No changes, just close
    }

    setIsSubmitting(false);
  };

  if (!item) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl shadow-lg w-full max-w-2xl">
        <div className="p-6 border-b border-[var(--border)] flex justify-between items-center">
          <h2 className="text-2xl font-bold">Edit Data</h2>
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
            <div>
              <label htmlFor="expiresAt" className="block text-sm font-medium text-[var(--muted-foreground)] mb-1">Expires At</label>
              <input
                id="expiresAt"
                type="datetime-local"
                value={expiresAt}
                onChange={(e) => setExpiresAt(e.target.value)}
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
              {isSubmitting ? 'Updating...' : 'Update Data'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditDataModal;
