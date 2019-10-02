import React from 'react';
import { Layout } from './Layout';
import { BreakpointProvider } from '~/components/Breakpoint';

// Pull common modules on main bundle
import '~/components/routes/PageView';
import '~/components/HashLinkTarget';

export const App: React.FC<{ children?: never }> = () => (
  <BreakpointProvider>
    <Layout />
  </BreakpointProvider>
);
