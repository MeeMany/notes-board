// src/components/Board/Notes/__tests__/ImageNote.test.tsx
import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import { ImageNote } from '../ImageNote';
import { useStore } from '../../../../store/useStore';

// Mock Zustand store
jest.mock('../../../../store/useStore');

describe('ImageNote', () => {
  const mockNote = {
    id: '1',
    type: 'image' as const,
    position: { x: 100, y: 100 },
    url: 'test-image.jpg',
    dimensions: { width: 200, height: 200 },
    zIndex: 1
  };

  const mockUpdateNote = jest.fn();
  const mockDeleteNote = jest.fn();

  beforeEach(() => {
    (useStore as jest.Mock).mockImplementation(() => ({
      updateNote: mockUpdateNote,
      deleteNote: mockDeleteNote
    }));
  });

  it('renders image with correct props', () => {
    render(<ImageNote note={mockNote} />);
    const image = screen.getByRole('img');
    expect(image).toHaveAttribute('src', mockNote.url);
    expect(image).toHaveStyle({
      // src/components/Board/Notes/__tests__/ImageNote.test.tsx
// ... (previous code remains the same until line 35)
width: `${mockNote.dimensions.width}px`,
height: `${mockNote.dimensions.height}px`
});
});

it('handles drag operation correctly', () => {
render(<ImageNote note={mockNote} />);
const dragHandle = screen.getByTestId('drag-handle');

fireEvent.mouseDown(dragHandle);
fireEvent.mouseMove(dragHandle, { clientX: 150, clientY: 150 });
fireEvent.mouseUp(dragHandle);

expect(mockUpdateNote).toHaveBeenCalledWith(mockNote.id, {
...mockNote,
position: expect.objectContaining({
  x: expect.any(Number),
  y: expect.any(Number)
})
});
});

it('handles resize operation correctly', () => {
render(<ImageNote note={mockNote} />);
const resizeHandle = screen.getByTestId('resize-handle');

fireEvent.mouseDown(resizeHandle);
fireEvent.mouseMove(resizeHandle, { movementX: 50, movementY: 50 });
fireEvent.mouseUp(resizeHandle);

expect(mockUpdateNote).toHaveBeenCalledWith(mockNote.id, {
...mockNote,
dimensions: {
  width: 250,  // original 200 + 50
  height: 250  // original 200 + 50
}
});
});

it('prevents resize below minimum dimensions', () => {
render(<ImageNote note={mockNote} />);
const resizeHandle = screen.getByTestId('resize-handle');

fireEvent.mouseDown(resizeHandle);
fireEvent.mouseMove(resizeHandle, { movementX: -150, movementY: -150 });
fireEvent.mouseUp(resizeHandle);

expect(mockUpdateNote).toHaveBeenCalledWith(mockNote.id, {
...mockNote,
dimensions: {
  width: 100,  // minimum width
  height: 100  // minimum height
}
});
});
});