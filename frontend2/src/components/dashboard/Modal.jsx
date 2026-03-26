import React from 'react';
import { X } from 'lucide-react';

const Modal = ({ item, onClose, onEdit }) => {
  if (!item) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl shadow-lg w-full max-w-2xl max-h-[90vh] flex flex-col">
        <div className="p-6 border-b border-[var(--border)] flex justify-between items-center">
          <h2 className="text-2xl font-bold">{item.title}</h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-[var(--hover)]">
            <X className="w-6 h-6" />
          </button>
        </div>
        <div className="p-6 overflow-y-auto">
          <p className="text-[var(--muted-foreground)] whitespace-pre-wrap">
            {item.content}
          </p>
        </div>
        <div className="p-6 border-t border-[var(--border)] flex justify-end">
          <button
            onClick={() => onEdit(item)}
            className="px-4 py-2 bg-[var(--primary)] text-[var(--primary-foreground)] rounded-md"
          >
            Edit
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
