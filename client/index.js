if (!FLAG_PRODUCTION && FLAG_HMR) {
  // Inject React Refresh
  const runtime = require('react-refresh/runtime');
  runtime.injectIntoGlobalHook(window);
  window.$RefreshReg$ = () => {};
  window.$RefreshSig$ = () => type => type;
}

require('./main');
