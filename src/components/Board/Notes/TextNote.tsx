// src/components/Board/Notes/TextNote.tsx
import React from 'react';
import Draggable from 'react-draggable';
import { TextNote as TextNoteType } from '../types';
import { useStore } from '../../../store/useStore';

interface TextNoteProps {
  note: TextNoteType;
}

export const TextNote: React.FC<TextNoteProps> = ({ note }) => {
  console.log('Rendering TextNote:', note); // Debug log
  
  const updateNote = useStore(state => state.updateNote);
  const deleteNote = useStore(state => state.deleteNote);

  return (
    <Draggable
      position={note.position}
      onStop={(e, data) => {
        console.log('Drag stopped:', { x: data.x, y: data.y }); // Debug log
        updateNote(note.id, {
          ...note,
          position: { x: data.x, y: data.y }
        });
      }}
    >
      <div 
        className="absolute bg-yellow-100 rounded shadow-md p-2"
        style={{ minWidth: '200px', zIndex: note.zIndex }}
      >
        <div className="flex justify-between items-center mb-2">
          <div className="cursor-move">✥</div>
          <button 
            onClick={() => deleteNote(note.id)}
            className="text-red-500 hover:text-red-700"
          >
            ×
          </button>
        </div>
        <div className="p-2">{note.content}</div>
      </div>
    </Draggable>
  );
};