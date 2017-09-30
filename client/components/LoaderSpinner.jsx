// @flow
import * as React from 'react';
import wrap from 'classwrap';

type Props = {
  size?: number,
  // Do not use $Shape<CSSStyleDeclaration> here because of SVG rules
  style?: {},
  className?: string,
  delay?: boolean,
};

const LoaderSpinner = ({ size = 24, style, className, delay = false }: Props) => {
  const cl = { delay: delay === true };

  if (className) {
    cl[className] = true;
  }

  return (
    <svg className={wrap(['loader-spinner', cl])} viewBox="0 0 32 32" width={size} height={size} style={style}>
      <circle cx={16} cy={16} r={14} fill="none" />
    </svg>
  );
};

export default LoaderSpinner;
