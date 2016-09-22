import React from 'react'
import {render} from 'react-dom'
import {AppContainer} from 'react-hot-loader'
// import useScroll from 'react-router-scroll/lib/useScroll';
import {StyleSheet} from 'aphrodite/no-important'
import nprogress from 'nprogress'

import App from './ui/App'
import preserver from './routes/Preserver'
import './utils/ga'

// Hide spinner from nprogress
nprogress.configure({
  showSpinner: false
});

// Re-hydrate Aphrodite from server-generated class names
if ( process.browser ) {
  let rehydrateFrom = document.getElementById('aphro-hydrate');
  if ( rehydrateFrom ) {
    StyleSheet.rehydrate(JSON.parse(rehydrateFrom.innerHTML));
  }
}

const rootEl = document.getElementById('lwjgl-app');

preserver.store(document.getElementById('lwjgl-routes').innerHTML);

render((
  <AppContainer>
    <App />
  </AppContainer>
), rootEl);

if ( module.hot ) {
  module.hot.accept('./ui/App', () => {
    render(
      <AppContainer>
        <App />
      </AppContainer>,
      rootEl
    );
  });
}