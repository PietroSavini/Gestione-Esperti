import { useEffect, useRef, useCallback } from 'react';

// Funzione di debounce
export function debounce<T extends (...args: any[]) => void>(func: T, wait: number): (...args: Parameters<T>) => void {
    let timeout: ReturnType<typeof setTimeout>;
    return function (this: any, ...args: Parameters<T>) {
      const context = this;
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(context, args), wait);
    };
  }
  

// Custom hook
function useDebounce<T extends (...args: any[]) => void>(callback: T, delay: number): T {
    const callbackRef = useRef(callback);
  
    // Aggiorna il riferimento alla callback se cambia
    useEffect(() => {
      callbackRef.current = callback;
    }, [callback]);
  
    const debouncedCallback = useCallback(debounce(((...args) => callbackRef.current(...args)) as T, delay), [delay]);
  
    return debouncedCallback as unknown as T;
  }

export default useDebounce;