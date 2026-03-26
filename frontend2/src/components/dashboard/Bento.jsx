import React from 'react';
import { Lock, Unlock } from 'lucide-react';

const Bento = ({ data, onItemClick, onLockToggle }) => {
  const getFontSize = (title) => {
    const length = title.length;
    if (length < 10) return 'text-2xl';
    if (length < 20) return 'text-xl';
    if (length < 30) return 'text-lg';
    return 'text-base';
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {data.map((item) => (
        <div
          key={item.id}
          className="group relative bg-[var(--card)] border border-[var(--border)] rounded-2xl p-4 shadow-sm cursor-pointer flex items-center justify-center text-center"
          onClick={() => onItemClick(item)}
        >
          <h3 className={`font-bold ${getFontSize(item.title)}`}>{item.title}</h3>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onLockToggle(item);
            }}
            className="absolute top-2 right-2 p-2 rounded-full bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            {item.isLocked ? <Lock className="w-5 h-5" /> : <Unlock className="w-5 h-5" />}
          </button>
          {item.isLocked && <Lock className="absolute bottom-2 right-2 w-4 h-4 text-[var(--muted-foreground)]" />}
        </div>
      ))}
    </div>
  );
};

export default Bento;
