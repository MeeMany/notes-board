// src/store/__tests__/useStore.test.ts
import { renderHook } from '@testing-library/react';
import { useStore } from '../useStore';

describe('useStore', () => {
  beforeEach(() => {
    useStore.setState({ notes: [] });
  });

  it('should add an image note', () => {
    const { result } = renderHook(() => useStore());
    
    result.current.addImageNote(
      { x: 100, y: 100 },
      'test-image.jpg',
      { width: 200, height: 200 }
    );

    expect(result.current.notes[0]).toMatchObject({
      type: 'image',
      position: { x: 100, y: 100 },
      url: 'test-image.jpg',
      dimensions: { width: 200, height: 200 }
    });
  });

  it('should update note position', () => {
    const { result } = renderHook(() => useStore());
    
    result.current.addImageNote(
      { x: 100, y: 100 },
      'test-image.jpg',
      { width: 200, height: 200 }
    );
    const noteId = result.current.notes[0].id;

    result.current.updateNote(noteId, {
      ...result.current.notes[0],
      position: { x: 150, y: 150 }
    });

    expect(result.current.notes[0].position).toEqual({ x: 150, y: 150 });
  });

  it('should delete note', () => {
    const { result } = renderHook(() => useStore());
    
    result.current.addImageNote(
      { x: 100, y: 100 },
      'test-image.jpg',
      { width: 200, height: 200 }
    );
    const noteId = result.current.notes[0].id;

    result.current.deleteNote(noteId);
    
    expect(result.current.notes).toHaveLength(0);
  });
});
// src/store/__tests__/useStore.test.ts
// ... (code existant reste inchangé)

// Ajouter après le dernier test et le dernier '});'
describe('useStore advanced features', () => {
    beforeEach(() => {
      useStore.setState({ notes: [] });
    });
  
    it('should bring note to front', () => {
      const { result } = renderHook(() => useStore());
      
      // Add two notes
      result.current.addImageNote(
        { x: 100, y: 100 },
        'image1.jpg',
        { width: 200, height: 200 }
      );
      result.current.addImageNote(
        { x: 150, y: 150 },
        'image2.jpg',
        { width: 200, height: 200 }
      );
  
      const firstNoteId = result.current.notes[0].id;
      const firstNoteInitialZ = result.current.notes[0].zIndex;
      
      result.current.bringToFront(firstNoteId);
  
      expect(result.current.notes[0].zIndex).toBeGreaterThan(firstNoteInitialZ);
    });
  
    it('should handle image paste event', () => {
      const { result } = renderHook(() => useStore());
      
      const mockFile = new File([''], 'test.png', { type: 'image/png' });
      const clipboardEvent = new ClipboardEvent('paste', {
        clipboardData: new DataTransfer()
      });
      clipboardEvent.clipboardData?.items.add(mockFile);
  
      result.current.handleImagePaste(clipboardEvent);
  
      // Wait for async operations
      setTimeout(() => {
        expect(result.current.notes).toHaveLength(1);
        expect(result.current.notes[0].type).toBe('image');
      }, 100);
    });
  });
  // Add these tests after the existing ones in useStore.test.ts

describe('useStore image paste handling', () => {
    beforeEach(() => {
      useStore.setState({ notes: [] });
    });
  
    it('should handle multiple image pastes', () => {
      const { result } = renderHook(() => useStore());
      
      // Create two mock images
      const mockImages = ['image1.png', 'image2.png'].map(name => 
        new File([''], name, { type: 'image/png' })
      );
      
      // Simulate pasting both images
      mockImages.forEach(file => {
        const clipboardEvent = new ClipboardEvent('paste', {
          clipboardData: new DataTransfer()
        });
        clipboardEvent.clipboardData?.items.add(file);
        result.current.handleImagePaste(clipboardEvent);
      });
  
      // Wait for both images to be processed
      setTimeout(() => {
        expect(result.current.notes).toHaveLength(2);
        expect(result.current.notes[1].zIndex).toBeGreaterThan(result.current.notes[0].zIndex);
      }, 200);
    });
  
    it('should ignore non-image files', () => {
      const { result } = renderHook(() => useStore());
      
      const mockTextFile = new File(['test'], 'test.txt', { type: 'text/plain' });
      const clipboardEvent = new ClipboardEvent('paste', {
        clipboardData: new DataTransfer()
      });
      clipboardEvent.clipboardData?.items.add(mockTextFile);
  
      result.current.handleImagePaste(clipboardEvent);
  
      expect(result.current.notes).toHaveLength(0);
    });
  });