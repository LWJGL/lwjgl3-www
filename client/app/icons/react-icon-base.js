import React from 'react'
import { PropTypes } from 'react'

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

IconBase.propTypes = {
  color: PropTypes.string,
  size: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number
  ]),
  style: PropTypes.object
};

export default IconBase