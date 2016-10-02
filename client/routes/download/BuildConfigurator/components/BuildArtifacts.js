import React from 'react'
import {connect} from 'react-redux'
import classnames from 'classnames'
import BuildArtifact from './BuildArtifact'

@connect(
  state => ({
    artifacts: state.build.artifacts.allIds,
    isZip: state.build.mode === 'zip',
  })
)
class BuildArtifacts extends React.Component {

  render() {
    const props = this.props;

    return (
      <div className={classnames(
        "col-xs-12",
        {
          "col-lg-3": !props.isZip,
          "col-lg-5": props.isZip
        }
      )}>
        <h2 className="m-y-1">Contents</h2>
        {
          props.artifacts.map(artifact => (
            <BuildArtifact key={artifact} id={artifact} />
          ))
        }
      </div>
    )
  }

}

export default BuildArtifacts
