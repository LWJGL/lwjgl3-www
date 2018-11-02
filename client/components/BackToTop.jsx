import * as React from 'react';
import { scrollSmooth } from '../services/scrollSmooth';
import IconArrowUpward from './icons/md/ArrowUpward';

function scrollTopTop(e: SyntheticEvent<HTMLLinkElement>) {
  e.preventDefault();
  scrollSmooth(0, 0);
}

export function BackToTop() {
  return (
    <p className="text-center">
      <a className="btn btn-link" href="#" onClick={scrollTopTop}>
        top
        <IconArrowUpward />
      </a>
    </p>
  );
}
