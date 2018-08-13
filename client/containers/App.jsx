// @flow
import * as React from 'react';
import { Layout } from './Layout';
import { BreakpointProvider } from '../components/Breakpoint';
import { ServiceWorkerProvider } from '../components/ServiceWorker';

// Pull common modules on main bundle
import './PageView';
import '../components/Head';
import '../components/Title';
import '../components/HashLinkTarget';

const App = () => (
  <ServiceWorkerProvider>
    <BreakpointProvider>
      <Layout />
    </BreakpointProvider>
  </ServiceWorkerProvider>
);

export default App;
