import React from 'react'
import BuildStatus from './BuildStatus'
import {observer} from 'mobx-react'
import classnames from 'classnames'

@observer
class BuildType extends React.Component {

  static propTypes = {
    build: React.PropTypes.string.isRequired,
    store: React.PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);
    this.selectBuild = this.selectBuild.bind(this);
  }

  selectBuild() {
    this.props.store.selectBuild(this.props.store.build === this.props.build ? null : this.props.build);
  }

  render() {
    const selectedBuild = this.props.store.build;
    const build = this.props.store.config.builds[this.props.build];

    return (
      <div className={classnames('build', this.props.build, {'selected': selectedBuild === this.props.build, 'active': selectedBuild !== null})} onClick={this.selectBuild}>
        <h2>{build.title}</h2>
        <p>{build.description}</p>
        <BuildStatus name={build.job} />
      </div>
    )
  }

}

export default BuildType