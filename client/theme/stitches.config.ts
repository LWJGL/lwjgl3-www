/*
Spec: https://system-ui.com/theme/
Tokens from: https://github.com/tailwindlabs/tailwindcss/blob/master/stubs/defaultConfig.stub.js
Colors from: @radix-ui/colors
Color Step Cheatsheet:

1. App background
2. Subtle background
3. UI element background
4. Hovered UI element background.
5. Active / Selected UI element background.
6. Subtle borders and separators.
7. UI element border and focus rings
8. Hovered UI element border
9. Solid backgrounds.
10. Hovered solid backgrounds.
11. Low-contrast text.
12. High-contrast text.
*/

import { createStitches } from '@stitches/react';
import type * as Stitches from '@stitches/react';
import * as palette from './palette';

const themeTokens = {
  colors: {
    // Basic
    body: '$accent2',
    text: '$accent12',

    // LWJGL
    // dark: '$accent11',
    // darker: '$accent12',
    dark: palette.accentDark.accent3,
    darker: palette.accentDark.accent1,

    // Palette
    ...palette.accent,
    ...palette.neutral,
    ...palette.positive,
    ...palette.info,
    ...palette.caution,
    ...palette.critical,
  },
  space: {
    // ...spacing(),
    // [pm][tblrxy][:]
    // [pm][tblrxy][:] ['][]
    xxsm: '0.25rem', // $1 4px
    xsm: '0.5rem', // $2 8px
    sm: '0.75rem', //$3 12px
    md: '1.25rem', // $5 20px
    safe: 'calc(var(--scale, 1) * 1.5rem)', // screen-safe, dynamic based on viewport size
    gap: 'calc(var(--scale, 1) * 1.25rem)', // grid gaps, etc, dynamic based on viewport size
    paragraph: 'calc(var(--scale-sm, 1) * 0.9rem)', // grid gaps, paragraph spacing, etc, dynamic based on viewport size
    gutter: '1.5rem', // $6 24px // fixed gutter
    lg: '2rem', // $8 32px
    xl: '4rem', // $16 64px
    xxl: '6rem', // $24 96px
  },
  fontSizes: {
    xs: '0.75rem',
    sm: '0.875rem',
    lg: '1.125rem',
    xl: '1.25rem',
    '2xl': '1.5rem',
    '3xl': '1.875rem',
    '4xl': '2.25rem',
    '5xl': '3rem',
    // "6xl": '3.75rem',
    // "7xl": '4.5rem',
    // "8xl": '6rem',
    // "9xl": '8rem',
  },
  fonts: {
    sans: 'ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,"Noto Sans",sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol","Noto Color Emoji"',
    serif: 'ui-serif,Georgia,Cambria,"Times New Roman",Times,serif',
    mono: 'ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,"Liberation Mono","Courier New",monospace',
    logo: 'Roboto,$fonts$sans',
  },
  fontWeights: {
    thin: '100',
    extralight: '200',
    light: '300',
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
    extrabold: '800',
    black: '900',
  },
  lineHeights: {
    tight: '1.25',
    snug: '1.375',
    normal: '1.5',
    relaxed: '1.625',
    loose: '2',
  },
  letterSpacings: {
    tighter: '-0.05em',
    tight: '-0.025em',
    normal: '0',
    wide: '0.025em',
    wider: '0.05em',
    widest: '0.1em',
  },
  sizes: {
    // xs: '20rem',
    // sm: '24rem',
    // md: '28rem',
    // lg: '32rem',
    // xl: '36rem',
    // '2xl': '42rem',
    // '3xl': '48rem',
    // '4xl': '56rem',
    // '5xl': '64rem',
    // '6xl': '72rem',
    // '7xl': '80rem',
    // 'screen-sm': '640px',
    // 'screen-md': '768px',
    // 'screen-lg': '1024px',
    // 'screen-xl': '1280px',
    // 'screen-2xl': '1536px',
    // min: 'min-content',
    // max: 'max-content',
    // prose: '65ch',
  },
  // borderWidths: {},
  // borderStyles: {},
  radii: {
    // none: '0',
    sm: '0.125rem',
    rounded: '0.25rem',
    md: '0.375rem',
    lg: '0.5rem',
    xl: '0.75rem',
    '2xl': '1rem',
    '3xl': '1.5rem',
    full: '50%',
  },
  shadows: {
    // 'distant': '0 15px 35px -5px rgba(0,0,0,.25)',
    xs: '0 0 0 1px rgba(0, 0, 0, 0.1)',
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.15)',
    shadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
    outline: '0 0 0 3px rgba(161, 161, 170, 0.45)',
    // indigo: '0 0 0 3px rgba(67, 56, 202, 0.45)',
    solid: '0 0 0 2px currentColor',
    // none: 'none',
  },
  // zIndices: {},
  // transitions: {},
};

const stitchesConfig = createStitches({
  theme: themeTokens,
  media: {
    // The maximum value is reduced by 0.02px to work around the limitations of
    // `min-` and `max-` prefixes and viewports with fractional widths.
    // See https://www.w3.org/TR/mediaqueries-4/#mq-min-max
    // Uses 0.02px rather than 0.01px to work around a current rounding bug in Safari.
    // See https://bugs.webkit.org/show_bug.cgi?id=178261
    'sm-down': `(max-width:${576 - 0.02}px)`,
    sm: '(min-width:576px)',
    'md-down': `(max-width:${768 - 0.02}px)`,
    md: '(min-width:768px)',
    'lg-down': ` (max-width:${992 - 0.02}px)`,
    lg: '(min-width:992px)',
    'xl-down': `(max-width:${1200 - 0.02}px)`,
    xl: '(min-width:1200px)',
    'xxl-down': `(max-width:${1400 - 0.02}px)`,
    xxl: '(min-width:1400px)',
    // prefersDark: `(prefers-color-scheme:dark)`,
    // prefersLight: `(prefers-color-scheme:light)`,
    all: 'all',
  },
  utils: {
    mt: (value: Stitches.PropertyValue<'marginTop'>) => ({ marginTop: value }),
    mr: (value: Stitches.PropertyValue<'marginRight'>) => ({ marginRight: value }),
    mb: (value: Stitches.PropertyValue<'marginBottom'>) => ({ marginBottom: value }),
    ml: (value: Stitches.PropertyValue<'marginLeft'>) => ({ marginLeft: value }),
    mx: (value: Stitches.PropertyValue<'margin'>) => ({ marginLeft: value, marginRight: value }),
    my: (value: Stitches.PropertyValue<'margin'>) => ({ marginTop: value, marginBottom: value }),
    pt: (value: Stitches.PropertyValue<'paddingTop'>) => ({ paddingTop: value }),
    pr: (value: Stitches.PropertyValue<'paddingRight'>) => ({ paddingRight: value }),
    pb: (value: Stitches.PropertyValue<'paddingBottom'>) => ({ paddingBottom: value }),
    pl: (value: Stitches.PropertyValue<'paddingLeft'>) => ({ paddingLeft: value }),
    px: (value: Stitches.PropertyValue<'padding'>) => ({ paddingLeft: value, paddingRight: value }),
    py: (value: Stitches.PropertyValue<'padding'>) => ({ paddingTop: value, paddingBottom: value }),
    square: (value: Stitches.PropertyValue<'width'>) => ({ width: value, height: value }),
    hgap: (value: Stitches.PropertyValue<'marginLeft'>) => ({ '& > * + *': { marginLeft: value } }),
    vgap: (value: Stitches.PropertyValue<'marginTop'>) => ({ '& > * + *': { marginTop: value } }),
    // // Use this inside another container
    // flexGap: (value: any) => ({
    //   '--gap': value,
    //   margin: 'calc(var(--gap) / -2)',
    //   '& > *': {
    //     margin: 'calc(var(--gap) / 2)',
    //   },
    // }),
    // // Use this to make full height containers
    // vh100: (value: any) => {
    //   return {
    //     // height: '100%',
    //     // '@supports (height:100vh)': {
    //     //   height: '100vh',
    //     // },
    //     height: '100vh',
    //     '@supports (height:-moz-available)': {
    //       height: '-moz-available',
    //     },
    //     '@supports (height:-webkit-fill-available)': {
    //       height: '-webkit-fill-available',
    //     },
    //   };
    // },
    gap: (value: string | Stitches.PropertyValue<'margin'>) => {
      if (typeof value === 'string') {
        let val: string = value;
        if (val.charAt(0) === '$') {
          if (val.charAt(1) === '$') {
            val = `var(---${val.slice(2)})`;
          } else {
            let [scale, token] = val.slice(1).split('$');
            if (token === undefined) {
              token = scale;
              scale = 'space';
            }

            //@ts-expect-error
            if (scale in config.theme && token in config.theme[scale]) {
              val = `var(--${scale}-${token})`;
            }
          }
        }

        return {
          gridGap: val,
          gap: val,
        };
      } else {
        return {
          gridGap: value,
          gap: value,
        };
      }
    },
    overflow: (overflow: Stitches.PropertyValue<'overflow'> | 'clip') => ({
      overflow: overflow === 'clip' ? 'hidden;overflow:clip' : overflow,
    }),
    // overflowX: () => (overflowX: PropertyValue<'overflowX'>) =>
    //   overflowX === 'clip' ? { overflowX: 'hidden;overflow:clip' } : { overflowX },
    // overflowY: () => (overflowY: PropertyValue<'overflowY'>) =>
    //   overflowY === 'clip' ? { overflowY: 'hidden;overflow:clip' } : { overflowY },
    wrap: (value: 'normal' | 'word' | 'all' | 'truncate') => {
      switch (value) {
        case 'normal':
          return { overflowWrap: 'normal', wordBreak: 'normal' };
        case 'word':
          return { overflowWrap: 'break-word' };
        case 'all':
          return { wordBreak: 'break-all' };
        case 'truncate':
          return { overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' };
        // default:
        //   throw new Error(`${value} not supported`);
      }
    },
  },
});

export const { config, prefix, globalCss, keyframes, createTheme, theme, reset, getCssText, css, styled } =
  stitchesConfig;

export type CSS = Stitches.CSS<typeof stitchesConfig>;

export const themes = {
  light: theme,
  dark: createTheme('dark', {
    colors: {
      body: '$accent2',
      text: '$accent12',

      // LWJGL
      // dark: palette.accentDark.accent3,
      // darker: palette.accentDark.accent1,

      // Palette
      ...palette.accentDark,
      ...palette.neutralDark,
      ...palette.positiveDark,
      ...palette.infoDark,
      ...palette.cautionDark,
      ...palette.criticalDark,
    },
  }),
};

// Access themes so styles are generated & injected immediatelly
theme.toString();
themes.dark.toString();
