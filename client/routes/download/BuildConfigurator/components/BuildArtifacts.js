import React from 'react'
import { connect } from 'react-redux'
import BuildArtifact from './BuildArtifact'

@connect(
  (state) => ({
    artifacts: state.build.artifacts.allIds
  })
)
class BuildArtifacts extends React.Component {

  render() {
    return (
      <div className="custom-controls-stacked">
        {
          this.props.artifacts.map((it) => <BuildArtifact key={it} id={it} />)
        }
      </div>
    )
  }

}

export default BuildArtifacts
