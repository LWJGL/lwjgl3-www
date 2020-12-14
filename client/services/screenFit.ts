/*
  Adopted from:
  https://github.com/WebReflection/screenfit
  (c) Andrea Giammarchi - ISC
*/

export const viewport = window.visualViewport || {
  addEventListener: self.addEventListener.bind(self),
  get width() {
    return self.innerWidth; // ? Maybe use document.body.scrollWidth here
  },
  get height() {
    return self.innerHeight;
  },
};

function resize() {
  document.body.style.height = viewport.height + 'px';
  // scrollTo(0, 0); // Needed for Windows Phone
  // setTimeout(scrollTo, 300, 0, 0);
  dispatchEvent(
    new CustomEvent('screenfit', {
      detail: viewport,
    })
  );
}

document.addEventListener('DOMContentLoaded', resize, {
  once: true,
});

viewport.addEventListener('resize', resize);
