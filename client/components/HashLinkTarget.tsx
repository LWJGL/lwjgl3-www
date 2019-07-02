import React, { useRef, useEffect } from 'react';
import { Location } from '@reach/router';
import { scrollSmooth } from '../services/scrollSmooth';
import { usePrevious } from '../hooks/usePrevious';

interface OwnProps {
  id: string;
}

interface Props extends OwnProps {
  hash: string;
}

// Remember position before we clicked on a HashLink
let defaultScrollPos = [0, 0];
// Avoid calling reset position more than once when multiple <HashLinkTarget /> are on page
let scrolling = false;

function scrollEnd() {
  scrolling = false;
}

function scrollToTarget(el: HTMLAnchorElement) {
  if (el != null) {
    var rect = el.getBoundingClientRect();
    scrollSmooth(0, rect.top + window.pageYOffset);
    window.setTimeout(scrollEnd, 0);
  }
}

const HashLinkTargetControlled: React.FC<Props> = ({ id, hash }) => {
  const el = useRef<HTMLAnchorElement>(null);
  const prevHash = usePrevious(hash);

  useEffect(() => {
    if (prevHash === null) {
      // Only runs on mount
      if (hash === `#${id}` && el.current !== null) {
        scrollToTarget(el.current);
      }
    } else if (prevHash !== hash) {
      // Runs on re-render
      if (hash === `#${id}` && el.current !== null) {
        if (prevHash === '') {
          defaultScrollPos = [window.pageXOffset, window.pageYOffset];
        }
        scrolling = true;
        scrollToTarget(el.current);
      } else if (!scrolling) {
        scrolling = true;
        scrollSmooth(defaultScrollPos[0], defaultScrollPos[1]);
        setTimeout(scrollEnd, 0);
      }
    }
  }, [id, hash, prevHash]);

  return <a ref={el} />;
};

export const HashLinkTarget = ({ id }: OwnProps) => (
  <Location>{({ location }) => <HashLinkTargetControlled id={id} hash={location.hash} />}</Location>
);
