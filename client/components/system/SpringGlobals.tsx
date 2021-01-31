import { useEffect } from 'react';
import { Globals } from '@react-spring/web';
import { useMedia } from '~/hooks/useMedia';

export const Spring: React.FC<{ children?: never }> = () => {
  // Disable animations globally if reduce motion is enabled
  const prefersReducedMotion = useMedia('(prefers-reduced-motion: reduce)');

  useEffect(() => {
    Globals.assign({
      skipAnimation: prefersReducedMotion,
    });
  }, [prefersReducedMotion]);

  return null;
};
