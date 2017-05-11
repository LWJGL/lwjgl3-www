import React from 'react';
import { connect } from 'react-redux';
import { downloadInit } from '../reducer';
import { MODE_ZIP } from '../constants';

import BuildToolbar from './BuildToolbar';
import IconDownload from 'react-icons/md/file-download';

class BuildDownload extends React.Component {
  render() {
    if (this.props.mode === MODE_ZIP) {
      return (
        <BuildToolbar>
          <button className="btn btn-success" onClick={this.props.downloadInit}>
            <IconDownload /> DOWNLOAD ZIP
          </button>
        </BuildToolbar>
      );
    } else {
      return null;
    }
  }
}

export default connect(
  state => ({
    mode: state.build.mode,
  }),
  {
    downloadInit,
  }
)(BuildDownload);
