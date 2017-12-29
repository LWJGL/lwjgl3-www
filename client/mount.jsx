// @flow
import * as React from 'react';
import { render } from 'react-dom';
import { App } from './containers/App';
import './services/ga';

export function mount() {
  const rootEl = document.getElementById('lwjgl-app');
  if (rootEl !== null) {
    render(<App />, rootEl);
  }
}
