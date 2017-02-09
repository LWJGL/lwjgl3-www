import React from 'react'
import { Provider } from 'react-redux'
import BrowserRouter from 'react-router-dom/BrowserRouter'
import Layout from './Layout'

const supportsHistory = 'pushState' in window.history;

const App = (props) => (
  <Provider store={props.store}>
    <BrowserRouter forceRefresh={!supportsHistory} keyLength={12}>
      <Layout />
    </BrowserRouter>
  </Provider>
);

App.propTypes = {
  store: React.PropTypes.object.isRequired
};

export default App;
