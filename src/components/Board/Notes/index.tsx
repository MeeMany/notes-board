// src/components/Board/index.tsx
import React, { useState, useEffect } from 'react';
import { Notes } from './Notes';
import { useStore } from '../../store/useStore';

export const Board: React.FC = () => {
  const addTextNote = useStore(state => state.addTextNote);
  const notes = useStore(state => state.notes); // Ajout pour debug
  const [isWriting, setIsWriting] = useState(false);
  const [text, setText] = useState('');
  const [position, setPosition] = useState<{ x: number, y: number } | null>(null);

  // Log pour debug
  useEffect(() => {
    console.log('Current notes:', notes);
  }, [notes]);

  const handleDoubleClick = (e: React.MouseEvent) => {
    console.log('Double click detected at:', e.clientX, e.clientY);
    if (!isWriting) {
      setPosition({ x: e.clientX, y: e.clientY });
      setIsWriting(true);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    console.log('Key pressed:', e.key);
    if (e.key === 'Enter' && text.trim() !== '') {
      if (position) {
        console.log('Adding note:', { position, text });
        addTextNote(position, text);
      }
      setText('');
      setIsWriting(false);
      setPosition(null);
    }
  };

  return (
    <div 
      className="h-screen w-full bg-white" 
      onDoubleClick={handleDoubleClick}
      style={{ cursor: isWriting ? 'text' : 'default' }}
    >
      {isWriting && position && (
        <textarea
          autoFocus
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          style={{
            position: 'absolute',
            left: position.x,
            top: position.y,
            zIndex: 1000,
            background: 'yellow',
            border: '1px solid black',
            padding: '5px',
            minWidth: '200px',
            minHeight: '100px',
            resize: 'none'
          }}
        />
      )}
      <Notes />
    </div>
  );
};