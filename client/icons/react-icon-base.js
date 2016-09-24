import React from 'react'
import IconPropTypes from './react-icon-propTypes'

const IconBase = ({ children, color, size, style, ...props }) => {
  const computedSize = size || '1em';
  return (
    <svg
      children={children}
      fill='currentColor'
      preserveAspectRatio='xMidYMid meet'
      height={computedSize}
      width={computedSize}
      {...props}
      style={{
        verticalAlign: 'middle',
        color,
        ...style
      }}
    />
  )
};

IconBase.propTypes = IconPropTypes;
export default IconBase