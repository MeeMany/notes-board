// src/components/Board/Notes/TextNote.tsx
import React, { useState } from 'react';
import Draggable from 'react-draggable';
import { TextNote as TextNoteType } from '../types';
import { useStore } from '../../../store/useStore';

interface TextNoteProps {
  note: TextNoteType;
}

export const TextNote: React.FC<TextNoteProps> = ({ note }) => {
  const [isEditing, setIsEditing] = useState(false);
  const updateNote = useStore(state => state.updateNote);
  const deleteNote = useStore(state => state.deleteNote);

  return (
    <Draggable
      position={note.position}
      onStop={(e, data) => {
        updateNote(note.id, {
          ...note,
          position: { x: data.x, y: data.y }
        });
      }}
    >
      <div className="absolute bg-yellow-100 rounded shadow-md" style={{ zIndex: note.zIndex }}>
        <div className="flex justify-between items-center p-2 bg-yellow-200 cursor-move">
          <span>Note</span>
          <button onClick={() => deleteNote(note.id)} className="text-red-500">×</button>
        </div>
        {isEditing ? (
          <textarea
            autoFocus
            value={note.content}
            onChange={(e) => {
              updateNote(note.id, {
                ...note,
                content: e.target.value
              });
            }}
            onBlur={() => setIsEditing(false)}
            className="p-2 w-full min-w-[200px] resize-none bg-transparent outline-none"
          />
        ) : (
          <div onDoubleClick={() => setIsEditing(true)} className="p-2 min-w-[200px]">
            {note.content}
          </div>
        )}
      </div>
    </Draggable>
  );
};