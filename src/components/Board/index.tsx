// src/components/Board/index.tsx
import React, { useState, useCallback } from 'react';
import { useStore } from '../../store/useStore';
import Notes from './Notes';

export const Board: React.FC = () => {
  const [isWriting, setIsWriting] = useState(false);
  const [text, setText] = useState('');
  const [position, setPosition] = useState<{ x: number; y: number } | null>(null);
  const addTextNote = useStore(state => state.addTextNote);

  const handleDoubleClick = useCallback((e: React.MouseEvent) => {
    // Ignore double clicks on existing notes
    if ((e.target as HTMLElement).closest('.note') || 
        (e.target as HTMLElement).closest('textarea')) {
      return;
    }

    const rect = e.currentTarget.getBoundingClientRect();
    setPosition({ 
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
    setIsWriting(true);
  }, []);

  const handleSubmit = useCallback(() => {
    if (text.trim() && position) {
      addTextNote(position, text.trim());
      setText('');
      setIsWriting(false);
      setPosition(null);
    }
  }, [text, position, addTextNote]);

  return (
    <div 
      className="h-screen w-full relative bg-white"
      onDoubleClick={handleDoubleClick}
      style={{ cursor: 'text' }}
    >
      <Notes />
      
      {isWriting && position && (
        <div
          className="absolute"
          style={{
            left: position.x,
            top: position.y,
            zIndex: 9999,
          }}
          onClick={e => e.stopPropagation()}
        >
          <textarea
            autoFocus
            value={text}
            onChange={e => setText(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSubmit();
              }
            }}
            onBlur={handleSubmit}
            className="bg-yellow-100 p-3 rounded shadow-lg focus:outline-none"
            style={{
              minWidth: '200px',
              minHeight: '100px',
              resize: 'none'
            }}
          />
        </div>
      )}
    </div>
  );
};

export default Board;