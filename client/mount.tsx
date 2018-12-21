import React from 'react';
import { createRoot } from 'react-dom';
import App from './containers/App';
import './services/ga';

export function mount() {
  const rootEl = document.getElementById('lwjgl-app');
  if (rootEl !== null) {
    rootEl.innerHTML = '';
    createRoot(rootEl).render(<App />);
  }
}
