import React from 'react';
import { useStore } from '../../store/useStore';

export const Images: React.FC = () => {
  const notes = useStore((state) => 
    state.notes.filter(note => note.type === 'image')
  );
  const addImageNote = useStore(state => state.addImageNote);

  React.useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      const items = e.clipboardData?.items;
      if (!items) return;

      for (const item of items) {
        if (item.type.startsWith('image')) {
          e.preventDefault();
          const blob = item.getAsFile();
          if (!blob) continue;

          const reader = new FileReader();
          reader.onload = (event) => {
            const img = new Image();
            img.onload = () => {
              let width = img.width;
              let height = img.height;
              const maxSize = 300;
              
              if (width > maxSize || height > maxSize) {
                const ratio = Math.min(maxSize / width, maxSize / height);
                width *= ratio;
                height *= ratio;
              }

              addImageNote(
                { x: 100, y: 100 }, // Position fixe pour test
                event.target?.result as string,
                { width, height }
              );
            };
            img.src = event.target?.result as string;
          };
          reader.readAsDataURL(blob);
        }
      }
    };

    document.addEventListener('paste', handlePaste);
    return () => document.removeEventListener('paste', handlePaste);
  }, [addImageNote]);

  return (
    <div>
      {notes.map(note => (
        <div
          key={note.id}
          className="absolute"
          style={{
            left: note.position.x,
            top: note.position.y,
            zIndex: 1
          }}
        >
          {note.type === 'image' && (
            <img
              src={note.url}
              alt="Pasted content"
              style={{
                width: note.dimensions.width,
                height: note.dimensions.height
              }}
              draggable={false}
            />
          )}
        </div>
      ))}
    </div>
  );
};