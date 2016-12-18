import React from 'react'
import { connect } from 'react-redux'
import { downloadInit } from '../actions'
import { MODE_ZIP } from '../constants'

import BuildToolbar from './BuildToolbar'
import FaCloudDownload from '../../../../icons/cloud-download'

@connect(
  (state) => ({
    mode: state.build.mode,
  }),
  {
    downloadInit
  }
)
class BuildDownload extends React.Component {

  render() {
    const {mode} = this.props;

    if ( mode === MODE_ZIP ) {
      return (
        <BuildToolbar>
          <button className="btn btn-success" onClick={this.props.downloadInit}><FaCloudDownload /> DOWNLOAD ZIP</button>
        </BuildToolbar>
      )
    } else {
      return null;
    }
  }

}

export default BuildDownload
