// src/hooks/__tests__/useToolManager.test.ts
import { renderHook, act } from '@testing-library/react';
import { useToolManager } from '../useToolManager';
import { Tool } from '../../components/Board/types';

describe('useToolManager', () => {
  const mockSetActiveTool = jest.fn();
  
  beforeEach(() => {
    mockSetActiveTool.mockClear();
    jest.clearAllMocks();
  });

  it('handles keyboard shortcuts correctly', () => {
    renderHook(() => useToolManager('text' as Tool, mockSetActiveTool));

    // Test text tool shortcut
    act(() => {
      window.dispatchEvent(new KeyboardEvent('keydown', {
        key: 't',
        ctrlKey: true
      }));
    });
    expect(mockSetActiveTool).toHaveBeenCalledWith('text');

    // Test image tool shortcut
    act(() => {
      window.dispatchEvent(new KeyboardEvent('keydown', {
        key: 'i',
        ctrlKey: true
      }));
    });
    expect(mockSetActiveTool).toHaveBeenCalledWith('image');
  });

  it('provides correct shortcuts object', () => {
    const { result } = renderHook(() => 
      useToolManager('text' as Tool, mockSetActiveTool)
    );

    expect(result.current.shortcuts).toEqual({
      text: 'Ctrl/⌘ + T',
      image: 'Ctrl/⌘ + I',
      draw: 'Ctrl/⌘ + D'
    });
  });

  it('cleans up event listeners on unmount', () => {
    const removeEventListenerSpy = jest.spyOn(window, 'removeEventListener');
    const { unmount } = renderHook(() => 
      useToolManager('text' as Tool, mockSetActiveTool)
    );

    unmount();
    expect(removeEventListenerSpy).toHaveBeenCalled();
  });
});
// Continue in src/hooks/__tests__/useToolManager.test.ts
}));
});
expect(mockSetActiveTool).toHaveBeenCalledWith('text');

// Test with meta key (for Mac)
act(() => {
  window.dispatchEvent(new KeyboardEvent('keydown', {
    key: 'i',
    metaKey: true
  }));
});
expect(mockSetActiveTool).toHaveBeenCalledWith('image');

// Test draw tool shortcut
act(() => {
  window.dispatchEvent(new KeyboardEvent('keydown', {
    key: 'd',
    ctrlKey: true
  }));
});
expect(mockSetActiveTool).toHaveBeenCalledWith('draw');
});

it('ignores non-tool shortcuts', () => {
renderHook(() => useToolManager('text' as Tool, mockSetActiveTool));

act(() => {
  window.dispatchEvent(new KeyboardEvent('keydown', {
    key: 'x',
    ctrlKey: true
  }));
});

expect(mockSetActiveTool).not.toHaveBeenCalled();
});

it('switches tools via switchTool method', () => {
const { result } = renderHook(() => 
  useToolManager('text' as Tool, mockSetActiveTool)
);

act(() => {
  result.current.switchTool('image' as Tool);
});

expect(mockSetActiveTool).toHaveBeenCalledWith('image');
});

it('prevents default browser shortcuts', () => {
const preventDefault = jest.fn();
renderHook(() => useToolManager('text' as Tool, mockSetActiveTool));

act(() => {
  window.dispatchEvent(new KeyboardEvent('keydown', {
    key: 't',
    ctrlKey: true,
    preventDefault
  }));
});

expect(preventDefault).toHaveBeenCalled();
});
});