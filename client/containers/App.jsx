// @flow
import * as React from 'react';
import { BrowserRouter } from 'react-router-dom';
import Layout from './Layout';

// Pull common modules that we want preloaded in the main chunk
import 'emotion';
import 'react-emotion';
import '~/store/Connect';
import './PageView';

const supportsHistory = 'pushState' in window.history;

const App = () => (
  <BrowserRouter forceRefresh={!supportsHistory} keyLength={12}>
    <Layout />
  </BrowserRouter>
);

export default App;
