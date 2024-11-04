// src/components/Board/types.ts
export interface Position {
  x: number;
  y: number;
}

export interface TextNote {
  id: string;
  type: 'text';
  content: string;
  position: Position;
  zIndex: number;
}

export interface ImageNote {
  id: string;
  type: 'image';
  url: string;
  position: Position;
  dimensions: {
    width: number;
    height: number;
  };
  zIndex: number;
}

export type Note = TextNote | ImageNote;

export interface StoreState {
  notes: Note[];
  addTextNote: (position: Position, content: string) => void;
  addImageNote: (position: Position, url: string, dimensions: { width: number; height: number }) => void;
  updateNote: (id: string, note: Note) => void;
  deleteNote: (id: string) => void;
}