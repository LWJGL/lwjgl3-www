// @flow
import * as React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Layout } from './Layout';

// Pull common modules that we want preloaded in the main chunk
import 'emotion';
import './PageView';

const supportsHistory = 'pushState' in window.history;

const App = () => (
  <BrowserRouter forceRefresh={!supportsHistory} keyLength={12}>
    <Layout />
  </BrowserRouter>
);

// import { hot } from 'react-hot-loader';
// export default hot(module)(App);
export default App;
