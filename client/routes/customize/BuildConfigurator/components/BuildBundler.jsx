// @flow
import * as React from 'react';
import { LoaderSpinner } from '~/components/LoaderSpinner';
import { Connect } from '~/store/Connect';

type Props = {
  cancel: (e: SyntheticEvent<HTMLButtonElement>) => void,
  progress: Array<string>,
};

export class BuildBundler extends React.Component<Props> {
  render() {
    return (
      <div className="col text-left">
        <div className="text-center">
          <LoaderSpinner size={32} className="my-3" />
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
