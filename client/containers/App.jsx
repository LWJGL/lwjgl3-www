import * as React from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import Layout from './Layout';

const supportsHistory = 'pushState' in window.history;

// Pull common modules that we want preloaded in the main chunk
import './PageView';
import '../components/Style';

type Props = {
  store: any,
};

const App = ({ store }: Props) =>
  <Provider store={store}>
    <BrowserRouter forceRefresh={!supportsHistory} keyLength={12}>
      <Layout />
    </BrowserRouter>
  </Provider>;

export default App;
