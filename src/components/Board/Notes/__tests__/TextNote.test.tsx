// src/components/Board/Notes/__tests__/TextNote.test.tsx
import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import { TextNote } from '../TextNote';
import { useStore } from '../../../../store/useStore';

// Mock react-draggable
jest.mock('react-draggable', () => {
  return {
    __esModule: true,
    default: ({ children }: { children: React.ReactNode }) => <div>{children}</div>
  };
});

// Mock zustand store
jest.mock('../../../../store/useStore');

describe('TextNote', () => {
  const mockNote = {
    id: '1',
    type: 'text' as const,
    content: 'Test note',
    position: { x: 100, y: 100 },
    zIndex: 1
  };

  const mockUpdateNote = jest.fn();
  const mockDeleteNote = jest.fn();
  const mockBringToFront = jest.fn();

  beforeEach(() => {
    (useStore as jest.Mock).mockImplementation(() => ({
      updateNote: mockUpdateNote,
      deleteNote: mockDeleteNote,
      bringToFront: mockBringToFront
    }));
  });

  it('renders note content', () => {
    render(<TextNote note={mockNote} />);
    expect(screen.getByText('Test note')).toBeInTheDocument();
  });

  it('switches to edit mode on double click', () => {
    render(<TextNote note={mockNote} />);
    const noteContent = screen.getByText('Test note');
    fireEvent.doubleClick(noteContent);
    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  it('updates note content on change', () => {
    render(<TextNote note={mockNote} />);
    const noteContent = screen.getByText('Test note');
    fireEvent.doubleClick(noteContent);
    
    const textarea = screen.getByRole('textbox');
    fireEvent.change(textarea, { target: { value: 'Updated content' } });
    
    expect(mockUpdateNote).toHaveBeenCalledWith(mockNote.id, {
      ...mockNote,
      content: 'Updated content'
    });
  });

  it('deletes note when delete button clicked', () => {
    render(<TextNote note={mockNote} />);
    const deleteButton = screen.getByText('×');
    fireEvent.click(deleteButton);
    expect(mockDeleteNote).toHaveBeenCalledWith(mockNote.id);
  });
});
// Add these tests to TextNote.test.tsx after the existing tests

describe('TextNote advanced interactions', () => {
    const mockNote = {
      id: '1',
      type: 'text' as const,
      content: 'Test note',
      position: { x: 100, y: 100 },
      zIndex: 1
    };
  
    it('brings note to front on click', () => {
      render(<TextNote note={mockNote} />);
      const noteElement = screen.getByText('Test note');
      
      fireEvent.click(noteElement);
      
      expect(mockBringToFront).toHaveBeenCalledWith(mockNote.id);
    });
  
    it('exits edit mode on blur', () => {
      render(<TextNote note={mockNote} />);
      const noteContent = screen.getByText('Test note');
      
      fireEvent.doubleClick(noteContent);
      const textarea = screen.getByRole('textbox');
      fireEvent.blur(textarea);
      
      expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
      expect(screen.getByText('Test note')).toBeInTheDocument();
    });
  
    it('handles drag interaction', () => {
      render(<TextNote note={mockNote} />);
      const dragHandle = screen.getByText('Note').parentElement;
      
      fireEvent.mouseDown(dragHandle as Element);
      fireEvent.mouseMove(dragHandle as Element, { clientX: 150, clientY: 150 });
      fireEvent.mouseUp(dragHandle as Element);
      
      expect(mockUpdateNote).toHaveBeenCalledWith(mockNote.id, {
        ...mockNote,
        position: expect.objectContaining({
          x: expect.any(Number),
          y: expect.any(Number)
        })
      });
    });
  });
  // Add these tests in TextNote.test.tsx after the existing tests

describe('TextNote lifecycle and accessibility', () => {
    const mockNote = {
      id: '1',
      type: 'text' as const,
      content: 'Test note',
      position: { x: 100, y: 100 },
      zIndex: 1
    };
  
    it('should cleanup on unmount', () => {
      const { unmount } = render(<TextNote note={mockNote} />);
      unmount();
      // Verify no memory leaks or leftover listeners
    });
  
    it('supports keyboard navigation', () => {
      render(<TextNote note={mockNote} />);
      const noteContent = screen.getByText('Test note');
      
      // Tab navigation
      fireEvent.keyDown(noteContent, { key: 'Tab' });
      const deleteButton = screen.getByText('×');
      expect(deleteButton).toHaveFocus();
      
      // Enter to edit
      fireEvent.keyDown(noteContent, { key: 'Enter' });
      expect(screen.getByRole('textbox')).toBeInTheDocument();
    });
  
    it('meets accessibility requirements', () => {
      const { container } = render(<TextNote note={mockNote} />);
      
      // Check for ARIA attributes
      expect(container.firstChild).toHaveAttribute('role', 'article');
      expect(screen.getByText('×')).toHaveAttribute('aria-label', 'Delete note');
      
      // Test keyboard interaction in edit mode
      const noteContent = screen.getByText('Test note');
      fireEvent.doubleClick(noteContent);
      const textarea = screen.getByRole('textbox');
      expect(textarea).toHaveAttribute('aria-label', 'Edit note content');
    });
  });