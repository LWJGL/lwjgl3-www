import React from 'react'
import {render} from 'react-dom'
import {AppContainer} from 'react-hot-loader'
import {StyleSheet} from 'aphrodite/no-important'
import nprogress from 'nprogress'
import {calculateResponsiveState} from 'redux-responsive'

import configureStore from './store/configureStore'
import App from './containers/App'
import './utils/ga'

// Hide spinner from nprogress
nprogress.configure({
  showSpinner: false
});

// Re-hydrate Aphrodite from server-generated class names
const rehydrateFrom = document.getElementById('aphro-hydrate');
if ( rehydrateFrom ) {
  StyleSheet.rehydrate(JSON.parse(rehydrateFrom.innerHTML));
}

// Configure Redux store
const store = configureStore();
store.dispatch(calculateResponsiveState(window));

// Render React
const rootEl = document.getElementById('lwjgl-app');
render((
  <AppContainer>
    <App store={store} />
  </AppContainer>
), rootEl);

// Hot Reloading
if ( module.hot ) {
  module.hot.accept('./containers/App', () => {
    render(
      <AppContainer>
        <App store={store} />
      </AppContainer>,
      rootEl
    );
  });
}
