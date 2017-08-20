// @flow
import * as React from 'react';

type Props = {
  size?: number,
  // Do not use $Shape<CSSStyleDeclaration> here because of SVG rules
  style?: {},
  delay?: boolean,
};

const LoaderSpinner = ({ size = 24, style, delay = false }: Props) =>
  <svg
    className={`loader-spinner${delay ? ' delay' : ''}`}
    viewBox="0 0 32 32"
    width={size}
    height={size}
    style={style}
  >
    <circle cx={16} cy={16} r={14} fill="none" />
  </svg>;

export default LoaderSpinner;
