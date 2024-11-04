import { useState, useCallback, useRef } from 'react';
import { Dimensions } from '../types';

interface UseResizableProps {
  initialDimensions: Dimensions;
  minWidth?: number;
  minHeight?: number;
  aspectRatio?: number;
  onResize?: (dimensions: Dimensions) => void;
}

export const useResizable = ({
  initialDimensions,
  minWidth = 100,
  minHeight = 100,
  aspectRatio,
  onResize
}: UseResizableProps) => {
  const [dimensions, setDimensions] = useState<Dimensions>(initialDimensions);
  const [isResizing, setIsResizing] = useState(false);
  const startPos = useRef<{ x: number; y: number; width: number; height: number } | null>(null);

  const handleResizeStart = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setIsResizing(true);
    startPos.current = {
      x: e.clientX,
      y: e.clientY,
      width: dimensions.width,
      height: dimensions.height
    };
  }, [dimensions]);

  const handleResize = useCallback((e: MouseEvent) => {
    if (!isResizing || !startPos.current) return;

    const deltaX = e.clientX - startPos.current.x;
    const deltaY = e.clientY - startPos.current.y;

    let newWidth = Math.max(startPos.current.width + deltaX, minWidth);
    let newHeight = aspectRatio
      ? newWidth / aspectRatio
      : Math.max(startPos.current.height + deltaY, minHeight);

    if (aspectRatio && newHeight < minHeight) {
      newHeight = minHeight;
      newWidth = newHeight * aspectRatio;
    }

    const newDimensions = { width: newWidth, height: newHeight };
    setDimensions(newDimensions);
    onResize?.(newDimensions);
  }, [isResizing, minWidth, minHeight, aspectRatio, onResize]);

  const handleResizeEnd = useCallback(() => {
    setIsResizing(false);
    startPos.current = null;
  }, []);

  return {
    dimensions,
    isResizing,
    handleResizeStart,
    handleResize,
    handleResizeEnd
  };
};