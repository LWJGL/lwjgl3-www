// @flow
import * as React from 'react';
import { Layout } from './Layout';
import { BreakpointProvider } from '../components/Breakpoint';

// Pull common modules that we want preloaded in the main chunk
import '../components/icons/Icon';
import './PageView';

const App = () => (
  <BreakpointProvider>
    <Layout />
  </BreakpointProvider>
);

export default App;
