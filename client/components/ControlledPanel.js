import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

type OwnProps = {
  predicate: (state: any) => boolean,
  getClassName: (state: any) => string,
  className: string,
};

type Props = OwnProps & {
  hidden: boolean,
  children?: React$Element<*>,
};

const Panel = ({ children, hidden, className }: Props) => {
  return hidden ? null : <div className={className}>{children}</div>;
};

export default connect((state: any, props: OwnProps) => {
  const map = {};

  map.hidden = props.predicate && !props.predicate(state);

  if (props.getClassName) {
    map.className = props.getClassName(state);
  }

  return map;
})(Panel);
