import React from 'react';

type ShapeType = 'square' | 'circle' | 'triangle';

interface ShapeProps {
  type: ShapeType;
  size?: number;
  color?: string;
}

export const Shape: React.FC<ShapeProps> = ({ 
  type, 
  size = 40, 
  color = '#4A5568' 
}) => {
  switch (type) {
    case 'square':
      return (
        <div
          className="shape-square"
          style={{
            width: size,
            height: size,
            backgroundColor: color,
            borderRadius: '2px'
          }}
        />
      );
    case 'circle':
      return (
        <div
          className="shape-circle"
          style={{
            width: size,
            height: size,
            backgroundColor: color,
            borderRadius: '50%'
          }}
        />
      );
    case 'triangle':
      return (
        <div
          className="shape-triangle"
          style={{
            width: 0,
            height: 0,
            borderLeft: `${size/2}px solid transparent`,
            borderRight: `${size/2}px solid transparent`,
            borderBottom: `${size}px solid ${color}`
          }}
        />
      );
    default:
      return null;
  }
};