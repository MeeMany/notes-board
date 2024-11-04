// src/store/useStore.ts
import { create } from 'zustand';
import { nanoid } from 'nanoid';

export const useStore = create((set) => ({
  notes: [],
  
  addTextNote: (position, content) => set((state) => ({
    notes: [
      ...state.notes,
      {
        id: nanoid(),
        type: 'text',
        content,
        position,
        width: 200,
        zIndex: state.notes.length + 1
      }
    ]
  })),

  updateNote: (id, updates) => set((state) => ({
    notes: state.notes.map(note =>
      note.id === id ? { ...note, ...updates } : note
    )
  })),

  deleteNote: (id) => set((state) => ({
    notes: state.notes.filter(note => note.id !== id)
  }))
}));