import * as React from 'react';

// https://github.com/gorangajic/react-icons/tree/master/fa

type Props = {
  style?: $Shape<CSSStyleDeclaration>,
  children?: React$Element<*>,
  props?: { [$Keys<HTMLElement>]: any },
};

const Icon = ({ children, style, ...props }: Props) =>
  <span className="svg-icon" style={style}>
    <svg children={children} fill="currentColor" preserveAspectRatio="xMidYMid meet" {...props} />
  </span>;

export default Icon;
