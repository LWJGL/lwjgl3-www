import { useState, useEffect } from 'react';

export function useMouseOver(ref: React.RefObject<HTMLElement>) {
  const [value, setValue] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (node !== null) {
      const handleMouseEnter = () => setValue(true);
      const handleMouseLeave = () => setValue(false);

      node.addEventListener('mouseenter', handleMouseEnter);
      node.addEventListener('mouseleave', handleMouseLeave);

      return () => {
        node.removeEventListener('mouseenter', handleMouseEnter);
        node.removeEventListener('mouseleave', handleMouseLeave);
      };
    }
  }, [ref.current]);

  return [value];
}
