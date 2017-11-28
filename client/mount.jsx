// @flow
import * as React from 'react';
import { render } from 'react-dom';
import { store } from './store';
import { App } from './containers/App';
import './services/ga';

export function mount() {
  // Render React
  const rootEl = document.getElementById('lwjgl-app');

  if (rootEl === null) {
    return;
  }

  if (process.env.NODE_ENV === 'production' || NOHMR) {
    render(<App />, rootEl);
  } else {
    // HMR
    const AppContainer = require('react-hot-loader').AppContainer;
    const mount = (Component: React.ComponentType<any>) => {
      render(
        // <AppContainer key={Math.random()}>
        <AppContainer>
          <Component />
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
