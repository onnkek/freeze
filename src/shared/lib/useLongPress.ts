import { useCallback, useRef, useEffect } from 'react';

interface UseLongPressOptions {
  threshold?: number;
}

export function useLongPress(
  onLongPress: () => void,
  options: UseLongPressOptions = {}
) {
  const timeoutRef = useRef<number | null>(null); // number вместо NodeJS.Timeout
  const startRef = useRef<boolean>(false);

  const start = useCallback((event: React.MouseEvent | React.TouchEvent) => {
    event.preventDefault();
    startRef.current = true;
    timeoutRef.current = window.setTimeout(() => {
      if (startRef.current) {
        onLongPress();
      }
    }, options.threshold || 500);
  }, [onLongPress, options.threshold]);

  const end = useCallback((event: React.MouseEvent | React.TouchEvent) => {
    event.preventDefault();
    startRef.current = false;
    if (timeoutRef.current !== null) {
      window.clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  useEffect(() => {
    return () => {
      if (timeoutRef.current !== null) {
        window.clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return {
    onMouseDown: start,
    onMouseUp: end,
    onMouseLeave: end,
    onTouchStart: start,
    onTouchEnd: end,
  };
}