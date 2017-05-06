import React from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import Layout from './Layout';

const supportsHistory = 'pushState' in window.history;

type Props = {
  store: any,
};

const App = ({ store }: Props) => (
  <Provider store={store}>
    <BrowserRouter forceRefresh={!supportsHistory} keyLength={12}>
      <Layout />
    </BrowserRouter>
  </Provider>
);

export default App;
