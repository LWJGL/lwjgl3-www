import { unstable_createRoot } from 'react-dom';
import { App } from './app';
// import './services/ga';

const rootEl = document.getElementById('app-root');
if (rootEl !== null) {
  rootEl.innerHTML = '';
  const root = unstable_createRoot(rootEl, {
    //@ts-expect-error
    unstable_concurrentUpdatesByDefault: true,
  });
  root.render(<App />);
}
