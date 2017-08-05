import React from 'react';
import { render } from 'react-dom';
import nprogress from 'nprogress';
import store from './store';
import App from './containers/App';
import './services/ga';

export default function() {
  // Inject global styles
  const styles = require('./styles/layout.scss');
  styles.use();

  // Hide spinner from nprogress
  nprogress.configure({
    showSpinner: false,
  });

  // Render React
  const rootEl = document.getElementById('lwjgl-app');

  if (process.env.NODE_ENV === 'production' || NOHMR) {
    render(<App store={store} />, rootEl);
  } else {
    const AppContainer = require('react-hot-loader').AppContainer;
    // Trick babel to avoid hoisting <AppContainer />
    // transform-react-constant-elements
    const noHoist = {};

    render(
      <AppContainer {...noHoist}>
        <App store={store} />
      </AppContainer>,
      rootEl
    );

    // Hot Reloading
    if (module.hot) {
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
