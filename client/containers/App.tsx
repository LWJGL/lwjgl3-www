import { Layout } from './Layout';
import { BreakpointProvider } from '~/components/Breakpoint';
import { OverlayProvider } from '@react-aria/overlays';

// Pull common modules on main bundle
import '~/components/routes/PageView';
import '~/components/HashLinkTarget';

export const App: React.FC<{ children?: never }> = () => (
  <BreakpointProvider>
    <OverlayProvider>
      <Layout />
    </OverlayProvider>
  </BreakpointProvider>
);
