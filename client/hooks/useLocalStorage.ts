import { useState, useCallback } from 'react';

type HookSignature<T> = [T, (value: T) => void];

export function useLocalStorage<T>(key: string, initialValue: T): HookSignature<T> {
  const [keyValue, setKeyValue] = useState<T>(() => {
    try {
      let value = localStorage.getItem(key);
      return value !== null ? JSON.parse(value) : initialValue;
    } catch (error) {
      // Return default value if JSON parsing fails
      return initialValue;
    }
  });

  // Wrap in useCallback so the wrapped function is reused
  const setValue = useCallback(
    (value: T) => {
      try {
        localStorage.setItem(key, JSON.stringify(value));
      } catch (e) {
        // TODO: What should we do here?
        // Example: quota limit reached
      }
      setKeyValue(value);
    },
    [key, setKeyValue]
  );

  return [keyValue, setValue];
}
