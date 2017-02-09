import 'regenerator-runtime/runtime'
import React from 'react'
import { render } from 'react-dom'
import nprogress from 'nprogress'
import { detect } from './services/env'
import configureStore from './store/configureStore'
import App from './containers/App'
import './services/ga'

export default function() {

  // Inject global styles
  const styles = require('./styles/layout.scss');
  styles.use();

  // Device detection
  detect();

  // Hide spinner from nprogress
  nprogress.configure({
    showSpinner: false
  });

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
}
