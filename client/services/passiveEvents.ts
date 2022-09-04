const passiveOpts = { passive: true };
let flag: boolean = false;

// We need to run this on import to make sure it's computed before the polyfill is called.
try {
  let opts = Object.defineProperty({}, 'passive', {
    get: function () {
      flag = true;
    },
  });
  let emptyFn = () => {};
  addEventListener('test', emptyFn, opts);
  removeEventListener('test', emptyFn, opts);
} catch (ignore) {}

export function supportsPassiveEvents(): boolean {
  return flag;
}

export function getPassiveOptions(): boolean | AddEventListenerOptions {
  return supportsPassiveEvents() ? passiveOpts : false;
}
