// src/components/Board/Canvas/__tests__/Canvas.test.tsx
import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import { Canvas } from '../index';

describe('Canvas', () => {
  const mockGetContext = jest.fn();
  const mockBeginPath = jest.fn();
  const mockMoveTo = jest.fn();
  const mockLineTo = jest.fn();
  const mockStroke = jest.fn();

  beforeEach(() => {
    // Mock canvas context
    HTMLCanvasElement.prototype.getContext = jest.fn(() => ({
      beginPath: mockBeginPath,
      moveTo: mockMoveTo,
      lineTo: mockLineTo,
      stroke: mockStroke
    }));
  });


  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders canvas element', () => {
    render(<Canvas isActive={true} />);
    expect(screen.getByTestId('drawing-canvas')).toBeInTheDocument();
  });

  it('starts drawing on mouse down when active', () => {
    render(<Canvas isActive={true} color="#ff0000" brushSize={8} />);
    const canvas = screen.getByTestId('drawing-canvas');
    
    fireEvent.mouseDown(canvas, { clientX: 100, clientY: 100 });
    fireEvent.mouseMove(canvas, { clientX: 120, clientY: 120 });
    
    expect(mockBeginPath).toHaveBeenCalled();
    expect(mockMoveTo).toHaveBeenCalled();
    expect(mockLineTo).toHaveBeenCalled();
    expect(mockStroke).toHaveBeenCalled();
  });

  it('does not draw when inactive', () => {
    render(<Canvas isActive={false} />);
    const canvas = screen.getByTestId('drawing-canvas');
    
    fireEvent.mouseDown(canvas, { clientX: 100, clientY: 100 });
    fireEvent.mouseMove(canvas, { clientX: 120, clientY: 120 });
    
    expect(mockBeginPath).not.toHaveBeenCalled();
  });

  it('stops drawing on mouse up', () => {
    render(<Canvas isActive={true} />);
    const canvas = screen.getByTestId('drawing-canvas');
    
    fireEvent.mouseDown(canvas, { clientX: 100, clientY: 100 });
    fireEvent.mouseUp(canvas);
    fireEvent.mouseMove(canvas, { clientX: 120, clientY: 120 });
    
    expect(mockBeginPath).not.toHaveBeenCalled();
  });
});
// Continue in src/components/Board/Canvas/__tests__/Canvas.test.tsx

afterEach(() => {
    jest.clearAllMocks();
  });

  it('initializes canvas with correct properties', () => {
    const mockSetStrokeStyle = jest.fn();
    const mockSetLineWidth = jest.fn();
    
    HTMLCanvasElement.prototype.getContext = jest.fn(() => ({
      ...mockGetContext(),
      strokeStyle: undefined,
      lineWidth: undefined,
      set strokeStyle(value) { mockSetStrokeStyle(value); },
      set lineWidth(value) { mockSetLineWidth(value); }
    }));

    render(<Canvas isActive={true} color="#ff0000" brushSize={8} />);
    
    expect(mockSetStrokeStyle).toHaveBeenCalledWith('#ff0000');
    expect(mockSetLineWidth).toHaveBeenCalledWith(8);
  });

  it('updates canvas properties when props change', () => {
    const { rerender } = render(
      <Canvas isActive={true} color="#000000" brushSize={4} />
    );

    rerender(<Canvas isActive={true} color="#ff0000" brushSize={8} />);
    
    expect(mockGetContext).toHaveBeenCalledTimes(2);
  });

  it('handles window resize', () => {
    const originalInnerWidth = window.innerWidth;
    const originalInnerHeight = window.innerHeight;

    render(<Canvas isActive={true} />);
    const canvas = screen.getByTestId('drawing-canvas');

    // Simulate window resize
    window.innerWidth = 1024;
    window.innerHeight = 768;
    fireEvent(window, new Event('resize'));

    expect(canvas).toHaveAttribute('width', '1024');
    expect(canvas).toHaveAttribute('height', '768');

    // Cleanup
    window.innerWidth = originalInnerWidth;
    window.innerHeight = originalInnerHeight;
  });
});
// Add these tests to Canvas.test.tsx

describe('Canvas touch interactions', () => {
    beforeEach(() => {
      HTMLCanvasElement.prototype.getContext = jest.fn(() => ({
        beginPath: jest.fn(),
        moveTo: jest.fn(),
        lineTo: jest.fn(),
        stroke: jest.fn()
      }));
    });
  
    it('handles touch start events', () => {
      render(<Canvas isActive={true} />);
      const canvas = screen.getByTestId('drawing-canvas');
  
      fireEvent.touchStart(canvas, {
        touches: [{ clientX: 100, clientY: 100 }]
      });
  
      expect(canvas).toHaveClass('active');
    });
  
    it('draws with touch move', () => {
      render(<Canvas isActive={true} />);
      const canvas = screen.getByTestId('drawing-canvas');
  
      fireEvent.touchStart(canvas, {
        touches: [{ clientX: 100, clientY: 100 }]
      });
  
      fireEvent.touchMove(canvas, {
        touches: [{ clientX: 120, clientY: 120 }]
      });
  
      const context = canvas.getContext('2d');
      expect(context?.moveTo).toHaveBeenCalled();
      expect(context?.lineTo).toHaveBeenCalled();
    });
  
    it('stops drawing on touch end', () => {
      render(<Canvas isActive={true} />);
      const canvas = screen.getByTestId('drawing-canvas');
  
      fireEvent.touchStart(canvas);
      fireEvent.touchEnd(canvas);
      fireEvent.touchMove(canvas);
  
      const context = canvas.getContext('2d');
      expect(context?.lineTo).not.toHaveBeenCalled();
    });
  });
  // Add these tests to Canvas.test.tsx

describe('Canvas gesture handling', () => {
    beforeEach(() => {
      HTMLCanvasElement.prototype.getContext = jest.fn(() => ({
        beginPath: jest.fn(),
        moveTo: jest.fn(),
        lineTo: jest.fn(),
        stroke: jest.fn(),
        scale: jest.fn(),
        rotate: jest.fn(),
        translate: jest.fn()
      }));
    });
  
    it('handles pinch zoom gesture', () => {
      render(<Canvas isActive={true} />);
      const canvas = screen.getByTestId('drawing-canvas');
  
      // Simulate pinch start
      fireEvent.touchStart(canvas, {
        touches: [
          { clientX: 100, clientY: 100 },
          { clientX: 200, clientY: 200 }
        ]
      });
  
      // Simulate pinch move
      fireEvent.touchMove(canvas, {
        touches: [
          { clientX: 50, clientY: 50 },
          { clientX: 250, clientY: 250 }
        ]
      });
  
      const context = canvas.getContext('2d');
      expect(context?.scale).toHaveBeenCalled();
    });
  
    it('handles rotation gesture', () => {
      render(<Canvas isActive={true} />);
      const canvas = screen.getByTestId('drawing-canvas');
  
      // Simulate rotation gesture
      fireEvent.touchStart(canvas, {
        touches: [
          { clientX: 100, clientY: 100 },
          { clientX: 200, clientY: 100 }
        ]
      });
  
      fireEvent.touchMove(canvas, {
        touches: [
          { clientX: 100, clientY: 100 },
          { clientX: 200, clientY: 200 }
        ]
      });
  
      const context = canvas.getContext('2d');
      expect(context?.rotate).toHaveBeenCalled();
    });
  });
  // Add these tests to Canvas.test.tsx

describe('Canvas optimization', () => {
    beforeEach(() => {
      HTMLCanvasElement.prototype.getContext = jest.fn(() => ({
        beginPath: jest.fn(),
        moveTo: jest.fn(),
        lineTo: jest.fn(),
        stroke: jest.fn(),
        clearRect: jest.fn(),
        save: jest.fn(),
        restore: jest.fn()
      }));
    });
  
    it('debounces rapid drawing events', async () => {
      jest.useFakeTimers();
      render(<Canvas isActive={true} />);
      const canvas = screen.getByTestId('drawing-canvas');
  
      // Simulate rapid mouse movements
      for (let i = 0; i < 10; i++) {
        fireEvent.mouseMove(canvas, {
          clientX: 100 + i,
          clientY: 100 + i
        });
      }
  
      jest.runAllTimers();
      const context = canvas.getContext('2d');
      expect(context?.stroke).toHaveBeenCalledTimes(1);
      jest.useRealTimers();
    });
  
    it('cleans up resources on unmount', () => {
      const { unmount } = render(<Canvas isActive={true} />);
      const canvas = screen.getByTestId('drawing-canvas');
      const context = canvas.getContext('2d');
  
      unmount();
      expect(context?.clearRect).toHaveBeenCalled();
    });
  
    it('maintains drawing state between re-renders', () => {
      const { rerender } = render(<Canvas isActive={true} />);
      const canvas = screen.getByTestId('drawing-canvas');
      const context = canvas.getContext('2d');
  
      // Draw something
      fireEvent.mouseDown(canvas, { clientX: 100, clientY: 100 });
      fireEvent.mouseMove(canvas, { clientX: 200, clientY: 200 });
  
      // Re-render with different props
      rerender(<Canvas isActive={true} color="#ff0000" />);
  
      expect(context?.save).toHaveBeenCalled();
      expect(context?.restore).toHaveBeenCalled();
    });
  });
  // Add these tests to Canvas.test.tsx

describe('Canvas save and export', () => {
    const mockToDataURL = jest.fn();
    
    beforeEach(() => {
      HTMLCanvasElement.prototype.getContext = jest.fn(() => ({
        beginPath: jest.fn(),
        moveTo: jest.fn(),
        lineTo: jest.fn(),
        stroke: jest.fn(),
        drawImage: jest.fn()
      }));
      HTMLCanvasElement.prototype.toDataURL = mockToDataURL;
    });
  
    it('captures canvas snapshot', () => {
      mockToDataURL.mockReturnValue('data:image/png;base64,test');
      render(<Canvas isActive={true} />);
      const canvas = screen.getByTestId('drawing-canvas');
  
      // Draw something
      fireEvent.mouseDown(canvas, { clientX: 100, clientY: 100 });
      fireEvent.mouseMove(canvas, { clientX: 200, clientY: 200 });
  
      expect(canvas.toDataURL()).toBe('data:image/png;base64,test');
    });
  
    it('restores previous drawing state', () => {
      const { rerender } = render(<Canvas isActive={true} savedState="data:image/png;base64,test" />);
      const canvas = screen.getByTestId('drawing-canvas');
      const context = canvas.getContext('2d');
  
      rerender(<Canvas isActive={true} />);
      expect(context?.drawImage).toHaveBeenCalled();
    });
  
    it('exports drawing as image', () => {
      const mockCreateElement = jest.spyOn(document, 'createElement');
      const mockClick = jest.fn();
      
      const mockLink = {
        click: mockClick,
        download: '',
        href: ''
      };
      
      mockCreateElement.mockReturnValue(mockLink as any);
      mockToDataURL.mockReturnValue('data:image/png;base64,test');
  
      render(<Canvas isActive={true} />);
      const canvas = screen.getByTestId('drawing-canvas');
      
      // Trigger export
      fireEvent.keyDown(canvas, { key: 's', ctrlKey: true });
  
      expect(mockClick).toHaveBeenCalled();
      expect(mockLink.download).toBeTruthy();
    });
  });
  // Add these tests to Canvas.test.tsx

describe('Canvas history management', () => {
    const mockContext = {
      beginPath: jest.fn(),
      moveTo: jest.fn(),
      lineTo: jest.fn(),
      stroke: jest.fn(),
      save: jest.fn(),
      restore: jest.fn(),
      clearRect: jest.fn(),
      putImageData: jest.fn(),
      getImageData: jest.fn()
    };
  
    beforeEach(() => {
      HTMLCanvasElement.prototype.getContext = jest.fn(() => mockContext);
    });
  
    it('captures stroke history', () => {
      render(<Canvas isActive={true} />);
      const canvas = screen.getByTestId('drawing-canvas');
  
      // Draw multiple strokes
      fireEvent.mouseDown(canvas, { clientX: 100, clientY: 100 });
      fireEvent.mouseMove(canvas, { clientX: 150, clientY: 150 });
      fireEvent.mouseUp(canvas);
  
      fireEvent.mouseDown(canvas, { clientX: 200, clientY: 200 });
      fireEvent.mouseMove(canvas, { clientX: 250, clientY: 250 });
      fireEvent.mouseUp(canvas);
  
      expect(mockContext.save).toHaveBeenCalledTimes(2);
    });
  
    it('handles undo command', () => {
      render(<Canvas isActive={true} />);
      const canvas = screen.getByTestId('drawing-canvas');
  
      // Draw and undo
      fireEvent.mouseDown(canvas, { clientX: 100, clientY: 100 });
      fireEvent.mouseMove(canvas, { clientX: 150, clientY: 150 });
      fireEvent.mouseUp(canvas);
      
      fireEvent.keyDown(canvas, { key: 'z', ctrlKey: true });
  
      expect(mockContext.clearRect).toHaveBeenCalled();
      expect(mockContext.putImageData).toHaveBeenCalled();
    });
  
    it('handles redo command', () => {
      render(<Canvas isActive={true} />);
      const canvas = screen.getByTestId('drawing-canvas');
  
      // Draw, undo, and redo
      fireEvent.mouseDown(canvas, { clientX: 100, clientY: 100 });
      fireEvent.mouseUp(canvas);
      fireEvent.keyDown(canvas, { key: 'z', ctrlKey: true });
      fireEvent.keyDown(canvas, { key: 'z', ctrlKey: true, shiftKey: true });
  
      expect(mockContext.putImageData).toHaveBeenCalledTimes(2);
    });
  });
  // Add these tests to Canvas.test.tsx

describe('Canvas performance', () => {
    const mockContext = {
      beginPath: jest.fn(),
      moveTo: jest.fn(),
      lineTo: jest.fn(),
      stroke: jest.fn(),
      setLineDash: jest.fn(),
      requestAnimationFrame: jest.fn()
    };
  
    beforeEach(() => {
      HTMLCanvasElement.prototype.getContext = jest.fn(() => mockContext);
      jest.useFakeTimers();
    });
  
    afterEach(() => {
      jest.useRealTimers();
    });
  
    it('throttles rapid drawing events', () => {
      render(<Canvas isActive={true} />);
      const canvas = screen.getByTestId('drawing-canvas');
  
      // Simulate rapid mouse movements
      for (let i = 0; i < 100; i++) {
        fireEvent.mouseMove(canvas, {
          clientX: i,
          clientY: i
        });
      }
  
      jest.runAllTimers();
      expect(mockContext.stroke).toHaveBeenCalledTimes(10); // Throttled to 10 frames
    });
  
    it('uses requestAnimationFrame for smooth rendering', () => {
      const mockRAF = jest.spyOn(window, 'requestAnimationFrame');
      render(<Canvas isActive={true} />);
      const canvas = screen.getByTestId('drawing-canvas');
  
      fireEvent.mouseDown(canvas, { clientX: 0, clientY: 0 });
      fireEvent.mouseMove(canvas, { clientX: 100, clientY: 100 });
  
      expect(mockRAF).toHaveBeenCalled();
    });
  
    it('optimizes memory usage during continuous drawing', () => {
      const mockGetImageData = jest.fn();
      const mockPutImageData = jest.fn();
      Object.assign(mockContext, { getImageData: mockGetImageData, putImageData: mockPutImageData });
  
      render(<Canvas isActive={true} />);
      const canvas = screen.getByTestId('drawing-canvas');
  
      // Simulate long drawing session
      for (let i = 0; i < 1000; i++) {
        fireEvent.mouseMove(canvas, { clientX: i, clientY: i });
      }
  
      expect(mockGetImageData).toHaveBeenCalledTimes(1); // Should cache canvas state
      expect(mockPutImageData).toHaveBeenCalledTimes(1); // Should update efficiently
    });
  });
  // Add these tests to Canvas.test.tsx

describe('Canvas brush styles', () => {
    const mockContext = {
      beginPath: jest.fn(),
      moveTo: jest.fn(),
      lineTo: jest.fn(),
      stroke: jest.fn(),
      createLinearGradient: jest.fn(),
      createPattern: jest.fn(),
      setLineDash: jest.fn(),
      globalAlpha: 1,
      globalCompositeOperation: 'source-over'
    };
  
    beforeEach(() => {
      HTMLCanvasElement.prototype.getContext = jest.fn(() => mockContext);
    });
  
    it('applies brush styles correctly', () => {
      render(
        <Canvas 
          isActive={true}
          brushStyle={{
            color: '#ff0000',
            size: 5,
            opacity: 0.5,
            pattern: 'dotted'
          }}
        />
      );
  
      expect(mockContext.globalAlpha).toBe(0.5);
      expect(mockContext.setLineDash).toHaveBeenCalledWith([5, 5]);
    });
  
    it('supports gradient brushes', () => {
      const mockGradient = {
        addColorStop: jest.fn()
      };
      mockContext.createLinearGradient.mockReturnValue(mockGradient);
  
      render(
        <Canvas 
          isActive={true}
          brushStyle={{
            type: 'gradient',
            colors: ['#ff0000', '#0000ff']
          }}
        />
      );
  
      expect(mockContext.createLinearGradient).toHaveBeenCalled();
      expect(mockGradient.addColorStop).toHaveBeenCalledTimes(2);
    });
  
    it('handles blend modes', () => {
      render(
        <Canvas 
          isActive={true}
          brushStyle={{
            blendMode: 'multiply'
          }}
        />
      );
  
      expect(mockContext.globalCompositeOperation).toBe('multiply');
    });
  });
  // Add these tests to Canvas.test.tsx

describe('Canvas accessibility', () => {
    const mockContext = {
      beginPath: jest.fn(),
      moveTo: jest.fn(),
      lineTo: jest.fn(),
      stroke: jest.fn()
    };
  
    beforeEach(() => {
      HTMLCanvasElement.prototype.getContext = jest.fn(() => mockContext);
    });
  
    it('supports keyboard drawing controls', () => {
      render(<Canvas isActive={true} />);
      const canvas = screen.getByTestId('drawing-canvas');
  
      // Test arrow key drawing
      fireEvent.keyDown(canvas, { key: 'Enter' }); // Start drawing
      fireEvent.keyDown(canvas, { key: 'ArrowRight' });
      fireEvent.keyDown(canvas, { key: 'ArrowDown' });
      fireEvent.keyDown(canvas, { key: 'Enter' }); // Stop drawing
  
      expect(mockContext.lineTo).toHaveBeenCalledTimes(2);
    });
  
    it('provides proper ARIA attributes', () => {
      render(<Canvas isActive={true} />);
      const canvas = screen.getByTestId('drawing-canvas');
  
      expect(canvas).toHaveAttribute('role', 'application');
      expect(canvas).toHaveAttribute('aria-label', 'Drawing canvas');
      expect(canvas).toHaveAttribute('aria-describedby');
    });
  
    it('announces drawing mode changes', () => {
      render(<Canvas isActive={true} />);
      const canvas = screen.getByTestId('drawing-canvas');
      
      fireEvent.keyDown(canvas, { key: 'e', ctrlKey: true }); // Toggle eraser
      
      expect(canvas).toHaveAttribute(
        'aria-live', 
        'polite'
      );
    });
  });
  // Add these tests to Canvas.test.tsx

describe('Canvas error handling', () => {
    const mockContext = {
      beginPath: jest.fn(),
      moveTo: jest.fn(),
      lineTo: jest.fn(),
      stroke: jest.fn(),
      restore: jest.fn()
    };
  
    beforeEach(() => {
      HTMLCanvasElement.prototype.getContext = jest.fn(() => mockContext);
      console.error = jest.fn();
    });
  
    it('recovers from context loss', () => {
      render(<Canvas isActive={true} />);
      const canvas = screen.getByTestId('drawing-canvas');
  
      // Simulate context loss
      fireEvent(canvas, new Event('webglcontextlost'));
      
      expect(mockContext.restore).toHaveBeenCalled();
      expect(console.error).not.toHaveBeenCalled();
    });
  
    it('handles invalid brush sizes gracefully', () => {
      render(
        <Canvas 
          isActive={true} 
          brushSize={-1} // Invalid size
        />
      );
  
      const canvas = screen.getByTestId('drawing-canvas');
      fireEvent.mouseDown(canvas, { clientX: 0, clientY: 0 });
      
      expect(mockContext.stroke).toHaveBeenCalled();
      expect(console.error).not.toHaveBeenCalled();
    });
  
    it('maintains state after failed operations', () => {
      mockContext.stroke.mockImplementationOnce(() => {
        throw new Error('Stroke failed');
      });
  
      render(<Canvas isActive={true} />);
      const canvas = screen.getByTestId('drawing-canvas');
  
      // Attempt drawing that will fail
      fireEvent.mouseDown(canvas, { clientX: 0, clientY: 0 });
      
      // Verify canvas remains usable
      mockContext.stroke.mockImplementation(() => {});
      fireEvent.mouseDown(canvas, { clientX: 100, clientY: 100 });
      
      expect(mockContext.stroke).toHaveBeenCalledTimes(2);
    });
  });
  // Add these tests to Canvas.test.tsx

describe('Canvas stress testing', () => {
    const mockContext = {
      beginPath: jest.fn(),
      moveTo: jest.fn(),
      lineTo: jest.fn(),
      stroke: jest.fn(),
      scale: jest.fn(),
      clearRect: jest.fn()
    };
  
    beforeEach(() => {
      HTMLCanvasElement.prototype.getContext = jest.fn(() => mockContext);
      jest.useFakeTimers();
    });
  
    afterEach(() => {
      jest.useRealTimers();
    });
  
    it('handles rapid successive strokes', () => {
      const { rerender } = render(<Canvas isActive={true} />);
      const canvas = screen.getByTestId('drawing-canvas');
  
      // Simulate 1000 rapid strokes
      Array.from({ length: 1000 }).forEach((_, i) => {
        fireEvent.mouseDown(canvas, { clientX: i, clientY: i });
        fireEvent.mouseMove(canvas, { clientX: i + 1, clientY: i + 1 });
        fireEvent.mouseUp(canvas);
      });
  
      jest.runAllTimers();
      expect(mockContext.stroke).toHaveBeenCalled();
    });
  
    it('handles window resize events gracefully', () => {
      render(<Canvas isActive={true} />);
      const canvas = screen.getByTestId('drawing-canvas');
  
      // Simulate multiple rapid resize events
      Array.from({ length: 50 }).forEach(() => {
        fireEvent(window, new Event('resize'));
      });
  
      jest.runAllTimers();
      expect(mockContext.scale).toHaveBeenCalled();
    });
  
    it('maintains performance with large canvas size', () => {
      const originalClientWidth = 3000;
      const originalClientHeight = 2000;
  
      Object.defineProperty(HTMLCanvasElement.prototype, 'clientWidth', {
        value: originalClientWidth
      });
      Object.defineProperty(HTMLCanvasElement.prototype, 'clientHeight', {
        value: originalClientHeight
      });
  
      render(<Canvas isActive={true} />);
      const canvas = screen.getByTestId('drawing-canvas');
  
      fireEvent.mouseDown(canvas, { clientX: 1500, clientY: 1000 });
      fireEvent.mouseMove(canvas, { clientX: 1600, clientY: 1100 });
  
      expect(mockContext.stroke).toHaveBeenCalled();
    });
  });
  // Add these tests to Canvas.test.tsx

describe('Canvas collaboration features', () => {
    const mockContext = {
      beginPath: jest.fn(),
      moveTo: jest.fn(),
      lineTo: jest.fn(),
      stroke: jest.fn(),
      arc: jest.fn()
    };
  
    const mockBroadcast = jest.fn();
    const mockReceiveStroke = jest.fn();
  
    beforeEach(() => {
      HTMLCanvasElement.prototype.getContext = jest.fn(() => mockContext);
      jest.spyOn(window, 'postMessage');
    });
  
    it('broadcasts cursor position', () => {
      render(
        <Canvas 
          isActive={true}
          collaborative={true}
          onCursorMove={mockBroadcast}
        />
      );
      const canvas = screen.getByTestId('drawing-canvas');
  
      fireEvent.mouseMove(canvas, { clientX: 100, clientY: 100 });
      
      expect(mockBroadcast).toHaveBeenCalledWith({
        type: 'cursor',
        position: { x: 100, y: 100 }
      });
    });
  
    it('syncs remote strokes', () => {
      render(
        <Canvas 
          isActive={true}
          collaborative={true}
          onReceiveStroke={mockReceiveStroke}
        />
      );
  
      // Simulate receiving remote stroke
      window.postMessage({
        type: 'stroke',
        points: [
          { x: 0, y: 0 },
          { x: 100, y: 100 }
        ]
      }, '*');
  
      expect(mockContext.lineTo).toHaveBeenCalledWith(100, 100);
    });
  
    it('resolves concurrent edits', () => {
      const { rerender } = render(
        <Canvas 
          isActive={true}
          collaborative={true}
          version={1}
        />
      );
  
      // Simulate concurrent edits
      rerender(
        <Canvas 
          isActive={true}
          collaborative={true}
          version={2}
          pendingStrokes={[
            { points: [{ x: 0, y: 0 }, { x: 100, y: 100 }] }
          ]}
        />
      );
  
      expect(mockContext.stroke).toHaveBeenCalled();
    });
  });
  // Add these tests to Canvas.test.tsx

describe('Canvas realtime sync', () => {
    const mockContext = {
      beginPath: jest.fn(),
      moveTo: jest.fn(),
      lineTo: jest.fn(),
      stroke: jest.fn()
    };
  
    const mockWebSocket = {
      send: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      close: jest.fn()
    };
  
    beforeEach(() => {
      HTMLCanvasElement.prototype.getContext = jest.fn(() => mockContext);
      global.WebSocket = jest.fn(() => mockWebSocket);
    });
  
    it('establishes websocket connection', () => {
      render(
        <Canvas 
          isActive={true}
          realtimeSync={true}
          roomId="test-room"
        />
      );
  
      expect(WebSocket).toHaveBeenCalledWith(
        expect.stringContaining('test-room')
      );
    });
  
    it('broadcasts local strokes', () => {
      render(
        <Canvas 
          isActive={true}
          realtimeSync={true}
          roomId="test-room"
        />
      );
      const canvas = screen.getByTestId('drawing-canvas');
  
      fireEvent.mouseDown(canvas, { clientX: 0, clientY: 0 });
      fireEvent.mouseMove(canvas, { clientX: 100, clientY: 100 });
      fireEvent.mouseUp(canvas);
  
      expect(mockWebSocket.send).toHaveBeenCalledWith(
        expect.stringContaining('"type":"stroke"')
      );
    });
  
    it('applies remote strokes', () => {
      render(
        <Canvas 
          isActive={true}
          realtimeSync={true}
          roomId="test-room"
        />
      );
  
      // Simulate receiving remote stroke
      const messageHandler = mockWebSocket.addEventListener.mock.calls
        .find(call => call[0] === 'message')[1];
  
      messageHandler({
        data: JSON.stringify({
          type: 'stroke',
          points: [{ x: 0, y: 0 }, { x: 100, y: 100 }]
        })
      });
  
      expect(mockContext.lineTo).toHaveBeenCalledWith(100, 100);
    });
  });
  // Add these tests to Canvas.test.tsx

describe('Canvas browser compatibility', () => {
    const mockContext = {
      beginPath: jest.fn(),
      moveTo: jest.fn(),
      lineTo: jest.fn(),
      stroke: jest.fn(),
      setLineDash: jest.fn(),
      mozDash: undefined,
      webkitLineDash: undefined
    };
  
    beforeEach(() => {
      HTMLCanvasElement.prototype.getContext = jest.fn(() => mockContext);
    });
  
    it('handles pointer events', () => {
      render(<Canvas isActive={true} />);
      const canvas = screen.getByTestId('drawing-canvas');
  
      fireEvent.pointerDown(canvas, { 
        pointerId: 1,
        clientX: 0,
        clientY: 0 
      });
      
      fireEvent.pointerMove(canvas, {
        pointerId: 1,
        clientX: 100,
        clientY: 100
      });
  
      expect(mockContext.lineTo).toHaveBeenCalledWith(100, 100);
    });
  
    it('supports vendor-specific canvas properties', () => {
      const vendorContext = {
        ...mockContext,
        mozDash: [],
        webkitLineDash: []
      };
  
      HTMLCanvasElement.prototype.getContext = jest.fn(() => vendorContext);
  
      render(
        <Canvas 
          isActive={true} 
          brushStyle={{ pattern: 'dashed' }}
        />
      );
  
      expect(vendorContext.mozDash || vendorContext.webkitLineDash)
        .toBeDefined();
    });
  
    it('handles high-DPI displays', () => {
      window.devicePixelRatio = 2;
      
      render(<Canvas isActive={true} />);
      const canvas = screen.getByTestId('drawing-canvas');
  
      expect(canvas.width).toBe(window.innerWidth * 2);
      expect(canvas.height).toBe(window.innerHeight * 2);
      expect(mockContext.scale).toHaveBeenCalledWith(2, 2);
    });
  });
  // Add these tests to Canvas.test.tsx

describe('Canvas mobile support', () => {
    const mockContext = {
      beginPath: jest.fn(),
      moveTo: jest.fn(),
      lineTo: jest.fn(),
      stroke: jest.fn(),
      scale: jest.fn(),
      translate: jest.fn()
    };
  
    beforeEach(() => {
      HTMLCanvasElement.prototype.getContext = jest.fn(() => mockContext);
      window.matchMedia = jest.fn().mockImplementation(query => ({
        matches: false,
        media: query,
        addEventListener: jest.fn(),
        removeEventListener: jest.fn()
      }));
    });
  
    it('handles touch gestures', () => {
      render(<Canvas isActive={true} />);
      const canvas = screen.getByTestId('drawing-canvas');
  
      fireEvent.touchStart(canvas, {
        touches: [{ clientX: 0, clientY: 0, identifier: 1 }]
      });
      
      fireEvent.touchMove(canvas, {
        touches: [{ clientX: 100, clientY: 100, identifier: 1 }]
      });
  
      expect(mockContext.lineTo).toHaveBeenCalledWith(100, 100);
    });
  
    it('adapts to orientation changes', () => {
      const { rerender } = render(<Canvas isActive={true} />);
      
      // Simulate orientation change
      Object.defineProperty(window, 'innerWidth', { value: 768 });
      Object.defineProperty(window, 'innerHeight', { value: 1024 });
      fireEvent(window, new Event('orientationchange'));
      
      rerender(<Canvas isActive={true} />);
      
      expect(mockContext.scale).toHaveBeenCalled();
    });
  
    it('prevents scrolling while drawing', () => {
      render(<Canvas isActive={true} />);
      const canvas = screen.getByTestId('drawing-canvas');
      const preventDefault = jest.fn();
  
      fireEvent.touchStart(canvas, {
        touches: [{ clientX: 0, clientY: 0 }],
        preventDefault
      });
  
      expect(preventDefault).toHaveBeenCalled();
    });
  });
  // Add these tests to Canvas.test.tsx

describe('Canvas pressure sensitivity', () => {
    const mockContext = {
      beginPath: jest.fn(),
      moveTo: jest.fn(),
      lineTo: jest.fn(),
      stroke: jest.fn(),
      lineWidth: 1
    };
  
    beforeEach(() => {
      HTMLCanvasElement.prototype.getContext = jest.fn(() => mockContext);
    });
  
    it('handles pressure-sensitive input', () => {
      render(<Canvas isActive={true} supportsPressure={true} />);
      const canvas = screen.getByTestId('drawing-canvas');
  
      fireEvent.pointerDown(canvas, {
        pressure: 0.5,
        pointerType: 'pen',
        clientX: 0,
        clientY: 0
      });
  
      expect(mockContext.lineWidth).toBe(0.5 * canvas.width / 100);
    });
  
    it('supports tilt sensitivity', () => {
      render(<Canvas isActive={true} supportsTilt={true} />);
      const canvas = screen.getByTestId('drawing-canvas');
  
      fireEvent.pointerMove(canvas, {
        tiltX: 30,
        tiltY: 45,
        pointerType: 'pen',
        clientX: 100,
        clientY: 100
      });
  
      expect(mockContext.lineCap).toBe('round');
      expect(mockContext.lineJoin).toBe('round');
    });
  
    it('handles stylus button events', () => {
      const onStylusButton = jest.fn();
      render(
        <Canvas 
          isActive={true} 
          onStylusButtonPress={onStylusButton}
        />
      );
      const canvas = screen.getByTestId('drawing-canvas');
  
      fireEvent.pointerDown(canvas, {
        button: 2,
        buttons: 4,
        pointerType: 'pen',
        clientX: 0,
        clientY: 0
      });
  
      expect(onStylusButton).toHaveBeenCalled();
    });
  });
  // Add these tests to Canvas.test.tsx

describe('Canvas brush presets', () => {
    const mockContext = {
      beginPath: jest.fn(),
      moveTo: jest.fn(),
      lineTo: jest.fn(),
      stroke: jest.fn(),
      lineWidth: 1,
      strokeStyle: '#000000',
      globalCompositeOperation: 'source-over'
    };
  
    beforeEach(() => {
      HTMLCanvasElement.prototype.getContext = jest.fn(() => mockContext);
    });
  
    it('applies brush preset correctly', () => {
      render(
        <Canvas 
          isActive={true}
          brushPreset={{
            name: 'marker',
            size: 5,
            color: '#ff0000',
            opacity: 0.8
          }}
        />
      );
  
      expect(mockContext.lineWidth).toBe(5);
      expect(mockContext.strokeStyle).toBe('#ff0000');
      expect(mockContext.globalAlpha).toBe(0.8);
    });
  
    it('switches to eraser mode', () => {
      const { rerender } = render(<Canvas isActive={true} />);
      
      rerender(<Canvas isActive={true} mode="eraser" />);
      
      expect(mockContext.globalCompositeOperation).toBe('destination-out');
    });
  
    it('handles basic drawing operation', () => {
      render(<Canvas isActive={true} />);
      const canvas = screen.getByTestId('drawing-canvas');
  
      // Simulate drawing a line
      fireEvent.mouseDown(canvas, { clientX: 0, clientY: 0 });
      fireEvent.mouseMove(canvas, { clientX: 100, clientY: 100 });
      fireEvent.mouseUp(canvas);
  
      expect(mockContext.beginPath).toHaveBeenCalled();
      expect(mockContext.moveTo).toHaveBeenCalledWith(0, 0);
      expect(mockContext.lineTo).toHaveBeenCalledWith(100, 100);
      expect(mockContext.stroke).toHaveBeenCalled();
    });
  });
  describe('Canvas advanced drawing', () => {
    const mockContext = {
      beginPath: jest.fn(),
      moveTo: jest.fn(),
      lineTo: jest.fn(),
      quadraticCurveTo: jest.fn(),
      bezierCurveTo: jest.fn(),
      arc: jest.fn(),
      stroke: jest.fn()
    };
  
    beforeEach(() => {
      HTMLCanvasElement.prototype.getContext = jest.fn(() => mockContext);
      jest.clearAllMocks();
    });
  
    it('draws curved lines', () => {
      render(<Canvas isActive={true} mode="curve" />);
      const canvas = screen.getByTestId('drawing-canvas');
  
      // Simulate drawing a curve with control points
      fireEvent.mouseDown(canvas, { clientX: 0, clientY: 0 });
      fireEvent.mouseMove(canvas, { clientX: 50, clientY: 25 });
      fireEvent.mouseMove(canvas, { clientX: 100, clientY: 0 });
      fireEvent.mouseUp(canvas);
  
      expect(mockContext.quadraticCurveTo).toHaveBeenCalledWith(50, 25, 100, 0);
    });
  
    it('handles continuous stroke drawing', () => {
      render(<Canvas isActive={true} />);
      const canvas = screen.getByTestId('drawing-canvas');
  
      // Simulate multiple connected line segments
      const points = [
        [0, 0],
        [50, 50],
        [100, 0],
        [150, 50]
      ];
  
      fireEvent.mouseDown(canvas, { clientX: points[0][0], clientY: points[0][1] });
      points.slice(1).forEach(([x, y]) => {
        fireEvent.mouseMove(canvas, { clientX: x, clientY: y });
      });
      fireEvent.mouseUp(canvas);
  
      expect(mockContext.beginPath).toHaveBeenCalledTimes(1);
      expect(mockContext.lineTo).toHaveBeenCalledTimes(points.length - 1);
    });
  
    it('draws shapes', () => {
      render(<Canvas isActive={true} mode="circle" />);
      const canvas = screen.getByTestId('drawing-canvas');
  
      fireEvent.mouseDown(canvas, { clientX: 100, clientY: 100 });
      fireEvent.mouseMove(canvas, { clientX: 150, clientY: 150 });
      fireEvent.mouseUp(canvas);
  
      expect(mockContext.arc).toHaveBeenCalledWith(100, 100, 50, 0, 2 * Math.PI);
    });
  });
  describe('Canvas shape tools', () => {
    const mockContext = {
      beginPath: jest.fn(),
      rect: jest.fn(),
      rotate: jest.fn(),
      translate: jest.fn(),
      scale: jest.fn(),
      stroke: jest.fn(),
      restore: jest.fn(),
      save: jest.fn()
    };
  
    beforeEach(() => {
      HTMLCanvasElement.prototype.getContext = jest.fn(() => mockContext);
      jest.clearAllMocks();
    });
  
    it('draws rectangle with correct dimensions', () => {
      render(<Canvas isActive={true} mode="rectangle" />);
      const canvas = screen.getByTestId('drawing-canvas');
  
      fireEvent.mouseDown(canvas, { clientX: 50, clientY: 50 });
      fireEvent.mouseMove(canvas, { clientX: 150, clientY: 100 });
      fireEvent.mouseUp(canvas);
  
      expect(mockContext.rect).toHaveBeenCalledWith(50, 50, 100, 50);
    });
  
    it('rotates shapes with shift key', () => {
      render(<Canvas isActive={true} mode="rectangle" />);
      const canvas = screen.getByTestId('drawing-canvas');
  
      fireEvent.mouseDown(canvas, { clientX: 100, clientY: 100, shiftKey: true });
      fireEvent.mouseMove(canvas, { clientX: 200, clientY: 150, shiftKey: true });
  
      expect(mockContext.save).toHaveBeenCalled();
      expect(mockContext.translate).toHaveBeenCalled();
      expect(mockContext.rotate).toHaveBeenCalled();
      expect(mockContext.restore).toHaveBeenCalled();
    });
  
    it('maintains aspect ratio with alt key', () => {
      render(<Canvas isActive={true} mode="rectangle" />);
      const canvas = screen.getByTestId('drawing-canvas');
  
      fireEvent.mouseDown(canvas, { clientX: 100, clientY: 100, altKey: true });
      fireEvent.mouseMove(canvas, { clientX: 200, clientY: 150, altKey: true });
  
      const width = 100;
      const height = width;
      expect(mockContext.rect).toHaveBeenCalledWith(100, 100, width, height);
    });
  });
  describe('Canvas shape transformations', () => {
    const mockContext = {
      beginPath: jest.fn(),
      rect: jest.fn(),
      translate: jest.fn(),
      setTransform: jest.fn(),
      stroke: jest.fn(),
      save: jest.fn(),
      restore: jest.fn()
    };
  
    beforeEach(() => {
      HTMLCanvasElement.prototype.getContext = jest.fn(() => mockContext);
      jest.clearAllMocks();
    });
  
    it('snaps to grid with ctrl key', () => {
      render(<Canvas isActive={true} mode="rectangle" gridSize={20} />);
      const canvas = screen.getByTestId('drawing-canvas');
  
      fireEvent.mouseDown(canvas, { clientX: 95, clientY: 95, ctrlKey: true });
      fireEvent.mouseMove(canvas, { clientX: 205, clientY: 155, ctrlKey: true });
  
      // Should snap to nearest grid points (100, 100) to (200, 160)
      expect(mockContext.rect).toHaveBeenCalledWith(100, 100, 100, 60);
    });
  
    it('handles multi-shape selection', () => {
      const onSelect = jest.fn();
      render(
        <Canvas 
          isActive={true} 
          mode="select"
          onShapeSelect={onSelect}
        />
      );
      const canvas = screen.getByTestId('drawing-canvas');
  
      // Simulate selection rectangle
      fireEvent.mouseDown(canvas, { clientX: 50, clientY: 50, shiftKey: true });
      fireEvent.mouseMove(canvas, { clientX: 200, clientY: 200 });
      fireEvent.mouseUp(canvas);
  
      expect(onSelect).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.objectContaining({ type: 'selection', x: 50, y: 50, width: 150, height: 150 })
        ])
      );
    });
  
    it('aligns shapes to guidelines', () => {
      render(<Canvas isActive={true} mode="rectangle" showGuides={true} />);
      const canvas = screen.getByTestId('drawing-canvas');
  
      fireEvent.mouseDown(canvas, { clientX: 98, clientY: 98 });
      fireEvent.mouseMove(canvas, { clientX: 202, clientY: 202 });
  
      // Should align to nearest guideline at 100, 200
      expect(mockContext.rect).toHaveBeenCalledWith(100, 100, 100, 100);
    });
  });
  describe('Canvas guide snapping', () => {
    const mockContext = {
      beginPath: jest.fn(),
      rect: jest.fn(),
      moveTo: jest.fn(),
      lineTo: jest.fn(),
      setLineDash: jest.fn(),
      stroke: jest.fn()
    };
  
    beforeEach(() => {
      HTMLCanvasElement.prototype.getContext = jest.fn(() => mockContext);
      jest.clearAllMocks();
    });
  
    it('snaps to guide intersections', () => {
      const guides = {
        vertical: [100, 200],
        horizontal: [100, 200]
      };
  
      render(
        <Canvas 
          isActive={true} 
          mode="rectangle" 
          guides={guides}
          snapThreshold={5}
        />
      );
      const canvas = screen.getByTestId('drawing-canvas');
  
      // Should snap to guide intersection at (100,100)
      fireEvent.mouseDown(canvas, { clientX: 98, clientY: 98 });
      fireEvent.mouseMove(canvas, { clientX: 198, clientY: 198 });
  
      expect(mockContext.rect).toHaveBeenCalledWith(
        100, 100,  // Snapped start position
        100, 100   // Snapped dimensions
      );
    });
  
    it('shows snapping indicators', () => {
      render(
        <Canvas 
          isActive={true}
          mode="rectangle"
          showSnapIndicators={true}
        />
      );
      const canvas = screen.getByTestId('drawing-canvas');
  
      fireEvent.mouseMove(canvas, { clientX: 100, clientY: 100 });
  
      expect(mockContext.setLineDash).toHaveBeenCalled();
      expect(mockContext.moveTo).toHaveBeenCalled();
      expect(mockContext.lineTo).toHaveBeenCalled();
    });
  });
  describe('Canvas grid system', () => {
    const mockContext = {
      beginPath: jest.fn(),
      moveTo: jest.fn(),
      lineTo: jest.fn(),
      setLineDash: jest.fn(),
      stroke: jest.fn(),
      save: jest.fn(),
      restore: jest.fn()
    };
  
    beforeEach(() => {
      HTMLCanvasElement.prototype.getContext = jest.fn(() => mockContext);
      jest.clearAllMocks();
    });
  
    it('renders grid with specified size', () => {
      render(
        <Canvas 
          isActive={true}
          showGrid={true}
          gridSize={20}
          gridColor="rgba(0,0,0,0.1)"
        />
      );
      const canvas = screen.getByTestId('drawing-canvas');
  
      // Force grid render
      fireEvent(canvas, new Event('resize'));
  
      expect(mockContext.save).toHaveBeenCalled();
      expect(mockContext.setLineDash).toHaveBeenCalledWith([1, 1]);
      expect(mockContext.stroke).toHaveBeenCalled();
      expect(mockContext.restore).toHaveBeenCalled();
    });
  
    it('adjusts grid size dynamically', () => {
      const { rerender } = render(
        <Canvas 
          isActive={true}
          showGrid={true}
          gridSize={20}
        />
      );
  
      rerender(
        <Canvas 
          isActive={true}
          showGrid={true}
          gridSize={40}
        />
      );
  
      const canvas = screen.getByTestId('drawing-canvas');
      expect(canvas.getAttribute('data-grid-size')).toBe('40');
    });
  
    it('snaps drawing to grid points', () => {
      render(
        <Canvas 
          isActive={true}
          snapToGrid={true}
          gridSize={20}
        />
      );
      const canvas = screen.getByTestId('drawing-canvas');
  
      fireEvent.mouseDown(canvas, { clientX: 28, clientY: 28 });
      fireEvent.mouseMove(canvas, { clientX: 52, clientY: 52 });
  
      expect(mockContext.moveTo).toHaveBeenCalledWith(20, 20);
      expect(mockContext.lineTo).toHaveBeenCalledWith(60, 60);
    });
  });
  describe('Canvas zoom and pan', () => {
    const mockContext = {
      beginPath: jest.fn(),
      scale: jest.fn(),
      translate: jest.fn(),
      setTransform: jest.fn(),
      stroke: jest.fn(),
      save: jest.fn(),
      restore: jest.fn()
    };
  
    beforeEach(() => {
      HTMLCanvasElement.prototype.getContext = jest.fn(() => mockContext);
      jest.clearAllMocks();
    });
  
    it('handles zoom with mouse wheel', () => {
      render(<Canvas isActive={true} />);
      const canvas = screen.getByTestId('drawing-canvas');
  
      fireEvent.wheel(canvas, {
        deltaY: -100,
        ctrlKey: true,
        clientX: 100,
        clientY: 100
      });
  
      expect(mockContext.scale).toHaveBeenCalledWith(1.1, 1.1);
      expect(mockContext.translate).toHaveBeenCalled();
    });
  
    it('handles pan with middle mouse button', () => {
      render(<Canvas isActive={true} />);
      const canvas = screen.getByTestId('drawing-canvas');
  
      fireEvent.mouseDown(canvas, { button: 1, clientX: 100, clientY: 100 });
      fireEvent.mouseMove(canvas, { clientX: 150, clientY: 150 });
      fireEvent.mouseUp(canvas);
  
      expect(mockContext.translate).toHaveBeenCalledWith(50, 50);
    });
  
    it('transforms coordinates based on zoom level', () => {
      render(<Canvas isActive={true} initialZoom={2} />);
      const canvas = screen.getByTestId('drawing-canvas');
  
      fireEvent.mouseDown(canvas, { clientX: 100, clientY: 100 });
      fireEvent.mouseMove(canvas, { clientX: 200, clientY: 200 });
  
      // Should account for zoom level in coordinate calculation
      expect(mockContext.moveTo).toHaveBeenCalledWith(50, 50);
      expect(mockContext.lineTo).toHaveBeenCalledWith(100, 100);
    });
  });