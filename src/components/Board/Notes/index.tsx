// src/components/Board/Notes/index.tsx
import React, { memo, useState } from 'react';
import Draggable from 'react-draggable';
import { useStore } from '../../../store/useStore';
import { Note as NoteType } from '../../../types';

const Note: React.FC<{ note: NoteType }> = memo(({ note }) => {
  const updateNote = useStore(state => state.updateNote);
  const deleteNote = useStore(state => state.deleteNote);
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState((note as any).content);

  if (note.type !== 'text') return null;

  const handleDoubleClick = (e: React.MouseEvent) => {
    // Ne pas déclencher l'édition si on double-clique sur le bouton de fermeture
    if (!(e.target as HTMLElement).closest('button')) {
      setIsEditing(true);
    }
  };

  const handleEdit = (e: React.FocusEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value.trim();
    if (newContent) {
      updateNote(note.id, {
        ...note,
        content: newContent
      });
    }
    setIsEditing(false);
  };

  return (
    <Draggable
      defaultPosition={note.position}
      onStop={(_e, data) => {
        updateNote(note.id, {
          ...note,
          position: { x: data.x, y: data.y }
        });
      }}
      handle=".drag-handle"
      bounds="parent"
    >
      <div 
        className="note absolute" 
        style={{ 
          zIndex: note.zIndex,
          width: (note as any).width || 200,
          minWidth: '200px',
        }}
      >
        <div
          className="bg-yellow-100 rounded shadow-lg"
          style={{
            width: '100%',
            height: '100%',
            minHeight: '100px',
            resize: 'both',
            overflow: 'visible',
          }}
          onMouseUp={(e) => {
            const element = e.currentTarget;
            updateNote(note.id, {
              ...note,
              width: element.offsetWidth,
              height: element.offsetHeight
            });
          }}
        >
          {/* En-tête de la note */}
          <div className="drag-handle bg-yellow-200 px-3 py-1 cursor-move flex justify-between items-center">
            <div className="text-gray-500">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M3 8V6h18v2H3zm0 5h18v-2H3v2zm0 5h18v-2H3v2z"/>
              </svg>
            </div>
            <button
              onClick={() => deleteNote(note.id)}
              className="text-gray-500 hover:text-red-500 font-bold"
            >
              ×
            </button>
          </div>

          {/* Contenu de la note */}
          <div
            className="p-3 w-full h-full"
            onDoubleClick={handleDoubleClick}
          >
            {isEditing ? (
              <textarea
                autoFocus
                className="w-full h-full min-h-[80px] bg-yellow-50 p-1 focus:outline-none resize-none"
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                onBlur={handleEdit}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && e.shiftKey) {
                    e.preventDefault();
                    handleEdit(e as any);
                  }
                }}
              />
            ) : (
              <div className="whitespace-pre-wrap">
                {(note as any).content}
              </div>
            )}
          </div>

          {/* Indicateur de redimensionnement */}
          <div 
            className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize"
            style={{
              background: `linear-gradient(135deg, transparent 50%, rgba(0,0,0,0.1) 50%)`
            }}
          />
        </div>
      </div>
    </Draggable>
  );
});

const Notes: React.FC = memo(() => {
  const notes = useStore(state => state.notes);
  return (
    <>
      {notes.map(note => (
        <Note key={note.id} note={note} />
      ))}
    </>
  );
});

export default Notes;