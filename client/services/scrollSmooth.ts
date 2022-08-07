const SUPPORTS_SMOOTH_SCROLL = document.body != null && 'scrollBehavior' in document.body.style;

export function scrollSmooth(x: number, y: number) {
  if (SUPPORTS_SMOOTH_SCROLL) {
    scroll({
      top: y,
      left: x,
      behavior: 'smooth',
    });
  } else {
    scroll(x, y);
  }
}
