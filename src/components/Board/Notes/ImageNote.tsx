// src/components/Board/Notes/ImageNote.tsx
import React, { useState } from 'react';
import Draggable from 'react-draggable';
import { ImageNote as ImageNoteType } from '../types';
import { useStore } from '../../../store/useStore';

interface ImageNoteProps {
  note: ImageNoteType;
}

interface StoreState {
  updateNote: (id: string, note: ImageNoteType) => void;
  deleteNote: (id: string) => void;
}

export const ImageNote: React.FC<ImageNoteProps> = ({ note }) => {
  const [isResizing, setIsResizing] = useState(false);
  const updateNote = useStore((state: StoreState) => state.updateNote);
  const deleteNote = useStore((state: StoreState) => state.deleteNote);

  const handleResize = (e: React.MouseEvent) => {
    if (!isResizing) return;
    updateNote(note.id, {
      ...note,
      dimensions: {
        width: Math.max(100, note.dimensions.width + e.movementX),
        height: Math.max(100, note.dimensions.height + e.movementY)
      }
    });
  };