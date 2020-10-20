import { createStyled } from '@stitches/react';

// TODO: Populate from
// https://github.com/tailwindlabs/tailwindcss/blob/master/stubs/defaultConfig.stub.js

export const { styled, css } = createStyled({
  prefix: '',
  tokens: {
    // colors: {
    //   // $gray: 'gainsboro',
    //   // $blue: 'royalblue',
    // },
    // space: {
    //   $0: '0',
    //   $px: '1px',
    //   $1: '0.25rem',
    //   $2: '0.5rem',
    //   $3: '0.75rem',
    //   $4: '1rem',
    //   $5: '1.25rem',
    //   $6: '1.5rem',
    //   $8: '2rem',
    //   $10: '2.5rem',
    //   $12: '3rem',
    //   $16: '4rem',
    //   $20: '5rem',
    //   $24: '6rem',
    //   $32: '8rem',
    //   $40: '10rem',
    //   $48: '12rem',
    //   $56: '14rem',
    //   $64: '16rem',
    //   '$-px': '-1px',
    //   '$-1': '-0.25rem',
    //   '$-2': '-0.5rem',
    //   '$-3': '-0.75rem',
    //   '$-4': '-1rem',
    //   '$-5': '-1.25rem',
    //   '$-6': '-1.5rem',
    //   '$-8': '-2rem',
    //   '$-10': '-2.5rem',
    //   '$-12': '-3rem',
    //   '$-16': '-4rem',
    //   '$-20': '-5rem',
    //   '$-24': '-6rem',
    //   '$-32': '-8rem',
    //   '$-40': '-10rem',
    //   '$-48': '-12rem',
    //   '$-56': '-14rem',
    //   '$-64': '-16rem',
    // },
    // fontSizes: {
    //   // '$1': '10px',
    //   // '$2': '12px',
    // },
    // fonts: {
    //   // '$sans': 'sans-serif',
    // },
    // fontWeights: {},
    // lineHeights: {},
    // letterSpacings: {},
    // sizes: {
    //   $auto: 'auto',
    //   '$1/2': '50%',
    //   '$1/3': '33.333333%',
    //   '$2/3': '66.666667%',
    //   '$1/4': '25%',
    //   '$2/4': '50%',
    //   '$3/4': '75%',
    //   '$1/5': '20%',
    //   '$2/5': '40%',
    //   '$3/5': '60%',
    //   '$4/5': '80%',
    //   '$1/6': '16.666667%',
    //   '$2/6': '33.333333%',
    //   '$3/6': '50%',
    //   '$4/6': '66.666667%',
    //   '$5/6': '83.333333%',
    //   '$1/12': '8.333333%',
    //   '$2/12': '16.666667%',
    //   '$3/12': '25%',
    //   '$4/12': '33.333333%',
    //   '$5/12': '41.666667%',
    //   '$6/12': '50%',
    //   '$7/12': '58.333333%',
    //   '$8/12': '66.666667%',
    //   '$9/12': '75%',
    //   '$10/12': '83.333333%',
    //   '$11/12': '91.666667%',
    //   $full: '100%',
    //   $screenWidth: '100vw',
    //   $screenHeight: '100vh',
    // },
    // borderWidths: {},
    // borderStyles: {},
    // radii: {},
    // shadows: {
    //   // '$distant': '0 15px 35px -5px rgba(0,0,0,.25)',
    // },
    // zIndices: {},
    // transitions: {
    //   // '$fast': 'all 50ms ease',
    // },
  },
  breakpoints: {
    // The maximum value is reduced by 0.02px to work around the limitations of
    // `min-` and `max-` prefixes and viewports with fractional widths.
    // See https://www.w3.org/TR/mediaqueries-4/#mq-min-max
    // Uses 0.02px rather than 0.01px to work around a current rounding bug in Safari.
    // See https://bugs.webkit.org/show_bug.cgi?id=178261
    // xs: (rule) => `@media (min-width: 0) { ${rule} }`,
    // sm: (rule) => `@media (min-width: 576px) { ${rule} }`,
    // md: (rule) => `@media (min-width: 768px) { ${rule} }`,
    mdDown: (rule) => `@media (max-width: ${992 - 0.02}px) { ${rule} }`,
    lg: (rule) => `@media (min-width: 992px) { ${rule} }`,
    // lgDown: (rule) => `@media (max-width: ${1200 - 0.02}px) { ${rule} }`,
    // xl: (rule) => `@media (min-width: 1200px) { ${rule} }`,
    // xxl: (rule) => `@media (min-width: 1400px) { ${rule} }`,
    max: (rule) => `@supports (width: max(1px, 2px)) { ${rule} }`,
    min: (rule) => `@supports (width: min(1px, 2px)) { ${rule} }`,
    clamp: (rule) => `@supports (width: clamp(140px, 16vw, 220px)) { ${rule} }`,
  },
  utils: {
    // d: (config) => (value) => ({
    //   display: value,
    // }),
    // w: (config) => (value) => ({
    //   width: value,
    // }),
    // h: (config) => (value) => ({
    //   height: value,
    // }),
    // m: (config) => (value) => ({
    //   marginTop: value,
    //   marginBottom: value,
    //   marginLeft: value,
    //   marginRight: value,
    // }),
    // mt: (config) => (value) => ({
    //   marginTop: value,
    // }),
    // mr: (config) => (value) => ({
    //   marginRight: value,
    // }),
    // mb: (config) => (value) => ({
    //   marginBottom: value,
    // }),
    // ml: (config) => (value) => ({
    //   marginLeft: value,
    // }),
    // mx: (config) => (value) => ({
    //   marginLeft: value,
    //   marginRight: value,
    // }),
    // my: (config) => (value) => ({
    //   marginTop: value,
    //   marginBottom: value,
    // }),
    // size: (config) => (value) => ({
    //   width: value,
    //   height: value,
    // }),
    linearGradient: (value) => ({
      backgroundImage: `linear-gradient(${value})`,
    }),
    // br: (config) => (value) => ({
    //   borderRadius: value,
    // }),
    // // Use this inside another container
    // flexGap: (value) => ({
    //   '--gap': value,
    //   margin: 'calc(var(--gap) / -2)',
    //   '& > *': {
    //     margin: 'calc(var(--gap) / 2)',
    //   },
    // }),
    hstack: (value) => ({
      '& > *': {
        marginLeft: value,
      },
      '& > *:first-child': {
        marginLeft: 0,
      },
    }),
    vstack: (value) => ({
      '& > *': {
        marginBottom: value,
      },
      '& > *:last-child': {
        marginBottom: 0,
      },
    }),
  },
});
