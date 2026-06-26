import useMediaQuery from './useMediaQuery';

const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
} as const;

type Breakpoint = keyof typeof BREAKPOINTS;

export function useBreakpoint(breakpoint: Breakpoint, serverFallback: boolean = false): boolean {
  return useMediaQuery(`(min-width: ${BREAKPOINTS[breakpoint]}px)`, serverFallback);
}
