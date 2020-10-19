import { useEffect } from 'react';
import { Layout } from './Layout';
import { BreakpointProvider } from '~/components/Breakpoint';
import { OverlayProvider } from '@react-aria/overlays';

// Pull common modules on main bundle
import '~/components/routes/PageView';
import '~/components/HashLinkTarget';

// Animation
import { Globals } from '@react-spring/web';
import { useMedia } from '~/hooks/useMedia';

// Do this on a separate component to avoid re-rendering the app
const Spring: React.FC<{ children?: never }> = () => {
  // Disable animations globally if reduce motion is enabled
  const prefersReducedMotion = useMedia('(prefers-reduced-motion: reduce)');

  useEffect(() => {
    Globals.assign({
      skipAnimation: prefersReducedMotion,
    });
  }, [prefersReducedMotion]);

  return null;
};

export const App: React.FC<{ children?: never }> = () => (
  <BreakpointProvider>
    <OverlayProvider>
      <Spring />
      <Layout />
    </OverlayProvider>
  </BreakpointProvider>
);
