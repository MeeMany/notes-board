import React, { useState } from 'react';
import { TextNote as TextNoteType, ImageNote as ImageNoteType } from '../../types';
import { useStore } from '../../store/useStore';

interface NoteProps {
  note: TextNoteType | ImageNoteType;
}

export const Note: React.FC<NoteProps> = ({ note }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [initialSize, setInitialSize] = useState({ width: 0, height: 0 });
  const [initialMousePos, setInitialMousePos] = useState({ x: 0, y: 0 });

  const updateNotePosition = useStore(state => state.updateNotePosition);
  const updateNoteDimensions = useStore(state => state.updateNoteDimensions);
  const updateNoteContent = useStore(state => state.updateNoteContent);
  const deleteNote = useStore(state => state.deleteNote);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button === 0 && !isResizing) {
      e.stopPropagation();
      setIsDragging(true);
      const rect = e.currentTarget.getBoundingClientRect();
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      });
    }
  };

  const handleResizeStart = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsResizing(true);
    setInitialMousePos({ x: e.clientX, y: e.clientY });
    const width = note.type === 'image' ? note.dimensions.width : (note as TextNoteType).width;
    const height = note.type === 'image' ? note.dimensions.height : 0;
    setInitialSize({ width, height });
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (isDragging) {
      const newX = e.clientX - dragOffset.x;
      const newY = e.clientY - dragOffset.y;
      updateNotePosition(note.id, { x: newX, y: newY });
    } else if (isResizing) {
      const deltaX = e.clientX - initialMousePos.x;
      const newWidth = Math.max(150, initialSize.width + deltaX);

      if (note.type === 'image') {
        const aspectRatio = initialSize.height / initialSize.width;
        const newHeight = newWidth * aspectRatio;
        updateNoteDimensions(note.id, { width: newWidth, height: newHeight });
      } else {
        // Pour les notes texte, on met à jour seulement la largeur
        updateNoteDimensions(note.id, { width: newWidth, height: 0 });
      }
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setIsResizing(false);
  };

  React.useEffect(() => {
    if (isDragging || isResizing) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, isResizing, dragOffset, initialSize, initialMousePos]);

  const style = note.type === 'image' 
    ? {
        left: `${note.position.x}px`,
        top: `${note.position.y}px`,
        width: `${note.dimensions.width}px`,
        height: `${note.dimensions.height}px`,
        padding: 0,
        backgroundColor: 'transparent'
      }
    : {
        left: `${note.position.x}px`,
        top: `${note.position.y}px`,
        width: `${(note as TextNoteType).width}px`,
      };

  return (
    <div
      className={`absolute rounded shadow-md cursor-move group
        ${note.type === 'text' ? 'p-2 bg-yellow-100' : ''}`}
      style={{
        ...style,
        zIndex: note.zIndex,
      }}
      onMouseDown={handleMouseDown}
    >
      {/* Delete button */}
      <button
        className="absolute -top-2 -right-2 w-6 h-6 bg-white rounded-full shadow-md 
                   flex items-center justify-center opacity-0 group-hover:opacity-100 
                   transition-opacity duration-200 z-10"
        onClick={(e) => {
          e.stopPropagation();
          deleteNote(note.id);
        }}
      >
        <span className="text-gray-500 text-sm">×</span>
      </button>

      {/* Resize handle */}
      <div
        className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize opacity-0 group-hover:opacity-100
                   transition-opacity duration-200 bg-white rounded-bl z-10"
        onMouseDown={handleResizeStart}
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          className="w-4 h-4 text-gray-500"
        >
          <path d="M7 17L17 7M12 17L17 12M7 12L12 7" strokeWidth="2" />
        </svg>
      </div>

      <div className={`${note.type === 'text' ? 'whitespace-pre-wrap break-words' : ''}`}>
        {note.type === 'text' ? note.content : (
          <img
            src={(note as ImageNoteType).url}
            alt="Note"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'contain',
            }}
            draggable={false}
          />
        )}
      </div>
    </div>
  );
};

export default Note;