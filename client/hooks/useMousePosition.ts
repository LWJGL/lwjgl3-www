import { useState, useEffect } from 'react';

type XY = [number, number];

export function useMousePosition() {
  const [state, setState] = useState<XY>([0, 0]);

  useEffect(() => {
    const handler = ({ clientX, clientY }: MouseEvent) => setState([clientX, clientY]);
    window.addEventListener('mousemove', handler);
    return () => window.removeEventListener('mousemove', handler);
  }, []);

  return state;
}
