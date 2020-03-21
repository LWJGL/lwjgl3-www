import { createRoot } from 'react-dom';
import { App } from './containers/App';
// import './services/ga';

export function mount() {
  const rootEl = document.getElementById('app-root');
  if (rootEl !== null) {
    rootEl.innerHTML = '';
    createRoot(rootEl).render(<App />);
  }
}
