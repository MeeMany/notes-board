// src/components/Board/types.ts
export type Tool = 'text' | 'image' | 'draw';

export interface Position {
  x: number;
  y: number;
}

export interface NoteBase {
  id: string;
  position: Position;
  type: string;
  zIndex: number;
}

export interface TextNote extends NoteBase {
  type: 'text';
  content: string;
}

export interface ImageNote extends NoteBase {
  type: 'image';
  url: string;
  dimensions: {
    width: number;
    height: number;
  };
}

export type Note = TextNote | ImageNote;