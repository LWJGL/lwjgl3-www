// @flow
import * as React from 'react';
import { Layout } from './Layout';
import { BreakpointProvider } from '../components/Breakpoint';
import { ServiceWorkerProvider } from '../components/ServiceWorker';

const App = () => (
  <ServiceWorkerProvider>
    <BreakpointProvider>
      <Layout />
    </BreakpointProvider>
  </ServiceWorkerProvider>
);

export default App;
