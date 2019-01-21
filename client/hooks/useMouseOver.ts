import { useState, useEffect } from 'react';

export function useMouseOver(ref: React.RefObject<HTMLElement>) {
  const [value, setValue] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (node !== null) {
      const handleMouseOver = () => setValue(true);
      const handleMouseOut = () => setValue(false);

      node.addEventListener('mouseover', handleMouseOver);
      node.addEventListener('mouseout', handleMouseOut);

      return () => {
        node.removeEventListener('mouseover', handleMouseOver);
        node.removeEventListener('mouseout', handleMouseOut);
      };
    }
  }, [ref.current]);

  return [value];
}
