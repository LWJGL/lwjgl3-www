import React from 'react';
import { Layout } from './Layout';
import { BreakpointProvider } from '../components/Breakpoint';
import { hot } from 'react-hot-loader/root';

// Pull common modules on main bundle
import '../components/routes/PageView';
import '../components/HashLinkTarget';

const App = () => (
  <BreakpointProvider>
    <Layout />
  </BreakpointProvider>
);

export default hot(App);
