// @flow
import * as React from 'react';
import { CircularProgress } from '~/components/CircularProgress';

type Props = {
  cancel: (e: SyntheticEvent<HTMLButtonElement>) => void,
  progress: Array<string>,
};

export class BuildBundler extends React.Component<Props> {
  render() {
    return (
      <div className="col py-3">
        <div className="text-center">
          <CircularProgress size={32} className="my-3" style={{ color: 'white' }} />
          <h4>Generating ZIP bundle. Please wait...</h4>
          <p>
            <button className="btn btn-sm btn-danger" onClick={this.props.cancel}>
              Cancel
            </button>
          </p>
        </div>
        <pre style={{ color: 'white', height: '50vh', overflow: 'auto' }}>
          {this.props.progress
            .slice(0)
            .reverse()
            .map((line, i) => <div key={`log${i}`}>{line}</div>)}
        </pre>
      </div>
    );
  }
}
