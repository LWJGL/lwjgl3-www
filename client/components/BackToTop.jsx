// @flow
import * as React from 'react';
import { init, play } from '~/services/smoothscroll';
import IconArrowUpward from 'react-icons/md/arrow-upward';

const scrollTopTop = (e: SyntheticEvent<HTMLLinkElement>) => {
  e.preventDefault();
  init();
  window.scroll(0, 0);
  play();
};

export const BackToTop = () => (
  <p className="text-center">
    <a className="btn btn-link" href="#" onClick={scrollTopTop}>
      top<IconArrowUpward />
    </a>
  </p>
);
