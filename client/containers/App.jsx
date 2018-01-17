// @flow
import * as React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Layout } from './Layout';
import { hot } from 'react-hot-loader';

// Pull common modules that we want preloaded in the main chunk
import 'emotion';
import 'react-emotion';
// import '~/store/Connect';
import './PageView';

const supportsHistory = 'pushState' in window.history;

const AppComponent = () => (
  <BrowserRouter forceRefresh={!supportsHistory} keyLength={12}>
    <Layout />
  </BrowserRouter>
);

export const App = hot(module)(AppComponent);
