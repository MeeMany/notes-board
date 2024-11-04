// src/components/Board/index.tsx
import React, { useState } from 'react';
import { Notes } from './Notes';
import { useStore } from '../../store/useStore';

export const Board: React.FC = () => {
  const addTextNote = useStore(state => state.addTextNote);
  const [isWriting, setIsWriting] = useState(false);
  const [text, setText] = useState('');
  const [position, setPosition] = useState<{ x: number, y: number } | null>(null);

  const handleDoubleClick = (e: React.MouseEvent) => {
    if (!isWriting) {
      setPosition({ x: e.clientX, y: e.clientY });
      setIsWriting(true);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && text.trim() !== '') {
      if (position) {
        addTextNote(position, text);
      }
      setText('');
      setIsWriting(false);
      setPosition(null);
    }
  };

  return (
    <div className="h-screen flex flex-col" onDoubleClick={handleDoubleClick}>
      <div className="flex-1 relative bg-white overflow-hidden">
        {isWriting && (
          <textarea
            autoFocus
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            style={{
              position: 'absolute',
              left: position?.x,
              top: position?.y,
              zIndex: 1000,
              background: 'yellow',
              border: '1px solid black',
              padding: '5px',
              resize: 'none'
            }}
          />
        )}
        <Notes />
      </div>
    </div>
  );
};