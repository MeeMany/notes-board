// src/components/Board/DrawingTools/index.tsx
import React, { useState } from 'react';

interface DrawingToolsProps {
  onColorChange: (color: string) => void;
  onBrushSizeChange: (size: number) => void;
  onShapeSelect: (shape: string) => void;
  onExit: () => void;
}

const colors = ['#000000', '#ff0000', '#00ff00', '#0000ff', '#ffffff'];
const brushSizes = [2, 4, 6, 8, 10];

export const DrawingTools: React.FC<DrawingToolsProps> = ({
  onColorChange,
  onBrushSizeChange,
  onShapeSelect,
  onExit
}) => {
  const [selectedColor, setSelectedColor] = useState(colors[0]);
  const [selectedSize, setSelectedSize] = useState(brushSizes[0]);

  return (
    <div className="absolute bottom-0 left-0 right-0 bg-white shadow-md p-4">
      <div className="flex space-x-2">
        {colors.map(color => (
          <button
            key={color}
            className={`w-8 h-8 rounded-full ${selectedColor === color ? 'border-2 border-blue-500' : ''}`}
            style={{ backgroundColor: color }}
            onClick={() => {
              setSelectedColor(color);
              onColorChange(color);
            }}
          />
        ))}
        <input
          type="color"
          value={selectedColor}
          onChange={(e) => {
            setSelectedColor(e.target.value);
            onColorChange(e.target.value);
          }}
        />
      </div>
      <div className="flex space-x-2 mt-2">
        {brushSizes.map(size => (
          <button
            key={size}
            className={`w-8 h-8 rounded ${selectedSize === size ? 'bg-blue-500 text-white' : 'bg-gray-100'}`}
            onClick={() => {
              setSelectedSize(size);
              onBrushSizeChange(size);
            }}
          >
            {size}
          </button>
        ))}
        <input
          type="number"
          value={selectedSize}
          onChange={(e) => {
            const size = parseInt(e.target.value, 10);
            setSelectedSize(size);
            onBrushSizeChange(size);
          }}
          className="w-16 p-1 border rounded"
        />
      </div>
      <div className="flex space-x-2 mt-2">
        {['triangle', 'circle', 'rectangle'].map(shape => (
          <button
            key={shape}
            className="w-8 h-8 rounded bg-gray-100"
            onClick={() => onShapeSelect(shape)}
          >
            {shape}
          </button>
        ))}
      </div>
      <button onClick={onExit} className="mt-4 w-full py-2 bg-red-500 text-white rounded hover:bg-red-600">
        Exit Drawing Mode
      </button>
    </div>
  );
};