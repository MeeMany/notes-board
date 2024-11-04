// src/components/Board/Toolbar.tsx
import React from 'react';
import { Tool } from '../../types';

interface ToolbarProps {
  activeTool: Tool;
  onToolChange: (tool: Tool) => void;
}

export const Toolbar: React.FC<ToolbarProps> = ({ activeTool, onToolChange }) => {
  return (
    <div className="bg-white border-b border-gray-200 p-2 flex gap-2">
      <button
        className={`p-2 rounded ${activeTool === 'select' ? 'bg-blue-100' : 'hover:bg-gray-100'}`}
        onClick={() => onToolChange('select')}
      >
        Selection
      </button>
      <button
        className={`p-2 rounded ${activeTool === 'text' ? 'bg-blue-100' : 'hover:bg-gray-100'}`}
        onClick={() => onToolChange('text')}
      >
        Texte
      </button>
      <button
        className={`p-2 rounded ${activeTool === 'shape' ? 'bg-blue-100' : 'hover:bg-gray-100'}`}
        onClick={() => onToolChange('shape')}
      >
        Formes
      </button>
    </div>
  );
};