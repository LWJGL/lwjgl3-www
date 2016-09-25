import React, { PropTypes } from 'react'
import BuildStatus from '../../../components/BuildStatus'
import classnames from 'classnames'

import config from '../../../../common/BuildConfig'

import { connect } from 'react-redux'
import { changeType } from '../actions'

@connect(
  (state, ownProps) => ({
    isSelected: state.build.buildType === ownProps.build,
    isActive: state.browser.lessThan.lg && state.build.buildType !== null,
  }),
  dispatch => ({
    changeType: buildType => dispatch(changeType(buildType))
  })
)
class BuildType extends React.Component {

  static propTypes = {
    build: PropTypes.string.isRequired,
    isSelected: PropTypes.bool,
    changeType: PropTypes.func,
  };

  select = () => {
    const { isSelected, build, changeType } = this.props;
    changeType(!isSelected ? build : null);
  };

  render() {
    const { isSelected, isActive, build } = this.props;
    const spec = config.builds[build];

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
