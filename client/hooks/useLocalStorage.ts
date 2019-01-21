import { useState, useCallback } from 'react';

export function useLocalStorage<T>(key: string, initialValue: T) {
  const [keyValue, setKeyValue] = useState<T>(() => {
    try {
      let value = window.localStorage.getItem(key);
      return value !== null ? JSON.parse(value) : initialValue;
    } catch (error) {
      // Return default value if JSON parsing fails
      return initialValue;
    }
  });

  // Wrap in useCallback so the wrapped function is reused
  const setValue = useCallback((value: T) => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      // TODO: What should we do here?
      // Example: quota limit reached
    }
    setKeyValue(value);
  }, [setKeyValue]);

  return [keyValue, setValue];
}
