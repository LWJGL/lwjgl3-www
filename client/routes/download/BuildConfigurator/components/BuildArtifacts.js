import React from 'react'
import { connect } from 'react-redux'
import classnames from 'classnames'
import BuildArtifact from './BuildArtifact'
import { MODE_ZIP } from '../constants'

@connect(
  state => ({
    artifacts: state.build.artifacts.allIds,
    isZip: state.build.mode === MODE_ZIP,
  })
)
class BuildArtifacts extends React.Component {

  render() {
    const {isZip, artifacts} = this.props;

    return (
      <div className={classnames(
        "col-xs-12",
        "col-md-4",
        {
          "col-lg-3": !isZip,
          "col-lg-5": isZip
        }
      )}>
        <h2 className="my-1">Contents</h2>
        <div className="custom-controls-stacked">
          {
            artifacts.map(it => <BuildArtifact key={it} id={it} />)
          }
        </div>
      </div>
    )
  }

}

export default BuildArtifacts
