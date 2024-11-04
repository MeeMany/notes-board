// src/components/Board/Canvas/index.tsx
import React, { useRef, useEffect, useState } from 'react';

interface CanvasProps {
  isActive: boolean;
  color?: string;
  brushSize?: number;
}

export const Canvas: React.FC<CanvasProps> = ({ 
  isActive,
  color = '#000000',
  brushSize = 2
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [context, setContext] = useState<CanvasRenderingContext2D | null>(null);
  const [lastPosition, setLastPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.strokeStyle = color;
    ctx.lineWidth = brushSize;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    setContext(ctx);
  }, [color, brushSize]);

  const startDrawing = (e: React.MouseEvent) => {
    if (!isActive) return;
    const position = getMousePosition(e);
    setIsDrawing(true);
    setLastPosition(position);
  };

  const draw = (e: React.MouseEvent) => {
    if (!isDrawing || !context || !isActive) return;
    
    const position = getMousePosition(e);
    context.beginPath();
    context.moveTo(lastPosition.x, lastPosition.y);
    context.lineTo(position.x, position.y);
    context.stroke();
    setLastPosition(position);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const getMousePosition = (e: React.MouseEvent) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    return {
      x: e.clientX - (rect?.left || 0),
      y: e.clientY - (rect?.top || 0)
    };
  };

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 ${isActive ? '' : 'pointer-events-none'}`}
      width={window.innerWidth}
      height={window.innerHeight}
      onMouseDown={startDrawing}
      onMouseMove={draw}
      onMouseUp={stopDrawing}
      onMouseLeave={stopDrawing}
      data-testid="drawing-canvas"
    />
  );
};