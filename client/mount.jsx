// @flow
import * as React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import store from './store';
import App from './containers/App';
import './services/ga';

export default function() {
  // Render React
  const rootEl = document.getElementById('lwjgl-app');

  if (process.env.NODE_ENV === 'production' || NOHMR) {
    render(
      <Provider store={store}>
        <App />
      </Provider>,
      rootEl
    );
  } else {
    // HMR
    const AppContainer = require('react-hot-loader').AppContainer;
    const mount = (Component: React.ComponentType<any>) => {
      render(
        <AppContainer>
          <Provider store={store}>
            <Component />
          </Provider>
        </AppContainer>,
        rootEl
      );
    };

    mount(App);

    if (module.hot) {
      module.hot.accept('./containers/App', () => {
        mount(App);
      });
    }
  }
}
