import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

type OwnProps = {
  predicate: (state: any) => boolean,
  getClassName?: (state: any) => string,
  children?: React$Element<*>,
};

type ConnectedProps = {
  hidden: boolean,
  className?: string,
};

type Props = OwnProps & ConnectedProps;

type PanelElement = Props => React$Element<*> | null;

const Panel: PanelElement = ({ children, hidden, className }: Props) => {
  return hidden
    ? null
    : <div className={className}>
        {children}
      </div>;
};

export default (connect((state: any, props: OwnProps) => {
  const map: ConnectedProps = {
    hidden: props.predicate && !props.predicate(state),
  };

  if (props.getClassName) {
    map.className = props.getClassName(state);
  }

  return map;
})(Panel): Class<React$Component<void, OwnProps, void>>);
