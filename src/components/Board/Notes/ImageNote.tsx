// src/components/Board/Notes/ImageNote.tsx
import React, { useState } from 'react';
import Draggable from 'react-draggable';
import { ImageNote as ImageNoteType } from '../types';
import { useStore } from '../../../store/useStore';

interface ImageNoteProps {
  note: ImageNoteType;
}

export const ImageNote: React.FC<ImageNoteProps> = ({ note }) => {
  const [isResizing, setIsResizing] = useState(false);
  const updateNote = useStore(state => state.updateNote);
  const deleteNote = useStore(state => state.deleteNote);

  const handleDrag = (e: any, data: any) => {
    if (!isResizing) {
      updateNote(note.id, {
        ...note,
        position: { x: data.x, y: data.y }
      });
    }
  };

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

  return (
    <Draggable
      position={note.position}
      onStop={handleDrag}
      handle=".drag-handle"
      disabled={isResizing}
    >
      <div className="absolute">
        <div className="group relative">
          <div 
            className="drag-handle cursor-move h-6 bg-gray-200 mb-1 flex items-center justify-between px-2"
            data-testid="drag-handle"
          >
            <span className="text-sm text-gray-600">Image</span>
            <button 
              onClick={() => deleteNote(note.id)}
              className="text-red-500 hover:text-red-700"
            >
              ×
            </button>
          </div>
          
          <div className="relative">
            <img
              src={note.url}
              alt=""
              style={{
                width: note.dimensions.width,
                height: note.dimensions.height
              }}
              className="rounded shadow-md"
              draggable={false}
            />
            
            <div 
              className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize bg-white border border-gray-300 rounded-sm"
              data-testid="resize-handle"
              onMouseDown={() => setIsResizing(true)}
              onMouseUp={() => setIsResizing(false)}
              onMouseLeave={() => setIsResizing(false)}
              onMouseMove={handleResize}
            />
          </div>
        </div>
      </div>
    </Draggable>
  );
};