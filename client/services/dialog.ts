export let supportsDialog = (): boolean => {
  if ('document' in globalThis) {
    let dialog = document.createElement('dialog');
    if (typeof dialog.showModal === 'function') {
      supportsDialog = () => true;
      return true;
    }
  }

  supportsDialog = () => false;
  return false;
};
