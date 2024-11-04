import React from 'react';

interface DrawingToolbarProps {
  onColorChange: (color: string) => void;
  onSizeChange: (size: number) => void;
  onExit: () => void;
  onUndo: () => void;
  onRedo: () => void;
  onClear: () => void;
  onShapeSelect: (shape: 'square' | 'circle' | 'triangle') => void; // Nouvel argument pour sélectionner une forme
  currentColor: string;
  currentSize: number;
  canUndo: boolean;
  canRedo: boolean;
  isVisible: boolean;
}

export const DrawingToolbar: React.FC<DrawingToolbarProps> = ({
  onColorChange,
  onSizeChange,
  onExit,
  onUndo,
  onRedo,
  onClear,
  onShapeSelect,
  currentColor,
  currentSize,
  canUndo,
  canRedo,
  isVisible
}) => {
  if (!isVisible) return null;

  const colors = [
    { name: 'Noir', value: '#000000' },
    { name: 'Blanc', value: '#FFFFFF' },
    { name: 'Rouge', value: '#FF0000' },
    { name: 'Vert', value: '#00FF00' },
    { name: 'Bleu', value: '#0000FF' },
  ];

  const sizes = [1, 2, 4, 6, 8, 10];

  return (
    <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-white rounded-lg shadow-lg p-4 flex items-center gap-4 z-50">
      <div className="flex gap-2">
        <button
          className="p-2 bg-gray-100 rounded hover:bg-gray-200"
          onClick={onUndo}
          disabled={!canUndo}
          title="Annuler"
        >
          ↩
        </button>
        <button
          className="p-2 bg-gray-100 rounded hover:bg-gray-200"
          onClick={onRedo}
          disabled={!canRedo}
          title="Rétablir"
        >
          ↪
        </button>
      </div>

      <div className="h-8 w-px bg-gray-300" />

      <div className="flex gap-2">
        {colors.map(color => (
          <button
            key={color.value}
            className={`w-8 h-8 rounded-full border-2 ${
              currentColor === color.value ? 'border-blue-500' : 'border-gray-300'
            }`}
            style={{ backgroundColor: color.value }}
            onClick={() => onColorChange(color.value)}
            title={color.name}
          />
        ))}
      </div>

      <div className="h-8 w-px bg-gray-300" />

      <div className="flex gap-2 items-center">
        <span className="text-sm text-gray-500">Taille:</span>
        <select
          className="border rounded px-2 py-1"
          value={currentSize}
          onChange={(e) => onSizeChange(Number(e.target.value))}
        >
          {sizes.map(size => (
            <option key={size} value={size}>{size}px</option>
          ))}
        </select>
      </div>

      <div className="h-8 w-px bg-gray-300" />

      <div className="flex gap-2">
        <button
          className="p-2 bg-gray-100 rounded hover:bg-gray-200"
          onClick={() => onShapeSelect('square')}
          title="Carré"
        >
          ▢
        </button>
        <button
          className="p-2 bg-gray-100 rounded hover:bg-gray-200"
          onClick={() => onShapeSelect('circle')}
          title="Cercle"
        >
          ◯
        </button>
        <button
          className="p-2 bg-gray-100 rounded hover:bg-gray-200"
          onClick={() => onShapeSelect('triangle')}
          title="Triangle"
        >
          ▲
        </button>
      </div>

      <div className="h-8 w-px bg-gray-300" />

      <button
        className="p-2 bg-red-100 text-red-600 rounded hover:bg-red-200"
        onClick={onClear}
        title="Effacer tout"
      >
        🗑
      </button>

      <button
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        onClick={onExit}
      >
        Terminer
      </button>
    </div>
  );
};
