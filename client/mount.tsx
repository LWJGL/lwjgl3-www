import { unstable_createRoot } from 'react-dom';
import { App } from './containers/App';
import './services/ga';

export function mount(): void {
  const rootEl = document.getElementById('app-root');
  if (rootEl !== null) {
    rootEl.innerHTML = '';
    unstable_createRoot(rootEl).render(<App />);
  }
}
