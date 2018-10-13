// @flow
import * as React from 'react';
// import { render } from 'react-dom';
//$FlowFixMe
import { unstable_createRoot } from 'react-dom';
// import App from './containers/App';
//$FlowFixMe
import App from './RHL';
import './services/ga';

export function mount() {
  const rootEl = document.getElementById('lwjgl-app');
  if (rootEl !== null) {
    // render(<App />, rootEl);
    rootEl.innerHTML = '';
    unstable_createRoot(rootEl).render(<App />);
  }
}
