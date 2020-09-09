export type BREAKPOINT = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

export interface BreakPointIndex {
  [breakpoint: string]: number;
}

export const breakpointIndex: BreakPointIndex = {
  xs: 0,
  sm: 1,
  md: 2,
  lg: 3,
  xl: 4,
};

export const breakpointNames: Array<BREAKPOINT> = ['xs', 'sm', 'md', 'lg', 'xl'];
export const breakpoints: Array<number> = [0, 576, 768, 992, 1200];

// export const mediaBreakpointUp = (breakpoint: BREAKPOINT): string =>
//   `@media (min-width:${breakpoints[breakpointIndex[breakpoint]]}px)`;

// export const mediaBreakpointDown = (breakpoint: BREAKPOINT): string =>
//   `@media (max-width:${breakpoints[breakpointIndex[breakpoint] + 1] - 1}px)`;
