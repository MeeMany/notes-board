// src/components/Board/ContextMenu/index.tsx
import React from 'react';

interface ContextMenuProps {
  onDraw: () => void;
}

export const ContextMenu: React.FC<ContextMenuProps> = ({ onDraw }) => {
  return (
    <div className="absolute bg-white shadow-md rounded p-2">
      <button onClick={onDraw} className="block w-full text-left p-2 hover:bg-gray-100">
        Dessiner
      </button>
    </div>
  );
};