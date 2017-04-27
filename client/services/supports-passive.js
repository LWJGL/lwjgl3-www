let supportsPassive = false;

try {
  // $FlowFixMe
  let opts = Object.defineProperty({}, 'passive', {
    get: function() {
      supportsPassive = true;
    },
  });
  // $FlowFixMe
  window.addEventListener('test', null, opts);
} catch (ignore) {}

export default supportsPassive;
