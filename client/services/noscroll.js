// @flow
declare var document;

let scrollbarSize: number = -1;

function getScrollbarSize(): number {
  if (scrollbarSize === -1) {
    let dummyScroller = document.createElement('div');
    dummyScroller.setAttribute('style', 'width:99px;height:99px;position:absolute;top:-9999px;overflow:scroll');
    document.body.appendChild(dummyScroller);
    scrollbarSize = dummyScroller.offsetWidth - dummyScroller.clientWidth;
    document.body.removeChild(dummyScroller);
  }

  return scrollbarSize;
}

let stackCnt = 0;

export default {
  on: function(): void {
    stackCnt += 1;
    if (stackCnt === 1) {
      if (document.body.scrollHeight > window.innerHeight) {
        let size = getScrollbarSize();
        if (size > 0) {
          document.body.style.paddingRight = size + 'px';
          document.getElementsByTagName('header')[0].style.paddingRight = size + 'px';
        }
      }
      document.body.style.overflowY = 'hidden';
      document.body.style.overflowX = 'hidden';
    }
  },

  off: function(): void {
    stackCnt -= 1;
    if (stackCnt === 0) {
      if (scrollbarSize > 0) {
        document.body.style.paddingRight = '0';
        document.getElementsByTagName('header')[0].style.paddingRight = '0';
      }
      document.body.style.overflowY = 'visible';
      document.body.style.overflowX = 'auto';
    }
  },
};
