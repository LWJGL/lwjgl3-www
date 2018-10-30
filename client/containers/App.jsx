// @flow
import * as React from 'react';
import { Layout } from './Layout';
import { BreakpointProvider } from '../components/Breakpoint';
import { ServiceWorkerProvider } from '../components/ServiceWorker';
import { NavProgressProvider } from '../components/NavProgress';

// Pull common modules on main bundle
import '../components/routes/PageView';
import '../components/HashLinkTarget';

export default function App() {
  return (
    <ServiceWorkerProvider>
      <BreakpointProvider>
        <NavProgressProvider>
          <Layout />
        </NavProgressProvider>
      </BreakpointProvider>
    </ServiceWorkerProvider>
  );
}
