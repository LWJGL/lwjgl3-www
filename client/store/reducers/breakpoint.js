export const BREAKPOINTS_RESIZE = 'BREAKPOINTS/RESIZE_EVENT';
export const resizeEvent = payload => ({type: BREAKPOINTS_RESIZE, payload});

const breakpoint = {
  limits: [0, 554, 768, 992, 1200],
  current: 4,
  xs: 0,
  sm: 1,
  md: 2,
  lg: 3,
  xl: 4,
};

export const getCurrent = () => {
  const w = window.innerWidth;

  let i = breakpoint.limits.length - 1;
  while ( i > 0 ) {
    if ( w >= breakpoint.limits[i] ) {
      //noinspection BreakStatementJS
      break;
    }
    i -= 1;
  }

  return i;
};

if ( process.browser ) {
  breakpoint.current = getCurrent();
}

export default function(state = breakpoint, action) {
  if ( action.type === BREAKPOINTS_RESIZE ) {
    return {...state, current: action.payload};
  }

  return state;
}
