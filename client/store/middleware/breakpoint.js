// @flow
import { resizeEvent, getCurrent } from '../reducers/breakpoint';
import type { Dispatch, MiddlewareAPI } from 'redux';
import { breakpoints } from '~/theme';

/**
 * Listens to matchMedia events and updates state.breakpoint.current
 * Falls back to window.onresize on older browsers
 * TODO: Deprecate onresize for older browsers
 */
export default function breakpointMiddleware({ dispatch, getState }: MiddlewareAPI<*, *>) {
  function resizeHandle(i) {
    if (i === undefined) {
      const current = getCurrent();
      if (getState().breakpoint.current !== current) {
        dispatch(resizeEvent(current));
      }
    } else {
      dispatch(resizeEvent(i));
    }
  }

  function mediaQueryHandle(i, e) {
    if (e.matches) {
      resizeHandle(i);
    }
  }

  if (window.matchMedia) {
    // const last = breakpoints.length - 1;
    const last = 4;

    breakpoints.forEach((limit, i) => {
      let mediaQuery;
      if (i === 0) {
        mediaQuery = `(max-width:${breakpoints[1] - 1}px)`;
      } else if (i === last) {
        mediaQuery = `(min-width:${limit}px)`;
      } else {
        mediaQuery = `(min-width:${limit}px) and (max-width:${breakpoints[i + 1] - 1}px)`;
      }

      const mqr = window.matchMedia(mediaQuery);
      mqr.addListener(mediaQueryHandle.bind(mqr, i));
    });
  } else {
    window.addEventListener('resize', resizeHandle);
  }

  return (next: Dispatch<*>) => (action: any) => next(action);
}
