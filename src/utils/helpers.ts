import { Position } from '../types';

export const getRelativePosition = (
  e: MouseEvent | React.MouseEvent,
  containerElement: HTMLElement
): Position => {
  const rect = containerElement.getBoundingClientRect();
  return {
    x: e.clientX - rect.left,
    y: e.clientY - rect.top,
  };
};

export const clampPosition = (
  position: Position,
  containerElement: HTMLElement,
  elementWidth: number,
  elementHeight: number
): Position => {
  const rect = containerElement.getBoundingClientRect();
  return {
    x: Math.max(0, Math.min(position.x, rect.width - elementWidth)),
    y: Math.max(0, Math.min(position.y, rect.height - elementHeight)),
  };
};