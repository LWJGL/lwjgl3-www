import { createRoot } from 'react-dom';
import { App } from './app';
// import './services/ga';

const rootEl = document.getElementById('app-root');
if (rootEl !== null) {
  rootEl.innerHTML = '';
  const root = createRoot(rootEl, {
    unstable_strictMode: true,
    unstable_concurrentUpdatesByDefault: true,
  });
  root.render(<App />);
}
