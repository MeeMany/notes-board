// src/components/Board/__tests__/Board.test.tsx
import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import { Board } from '../index';
import { useStore } from '../../../store/useStore';

jest.mock('../../../store/useStore');
jest.mock('react-draggable', () => {
  return {
    __esModule: true,
    default: ({ children }: { children: React.ReactNode }) => <div>{children}</div>
  };
});

describe('Board', () => {
  beforeEach(() => {
    (useStore as jest.Mock).mockImplementation(() => ({
      notes: [],
      addTextNote: jest.fn(),
      addImageNote: jest.fn(),
      updateNote: jest.fn(),
      deleteNote: jest.fn()
    }));
  });

  it('renders empty board', () => {
    render(<Board />);
    expect(screen.getByTestId('board')).toBeInTheDocument();
  });

  it('creates text note on click', () => {
    const mockAddTextNote = jest.fn();
    (useStore as jest.Mock).mockImplementation(() => ({
      notes: [],
      addTextNote: mockAddTextNote
    }));

    render(<Board />);
    const board = screen.getByTestId('board');
    fireEvent.click(board, { clientX: 100, clientY: 100 });

    expect(mockAddTextNote).toHaveBeenCalledWith(
      expect.objectContaining({
        x: 100,
        y: 100
      })
    );
  });

  it('handles image paste', () => {
    const mockHandleImagePaste = jest.fn();
    (useStore as jest.Mock).mockImplementation(() => ({
      notes: [],
      handleImagePaste: mockHandleImagePaste
    }));

    render(<Board />);
    const board = screen.getByTestId('board');
    
    const mockFile = new File([''], 'test.png', { type: 'image/png' });
    const pasteEvent = new ClipboardEvent('paste', {
      clipboardData: new DataTransfer()
    });
    pasteEvent.clipboardData?.items.add(mockFile);

    fireEvent.paste(board, pasteEvent);
    expect(mockHandleImagePaste).toHaveBeenCalled();
  });
});
// Continue in src/components/Board/__tests__/Board.test.tsx

describe('Board', () => {
    beforeEach(() => {
      (useStore as jest.Mock).mockImplementation(() => ({
        notes: [],
        addTextNote: jest.fn(),
        addImageNote: jest.fn(),
        updateNote: jest.fn(),
        deleteNote: jest.fn(),
        bringToFront: jest.fn()
      }));
    });
  
    it('renders toolbar and workspace', () => {
      render(<Board />);
      expect(screen.getByTestId('toolbar')).toBeInTheDocument();
      expect(screen.getByTestId('workspace')).toBeInTheDocument();
    });
  
    it('switches active tool', () => {
      render(<Board />);
      const imageToolButton = screen.getByRole('button', { name: /image/i });
      fireEvent.click(imageToolButton);
      expect(imageToolButton).toHaveClass('active');
    });
  
    it('handles keyboard shortcuts', () => {
      const mockAddTextNote = jest.fn();
      (useStore as jest.Mock).mockImplementation(() => ({
        addTextNote: mockAddTextNote
      }));
  
      render(<Board />);
      fireEvent.keyDown(window, { key: 'n', ctrlKey: true });
      expect(mockAddTextNote).toHaveBeenCalled();
    });
  
    it('displays multiple notes', () => {
      const mockNotes = [
        { id: '1', type: 'text', content: 'Note 1', position: { x: 0, y: 0 }, zIndex: 1 },
        { id: '2', type: 'text', content: 'Note 2', position: { x: 100, y: 100 }, zIndex: 2 }
      ];
  
      (useStore as jest.Mock).mockImplementation(() => ({
        notes: mockNotes
      }));
  
      render(<Board />);
      expect(screen.getByText('Note 1')).toBeInTheDocument();
      expect(screen.getByText('Note 2')).toBeInTheDocument();
    });
  
    it('maintains correct z-index ordering', () => {
      const mockNotes = [
        { id: '1', type: 'text', content: 'Note 1', position: { x: 0, y: 0 }, zIndex: 1 },
        { id: '2', type: 'text', content: 'Note 2', position: { x: 0, y: 0 }, zIndex: 2 }
      ];
  
      (useStore as jest.Mock).mockImplementation(() => ({
        notes: mockNotes
      }));
  
      render(<Board />);
      const notes = screen.getAllByRole('article');
      expect(notes[1]).toHaveStyle({ zIndex: 2 });
    });
  });