// @flow
export const BREAKPOINTS_RESIZE = 'BREAKPOINTS/RESIZE_EVENT';

export type SetBreakPoint = {
  type: string,
  payload: number,
};

export type BreakPointState = {
  +limits: Array<number>,
  +current: number,
  +xs: number,
  +sm: number,
  +sm: number,
  +md: number,
  +lg: number,
  +xl: number,
};

const BOOTSTRAP_BREAKPOINTS = [0, 576, 768, 992, 1200];

export const resizeEvent = (payload: number): SetBreakPoint => ({ type: BREAKPOINTS_RESIZE, payload });

export const getCurrent = (): number => {
  const w = window.innerWidth;

  // let i = BOOTSTRAP_BREAKPOINTS.length - 1;
  let i = 4;
  while (i > 0) {
    if (w >= BOOTSTRAP_BREAKPOINTS[i]) {
      break;
    }
    i -= 1;
  }

  return i;
};

const breakpoint: BreakPointState = {
  limits: BOOTSTRAP_BREAKPOINTS,
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
