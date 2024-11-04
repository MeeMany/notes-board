import React from 'react';

interface ContextMenuProps {
  x: number;
  y: number;
  onClose: () => void;
  onDraw: () => void;
  onAddShape: (shape: 'square' | 'circle' | 'triangle') => void;
}

export const ContextMenu: React.FC<ContextMenuProps> = ({
  x,
  y,
  onClose,
  onDraw,
  onAddShape,
}) => {
  const menuRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  return (
    <div
      ref={menuRef}
      className="fixed bg-white rounded-lg shadow-lg py-2 min-w-[180px] z-50 border border-gray-200"
      style={{ left: x, top: y }}
    >
      <button
        className="w-full px-4 py-2 text-left hover:bg-gray-100 flex items-center gap-2"
        onClick={onDraw}
      >
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path d="M3 17l6-6M7 21l4-4" strokeWidth="2"/>
        </svg>
        Dessiner
      </button>

      <div className="border-t border-gray-200 my-1" />
      
      <div className="px-4 py-2">
        <div className="text-sm text-gray-500 mb-2">Formes</div>
        <div className="flex gap-4">
          <button
            className="p-2 hover:bg-gray-100 rounded"
            onClick={() => onAddShape('square')}
          >
            <div className="w-4 h-4 bg-gray-800 rounded-sm" />
          </button>
          <button
            className="p-2 hover:bg-gray-100 rounded"
            onClick={() => onAddShape('circle')}
          >
            <div className="w-4 h-4 bg-gray-800 rounded-full" />
          </button>
          <button
            className="p-2 hover:bg-gray-100 rounded"
            onClick={() => onAddShape('triangle')}
          >
            <div 
              className="w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-b-[16px]"
              style={{ borderBottomColor: '#1f2937' }}
            />
          </button>
        </div>
      </div>
    </div>
  );
};