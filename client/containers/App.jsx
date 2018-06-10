// @flow
import * as React from 'react';
import { Layout } from './Layout';
import { BreakpointProvider } from '../components/Breakpoint';

const App = () => (
  <BreakpointProvider>
    <Layout />
  </BreakpointProvider>
);

export default App;
