import React from 'react'
import BuildStatus from '../../../components/BuildStatus'
import classnames from 'classnames'

import { connect } from 'react-redux'
import { changeType } from '../actions'

@connect(
  (state, ownProps) => ({
    isSelected: state.build.build === ownProps.build,
    isActive: state.browser.lessThan.lg && state.build.build !== null,
    spec: state.build.builds.byId[ownProps.build]
  }),
  dispatch => ({
    changeType: buildType => dispatch(changeType(buildType))
  })
)
class BuildType extends React.Component {

  static propTypes = {
    build: React.PropTypes.string.isRequired
  };

  select = () => {
    const { isSelected, build, changeType } = this.props;
    changeType(!isSelected ? build : null);
  };

  render() {
    const { isSelected, isActive, build, spec } = this.props;

    return (
      <div onClick={this.select} className={classnames('build', build, {'selected': isSelected, 'active': isActive})}>
        <h2>{spec.title}</h2>
        <p>{spec.description}</p>
        <BuildStatus name={spec.job} />
      </div>
    )
  }

}

export default BuildType
