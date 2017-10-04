// @flow
import * as React from 'react';
import LoaderSpinner from '~/components/LoaderSpinner';
import Connect from '~/store/Connect';
import type { BuildConfig } from '../types';

type Props = {
  cancel: (e: SyntheticEvent<HTMLButtonElement>) => void,
  progress: Array<string>,
};

class BuildBundler extends React.Component<Props> {
  componentDidMount() {
    document.getElementsByClassName('config-container')[0].scrollIntoView(true);
  }

  render() {
    return (
      <div className="col">
        <div className="text-center">
          <LoaderSpinner size={32} className="my-3" />
          <h4>Generating ZIP bundle. Please wait...</h4>
          <p>
            <button className="btn btn-sm btn-danger" onClick={this.props.cancel}>
              Cancel
            </button>
          </p>
        </div>
        <pre>
          {this.props.progress
            .slice(0)
            .reverse()
            .map((line, i) => <div key={`log${i}`}>{line}</div>)}
        </pre>
      </div>
    );
  }
}

export default BuildBundler;
