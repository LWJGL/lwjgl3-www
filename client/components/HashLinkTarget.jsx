// @flow
import * as React from 'react';
//$FlowFixMe
import { memo, useRef, useEffect } from 'react';
import { Location, type RouterLocation } from '@reach/router';
import { scrollSmooth } from '../services/scrollSmooth';
import { usePrevious } from '../hooks/usePrevious';

type OwnProps = {|
  id: string,
|};

type Props = {|
  ...OwnProps,
  hash: string,
|};

// Remember position before we clicked on a HashLink
let defaultScrollPos = [0, 0];
// Avoid calling reset position more than once when multiple <HashLinkTarget /> are on page
let scrolling = false;

function scrollEnd() {
  scrolling = false;
}

function scrollToTarget(el: HTMLElement) {
  if (el != null) {
    var rect = el.getBoundingClientRect();
    scrollSmooth(0, rect.top + window.pageYOffset);
    setTimeout(scrollEnd, 0);
  }
}

const HashLinkTargetControlled = memo(({ id, hash }: Props) => {
  const el = useRef(null);
  const prevHash = usePrevious(hash);

  useEffect(
    () => {
      if (prevHash === undefined) {
        // Only runs on mount
        if (hash === `#${id}`) {
          scrollToTarget(el.current);
        }
      } else {
        // Runs on re-render
        if (prevHash !== hash) {
          if (hash === `#${id}`) {
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
      }
    },
    [id, hash]
  );

  return <a ref={el} />;
});

export const HashLinkTarget = ({ id }: OwnProps) => (
  <Location>{({ location }) => <HashLinkTargetControlled id={id} hash={location.hash} />}</Location>
);
