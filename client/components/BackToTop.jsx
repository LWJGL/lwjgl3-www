// @flow
import * as React from 'react';
import smoothScroll from '~/services/smoothscroll';
import IconArrowUpward from 'react-icons/md/arrow-upward';

const scrollTopTop = (e: SyntheticEvent<HTMLLinkElement>) => {
  e.preventDefault();
  smoothScroll.init();
  window.scroll(0, 0);
  smoothScroll.play();
};

const BackToTop = () => (
  <p className="text-center">
    <a className="btn btn-link" href="#" onClick={scrollTopTop}>
      top<IconArrowUpward />
    </a>
  </p>
);

export default BackToTop;
