// src/store/useStore.ts
import create from 'zustand';
import { nanoid } from 'nanoid';
import { Note, Position } from '../components/Board/types';

interface BoardState {
  notes: Note[];
  addTextNote: (position: Position, content: string) => void;
  updateNote: (id: string, note: Note) => void;
  deleteNote: (id: string) => void;
}

export const useStore = create<BoardState>((set) => ({
  notes: [],
  
  addTextNote: (position, content) => set((state) => ({
    notes: [...state.notes, {
      id: nanoid(),
      type: 'text',
      position,
      content,
      zIndex: state.notes.length + 1
    }]
  })),

  updateNote: (id, updatedNote) => set((state) => ({
    notes: state.notes.map(note => 
      note.id === id ? { ...note, ...updatedNote } : note
    )
  })),

  deleteNote: (id) => set((state) => ({
    notes: state.notes.filter(note => note.id !== id)
  }))
}));