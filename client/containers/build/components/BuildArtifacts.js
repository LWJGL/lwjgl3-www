import React from 'react'
import {connect} from 'react-redux'
import BuildArtifact from './BuildArtifact'

@connect(
  state => ({
    artifacts: state.build.artifacts.allIds,
  })
)
class BuildArtifacts extends React.Component {

  render() {
    return (
      <div>
        {
          this.props.artifacts.map(artifact => (
            <div key={artifact}>
              <BuildArtifact id={artifact} />
            </div>
          ))
        }
      </div>
    )
  }

}

export default BuildArtifacts
