// src/types/index.ts
export interface Position {
  x: number;
  y: number;
}

export interface Dimensions {
  width: number;
  height: number;
}

export interface BaseNote {
  id: string;
  position: Position;
  zIndex: number;
  type: 'text' | 'image' | 'shape';
}

export interface TextNote extends BaseNote {
  type: 'text';
  content: string;
  width: number;
}

export interface ImageNote extends BaseNote {
  type: 'image';
  url: string;
  dimensions: Dimensions;
}

export interface ShapeNote extends BaseNote {
  type: 'shape';
  shapeType: 'square' | 'circle' | 'triangle';
  dimensions: Dimensions;
  color: string;
}

export type Note = TextNote | ImageNote | ShapeNote;
export type Tool = 'select' | 'text' | 'draw' | 'shape';