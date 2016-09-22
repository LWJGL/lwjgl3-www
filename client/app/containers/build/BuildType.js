import React from 'react'
import BuildStatus from '../../components/BuildStatus'
import {observer} from 'mobx-react'
import classnames from 'classnames'

@observer(['store'])
class BuildType extends React.Component {

  static propTypes = {
    build: React.PropTypes.string.isRequired,
  };

  select = () => {
    const store = this.props.store;
    const build = this.props.build;
    store.selectBuild(store.build !== build ? build : null);
  };

  render() {
    const selectedBuild = this.props.store.build;
    const build = this.props.store.config.builds[this.props.build];

    return (
      <div onClick={this.select} className={classnames('build', this.props.build, { 'selected': selectedBuild === this.props.build, 'active': selectedBuild !== null})}>
        <h2>{build.title}</h2>
        <p>{build.description}</p>
        <BuildStatus name={build.job} />
      </div>
    )
  }

}

export default BuildType