let stackCnt = 0;
let scrollbarSize: number = -1;

export const getScrollbarSize = (): number => {
  if (scrollbarSize === -1) {
    let dummyScroller = document.createElement('div');
    dummyScroller.setAttribute('style', 'width:99px;height:99px;position:absolute;top:-9999px;overflow:scroll');
    // $FlowFixMe
    document.body.appendChild(dummyScroller);
    scrollbarSize = dummyScroller.offsetWidth - dummyScroller.clientWidth;
    // $FlowFixMe
    document.body.removeChild(dummyScroller);
  }

  return scrollbarSize;
};

export const on = (): void => {
  stackCnt += 1;
  if (stackCnt === 1) {
    const body = document.body;
    const header: HTMLElement | null = document.querySelector('header.site-header');
    if (body.scrollHeight > window.innerHeight) {
      let size = getScrollbarSize();
      if (size > 0) {
        body.style.paddingRight = size + 'px';
        if (header) {
          header.style.paddingRight = size + 'px';
        }
      }
    }
    body.style.overflowY = 'hidden';
    body.style.overflowX = 'hidden';
  }
};

export const off = (): void => {
  stackCnt -= 1;
  if (stackCnt === 0) {
    const body = document.body;
    const header: HTMLElement | null = document.querySelector('header.site-header');

    if (scrollbarSize > 0) {
      body.style.paddingRight = '0';
      if (header !== null) {
        header.style.paddingRight = '0';
      }
    }
    body.style.overflowY = 'visible';
    body.style.overflowX = 'auto';
  }
};
