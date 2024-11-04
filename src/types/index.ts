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

export interface StoreState {
  notes: Note[];
  addTextNote: (position: Position, content: string) => void;
  addImageNote: (position: Position, url: string, dimensions: Dimensions) => void;
  updateNote: (id: string, note: Partial<Note>) => void;
  deleteNote: (id: string) => void;
}

export interface DrawingState {
  isDrawing: boolean;
  currentTool: Tool;
  currentColor: string;
  currentSize: number;
  currentShape: string | null;
}