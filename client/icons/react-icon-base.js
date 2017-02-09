import React from 'react'

const IconBase = ({children, size, ...props}) => (
  <span className="svg-icon" style={{fontSize:size}}>
    <svg
      children={children}
      fill='currentColor'
      preserveAspectRatio='xMidYMid meet'
      {...props}
    />
  </span>
);

export default IconBase
