import React, {PropTypes} from 'react'

const LoaderSpinner = ({size, style, delay}) => (
  <svg className={`loader-spinner${delay ? ' delay':''}`} viewBox="0 0 32 32" width={size} height={size} style={style}>
    <circle cx={16} cy={16} r={14} fill="none"></circle>
  </svg>
);

LoaderSpinner.propTypes = {
  size: PropTypes.number,
  style: PropTypes.object,
  name: PropTypes.string,
};

LoaderSpinner.defaultProps = {
  size: 24
};

export default LoaderSpinner