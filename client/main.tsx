import { createRoot } from 'react-dom';
import { App } from './app';
// import './services/ga';
// Force polyfill injection for older versions of Safari and other browsers
globalThis;

const rootEl = document.getElementById('app-root');
if (rootEl !== null) {
  rootEl.innerHTML = '';
  const root = createRoot(rootEl, {
    //@ts-expect-error
    unstable_strictMode: true,
    // unstable_concurrentUpdatesByDefault: true,
  });
  root.render(<App />);
}
