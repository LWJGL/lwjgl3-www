// @flow
import * as React from 'react';
import { connect } from 'react-redux';

type OwnProps = {|
  predicate: (state: Object) => boolean,
  className?: string,
  children?: React.Node,
|};

type ConnectedProps = {|
  hidden: boolean,
|};

type Props = {|
  ...OwnProps,
  ...ConnectedProps,
|};

const Panel = ({ children, hidden, className }: Props) => (hidden ? null : <div className={className}>{children}</div>);

export default connect(
  (state: Object, ownProps: OwnProps) => ({
    hidden: !ownProps.predicate(state),
  }),
  () => ({})
)(Panel);
