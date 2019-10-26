import React from 'react';
// import { render } from 'react-dom';
import { createRoot } from 'react-dom';
import { App } from './containers/App';
// import './services/ga';

export function mount() {
  const rootEl = document.body;
  if (rootEl !== null) {
    rootEl.innerHTML = '';
    // render(<App />, rootEl);
    createRoot(rootEl).render(<App />);
  }
}
