// src/components/Board/DrawingTools/__tests__/DrawingTools.test.tsx
import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import { DrawingTools } from '../index';

describe('DrawingTools', () => {
  const mockProps = {
    onColorChange: jest.fn(),
    onBrushSizeChange: jest.fn(),
    onExit: jest.fn()
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders all color options', () => {
    render(<DrawingTools {...mockProps} />);
    expect(screen.getByTestId('color-#000000')).toBeInTheDocument();
    expect(screen.getByTestId('color-#ff0000')).toBeInTheDocument();
    expect(screen.getByTestId('color-#00ff00')).toBeInTheDocument();
  });

  it('selects color and calls onColorChange', () => {
    render(<DrawingTools {...mockProps} />);
    fireEvent.click(screen.getByTestId('color-#ff0000'));
    expect(mockProps.onColorChange).toHaveBeenCalledWith('#ff0000');
  });

  it('selects brush size and calls onBrushSizeChange', () => {
    render(<DrawingTools {...mockProps} />);
    fireEvent.click(screen.getByTestId('brush-8'));
    expect(mockProps.onBrushSizeChange).toHaveBeenCalledWith(8);
  });

  it('calls onExit when exit button clicked', () => {
    render(<DrawingTools {...mockProps} />);
    fireEvent.click(screen.getByTestId('exit-drawing'));
    expect(mockProps.onExit).toHaveBeenCalled();
  });

  it('maintains selected state for color and size', () => {
    render(<DrawingTools {...mockProps} />);
    
    const redColorButton = screen.getByTestId('color-#ff0000');
    fireEvent.click(redColorButton);
    expect(redColorButton).toHaveClass('border-blue-500');
    
    const size8Button = screen.getByTestId('brush-8');
    fireEvent.click(size8Button);
    expect(size8Button).toHaveClass('bg-blue-500');
  });
});
// Continue in src/components/Board/DrawingTools/__tests__/DrawingTools.test.tsx

});

it('selects color and updates visual state', () => {
  render(<DrawingTools {...mockProps} />);
  const redButton = screen.getByTestId('color-#ff0000');
  fireEvent.click(redButton);
  expect(redButton).toHaveClass('border-blue-500');
  expect(mockProps.onColorChange).toHaveBeenCalledWith('#ff0000');
});

it('handles keyboard navigation', () => {
  render(<DrawingTools {...mockProps} />);
  const blackButton = screen.getByTestId('color-#000000');
  fireEvent.keyDown(blackButton, { key: 'Tab' });
  expect(screen.getByTestId('color-#ff0000')).toHaveFocus();
});

it('updates brush size and maintains selection', () => {
  render(<DrawingTools {...mockProps} />);
  const largeBrush = screen.getByTestId('brush-12');
  fireEvent.click(largeBrush);
  expect(largeBrush).toHaveClass('bg-blue-500');
  expect(mockProps.onBrushSizeChange).toHaveBeenCalledWith(12);
});

it('maintains tool state between renders', () => {
  const { rerender } = render(<DrawingTools {...mockProps} />);
  
  // Select color and size
  fireEvent.click(screen.getByTestId('color-#ff0000'));
  fireEvent.click(screen.getByTestId('brush-8'));
  
  // Rerender component
  rerender(<DrawingTools {...mockProps} />);
  
  // Check if selections persist
  expect(screen.getByTestId('color-#ff0000')).toHaveClass('border-blue-500');
  expect(screen.getByTestId('brush-8')).toHaveClass('bg-blue-500');
});
});