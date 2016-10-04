import React from 'react'
import { connect } from 'react-redux'
import LoaderSpinner from '../../../../components/LoaderSpinner'

@connect(
  state => ({
    progress: state.build.progress
  })
)
class BuildBundler extends React.Component {

  render() {
    return (
      <div className="col-xs-12">
        <div className="text-xs-center">
          <LoaderSpinner size={32} style={{marginBottom: '1rem'}} />
          <h4>Generating ZIP bundle. Please wait...</h4>
        </div>
        <pre>
          {
            this.props.progress.slice(0).reverse().map(
              (line, i) => <div key={`log${i}`}>{line}</div>
            )
          }
        </pre>
      </div>
    )
  }

}

export default BuildBundler
