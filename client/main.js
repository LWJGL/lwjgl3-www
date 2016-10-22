import React from 'react'
import { render } from 'react-dom'
import { StyleSheet } from 'aphrodite/no-important'
import nprogress from 'nprogress'

import configureStore from './store/configureStore'
import App from './containers/App'
import './services/ga'
import preserver from './routes/Preserver'

// Hide spinner from nprogress
nprogress.configure({
  showSpinner: false
});

// Re-hydrate Aphrodite from server-generated class names
const rehydrateFrom = document.getElementById('aphro-hydrate');
if ( rehydrateFrom ) {
  StyleSheet.rehydrate(JSON.parse(rehydrateFrom.innerHTML));
}

// Re-hydrate routes HTML
const routesRootEl = document.getElementById('lwjgl-routes');
if ( routesRootEl && process.env.NODE_ENV === 'production' ) {
  preserver.store(routesRootEl.innerHTML);
}

// Configure Redux store
const store = configureStore();

// Render React
const rootEl = document.getElementById('lwjgl-app');

if ( process.env.NODE_ENV === 'production' ) {
  render(<App store={store} />, rootEl);
} else {
  const AppContainer = require('react-hot-loader').AppContainer;
  // Trick babel to avoid hoisting <AppContainer />
  // transform-react-constant-elements
  const noHoist = {};

  render((
    <AppContainer {...noHoist}>
      <App store={store} />
    </AppContainer>
  ), rootEl);

  // Hot Reloading
  if ( module.hot ) {
    module.hot.accept('./containers/App', () => {
      render(
        <AppContainer {...noHoist}>
          <App store={store} />
        </AppContainer>,
        rootEl
      );
    });
  }
}
