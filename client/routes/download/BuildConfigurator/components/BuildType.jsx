import React from 'react';
import PropTypes from 'prop-types';
import BuildStatus from './BuildStatus';
import classnames from 'classnames';

import { connect } from 'react-redux';
import { changeType } from '../reducer';

class BuildType extends React.Component {
  static propTypes = {
    build: PropTypes.string.isRequired,
  };

  select = () => {
    const { isSelected, build, changeType } = this.props;
    changeType(isSelected ? null : build);
  };

  render() {
    const { isSelected, isActive, build, spec } = this.props;

    return (
      <div onClick={this.select} className={classnames('build', build, { selected: isSelected, active: isActive })}>
        <h2>{spec.title}</h2>
        <p className="my-0">{spec.description}</p>
        <BuildStatus name={spec.id} />
      </div>
    );
  }
}

export default connect(
  (state, ownProps) => ({
    isSelected: state.build.build === ownProps.build,
    isActive: state.breakpoint.current < state.breakpoint.lg && state.build.build !== null,
    spec: state.build.builds.byId[ownProps.build],
  }),
  {
    changeType,
  }
)(BuildType);
