// @flow
import * as React from 'react';
// import { render } from 'react-dom';
//$FlowFixMe
import { createRoot } from 'react-dom';
import App from './containers/App';
// import App from './RHL';
import './services/ga';

export function mount() {
  const rootEl = document.getElementById('lwjgl-app');
  if (rootEl !== null) {
    // render(<App />, rootEl);
    rootEl.innerHTML = '';
    createRoot(rootEl).render(<App />);
  }
}
