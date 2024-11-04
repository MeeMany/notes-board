// src/hooks/useToolManager.ts
import { useCallback, useEffect } from 'react';
import { Tool } from '../components/Board/types';

export const useToolManager = (
  activeTool: Tool,
  setActiveTool: (tool: Tool) => void
) => {
  const handleKeyPress = useCallback((e: KeyboardEvent) => {
    if (e.ctrlKey || e.metaKey) {
      switch (e.key.toLowerCase()) {
        case 't':
          e.preventDefault();
          setActiveTool('text');
          break;
        case 'i':
          e.preventDefault();
          setActiveTool('image');
          break;
        case 'd':
          e.preventDefault();
          setActiveTool('draw');
          break;
      }
    }
  }, [setActiveTool]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [handleKeyPress]);

  return {
    switchTool: setActiveTool,
    shortcuts: {
      text: 'Ctrl/⌘ + T',
      image: 'Ctrl/⌘ + I',
      draw: 'Ctrl/⌘ + D'
    }
  };
};

// Update Toolbar component to include tooltips and keyboard support
export const Toolbar: React.FC<ToolbarProps> = ({ activeTool, onToolChange }) => {
  const { shortcuts } = useToolManager(activeTool, onToolChange);

  return (
    <div 
      className="w-16 bg-gray-100 border-r border-gray-200 p-2"
      data-testid="toolbar"
      role="toolbar"
      aria-label="Drawing tools"
    >
      {tools.map(tool => (
        <button
          key={tool.id}
          onClick={() => onToolChange(tool.id)}
          className={`
            w-full p-2 mb-2 rounded flex flex-col items-center
            ${activeTool === tool.id ? 'bg-blue-500 text-white' : 'bg-white hover:bg-gray-50'}
          `}
          aria-label={`${tool.label} (${shortcuts[tool.id]})`}
          aria-pressed={activeTool === tool.id}
          data-testid={`tool-${tool.id}`}
          title={`${tool.label} (${shortcuts[tool.id]})`}
        >
          <span className="text-xl">{tool.icon}</span>
          <span className="text-xs mt-1">{tool.label}</span>
        </button>
      ))}
    </div>
  );
};