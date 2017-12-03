// @flow
import * as React from 'react';
import cc from 'classcat';

type Props = {
  size?: number,
  // Do not use $Shape<CSSStyleDeclaration> here because of SVG rules
  style?: {},
  className?: string,
  delay?: boolean,
};

export const LoaderSpinner = ({ size = 24, style, className, delay = false }: Props) => {
  const cl = { delay: delay === true };

  if (typeof className === 'string') {
    cl[className] = true;
  }

  return (
    <svg className={cc(['loader-spinner', cl])} viewBox="0 0 32 32" width={size} height={size} style={style}>
      <circle cx={16} cy={16} r={14} fill="none" />
    </svg>
  );
};
