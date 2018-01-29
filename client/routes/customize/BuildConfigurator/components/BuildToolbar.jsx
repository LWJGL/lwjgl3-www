// @flow
import * as React from 'react';
import { configLoad } from '../reducer';
import { store } from '~/store';
import { Connect } from '~/store/Connect';

import FileSave from 'react-icons/md/archive';
import FileOpen from 'react-icons/md/settings-backup-restore';

import type { BreakPointState } from '~/store/reducers/breakpoint';

type Props = {|
  configDownload: () => void,
  children?: React.Node,
|};

type State = {
  fileUI: boolean,
};

export class BuildToolbar extends React.Component<Props, State> {
  state = {
    fileUI: false,
  };

  toggleFileUI = this.toggleFileUI.bind(this);
  toggleFileUI() {
    this.setState({ fileUI: !this.state.fileUI });
  }

  handleFile = this.handleFile.bind(this);
  handleFile(e: SyntheticInputEvent<HTMLInputElement>) {
    const files = e.target.files;

    if (files.length !== 1) {
      alert('Please select a configuration JSON file.');
      return;
    }

    let reader = new FileReader();
    reader.onload = event => {
      try {
        store.dispatch(configLoad(JSON.parse(event.target.result)));
        this.setState({ fileUI: false });
      } catch (ignore) {
        alert('File does not contain a valid LWJGL configuration.');
      }
    };
    reader.readAsText(files[0]);
  }

  render() {
    if (this.state.fileUI) {
      return (
        <div className="download-toolbar">
          <div className="container d-flex">
            <div className="custom-file mx-2">
              <input type="file" className="custom-file-input" accept=".json" onChange={this.handleFile} />
              <label class="custom-file-label" />
            </div>
            <button className="btn btn-outline-light mx-2" onClick={this.toggleFileUI}>
              Cancel
            </button>
          </div>
        </div>
      );
    }

    return (
      <Connect
        state={({ breakpoint }: { breakpoint: BreakPointState }) => ({
          current: breakpoint.current,
          sm: breakpoint.sm,
        })}
      >
        {({ current, sm }, { configLoad }) => {
          const showLabels = current > sm;
          return (
            <div className="download-toolbar">
              {this.props.children}
              <button
                className="btn btn-outline-light"
                title="Load configuration file (JSON)"
                onClick={this.toggleFileUI}
              >
                <FileOpen />
                {showLabels ? ` Load config` : null}
              </button>
              <button
                className="btn btn-outline-light"
                title="Save configuration (in JSON)"
                onClick={this.props.configDownload}
              >
                <FileSave />
                {showLabels ? ` Save config` : null}
              </button>
            </div>
          );
        }}
      </Connect>
    );
  }
}
