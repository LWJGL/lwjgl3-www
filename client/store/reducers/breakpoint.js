// @flow
import { breakpoints } from '~/theme';
export const BREAKPOINTS_RESIZE = 'BREAKPOINTS/RESIZE_EVENT';

export type SetBreakPoint = {
  type: string,
  payload: number,
};

export type BreakPointState = {
  +current: number,
  +xs: number,
  +sm: number,
  +sm: number,
  +md: number,
  +lg: number,
  +xl: number,
};

export const resizeEvent = (payload: number): SetBreakPoint => ({ type: BREAKPOINTS_RESIZE, payload });

export const getCurrent = (): number => {
  const w = window.innerWidth;

  // let i = breakpoints.length - 1;
  let i = 4;
  while (i > 0) {
    if (w >= breakpoints[i]) {
      break;
    }
    i -= 1;
  }

  return i;
};

const breakpoint: BreakPointState = {
  current: getCurrent(),
  xs: 0,
  sm: 1,
  md: 2,
  lg: 3,
  xl: 4,
};

export default function breakpointReducer(state: BreakPointState = breakpoint, action: SetBreakPoint): BreakPointState {
  if (action.type === BREAKPOINTS_RESIZE) {
    return { ...state, current: action.payload };
  }

  return state;
}
