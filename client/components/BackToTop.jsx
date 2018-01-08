// @flow
import * as React from 'react';
import IconArrowUpward from 'react-icons/md/arrow-upward';

const scrollTopTop = (e: SyntheticEvent<HTMLLinkElement>) => {
  e.preventDefault();
  // $FlowFixMe
  document.documentElement.scrollIntoView({
    behavior: 'smooth',
    block: 'start',
    inline: 'start',
  });
};

export const BackToTop = () => (
  <p className="text-center">
    <a className="btn btn-link" href="#" onClick={scrollTopTop}>
      top<IconArrowUpward />
    </a>
  </p>
);
