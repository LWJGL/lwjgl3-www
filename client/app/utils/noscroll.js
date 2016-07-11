let scrollbarSize = null;

function getScrollbarSize() {
  if ( scrollbarSize === null ) {

    let dummyScroller = document.createElement('div');
    dummyScroller.setAttribute('style', 'width:99px;height:99px;position:absolute;top:-9999px;overflow:scroll');
    document.body.appendChild(dummyScroller);
    scrollbarSize = dummyScroller.offsetWidth - dummyScroller.clientWidth;
    document.body.removeChild(dummyScroller);
  }

  return scrollbarSize;
}

function hasScrollbar() {
  return document.body.scrollHeight > window.innerHeight;
}

export function on() {
  if ( hasScrollbar() ) {
    document.body.style.paddingRight = getScrollbarSize() + 'px';
    document.getElementsByTagName('header')[0].style.paddingRight = getScrollbarSize() + 'px';
  }
  document.body.style.overflow = 'hidden';
}

export function off() {
  document.body.style.paddingRight = 0;
  document.getElementsByTagName('header')[0].style.paddingRight = 0;
  document.body.style.overflow = 'auto';
}
