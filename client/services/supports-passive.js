let supportsPassive = false;

if ( process.browser ) {
  try {
    let opts = Object.defineProperty({}, 'passive', {
      get: function() {
        supportsPassive = true;
      }
    });
    //noinspection JSCheckFunctionSignatures
    window.addEventListener('test', null, opts);
  } catch (ignore) {
  }
}

export default supportsPassive;
