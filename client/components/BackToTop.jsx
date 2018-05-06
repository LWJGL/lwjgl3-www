// @flow
import * as React from 'react';
import scrollIntoView from 'scroll-into-view-if-needed';
import IconArrowUpward from './icons/md/ArrowUpward';

const scrollTopTop = (e: SyntheticEvent<HTMLLinkElement>) => {
  e.preventDefault();
  if (document.body != null) {
    scrollIntoView(document.body, {
      behavior: 'smooth',
      block: 'start',
      inline: 'start',
    });
  }
};

export const BackToTop = () => (
  <p className="text-center">
    <a className="btn btn-link" href="#" onClick={scrollTopTop}>
      top<IconArrowUpward />
    </a>
  </p>
);
