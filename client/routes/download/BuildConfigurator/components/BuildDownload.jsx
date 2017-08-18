import * as React from 'react';
import { connect } from 'react-redux';
import { downloadInit } from '../reducer';
import { MODE_ZIP } from '../constants';
import type { MODES } from '../types';

import BuildToolbar from './BuildToolbar';
import IconDownload from 'react-icons/md/file-download';

type Props = {
  mode: MODES,
  downloadInit: typeof downloadInit,
};

class BuildDownload extends React.Component<Props> {
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
