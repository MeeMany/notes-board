import { useState, useCallback } from 'react';
import { Position } from '../types';

interface UseMovableProps {
  initialPosition: Position;
  onMove?: (position: Position) => void;
}

export const useMovable = ({ initialPosition, onMove }: UseMovableProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState<Position>(initialPosition);
  const [dragOffset, setDragOffset] = useState<Position>({ x: 0, y: 0 });

  const handleDragStart = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    if (e.button === 0) { // Seulement le clic gauche
      setIsDragging(true);
      setDragOffset({
        x: e.clientX - initialPosition.x,
        y: e.clientY - initialPosition.y
      });
    }
  }, [initialPosition]);

  const handleDrag = useCallback((e: MouseEvent) => {
    if (!isDragging) return;

    const newPosition = {
      x: e.clientX - dragOffset.x,
      y: e.clientY - dragOffset.y
    };

    setPosition(newPosition);
    onMove?.(newPosition);
  }, [isDragging, dragOffset, onMove]);

  const handleDragEnd = useCallback(() => {
    setIsDragging(false);
  }, []);

  return {
    position,
    isDragging,
    handleDragStart,
    handleDrag,
    handleDragEnd
  };
};