import React from 'react'
import { connect } from 'react-redux'
import { downloadInit } from '../actions'

@connect(
  state => ({
    build: state.build.build,
    mode: state.build.mode,
    version: state.build.version,
    fullZip:
      state.build.build !== 'nightly' || (
           state.build.preset === 'all'
        && state.build.source === true
        && state.build.javadoc === true
       && state.build.natives.allIds.every(platform => state.build.platform[platform])
      )
  }),
  dispatch => ({
    downloadInit: () => dispatch(downloadInit())
  })
)
class BuildDownload extends React.Component {

  render() {
    const props = this.props;

    if ( props.mode !== 'zip' ) {
      return null;
    }

    if ( props.fullZip ) {
      let downloadUrl;
      switch (props.build) {
        case 'release':
          downloadUrl = `http://build.lwjgl.org/${props.build}/${props.version}/lwjgl-${props.version}.zip`;
          break;
        default:
          downloadUrl = `http://build.lwjgl.org/${props.build}/lwjgl.zip`;
      }

      return (
        <div className="col-xs-12 col-lg-4">
          <h2 className="m-b-2 m-t-1">Bundle</h2>
          <a className="btn btn-xs-block btn-primary btn-lg" href={downloadUrl} target="_blank">DOWNLOAD ZIP</a>
        </div>
      )
    } else {

      return (
        <div className="col-xs-12 col-lg-4">
          <h2 className="m-b-2 m-t-1">Custom Bundle</h2>
          <button className="btn btn-xs-block btn-primary btn-lg" onClick={this.props.downloadInit}>GENERATE BUNDLE</button>
        </div>
      )

    }
  }

}

export default BuildDownload
