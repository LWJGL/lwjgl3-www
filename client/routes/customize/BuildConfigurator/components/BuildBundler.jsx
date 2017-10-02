// @flow
import * as React from 'react';
import LoaderSpinner from '~/components/LoaderSpinner';
import Connect from '~/store/Connect';
import type { BuildConfig } from '../types';

class BuildBundler extends React.Component<{||}> {
  componentDidMount() {
    document.getElementsByClassName('config-container')[0].scrollIntoView(true);
  }

  render() {
    return (
      <div className="col">
        <div className="text-center">
          <LoaderSpinner size={32} className="my-3" />
          <h4>Generating ZIP bundle. Please wait...</h4>
        </div>
        <pre>
          <Connect
            state={({ build }: { build: BuildConfig }) => ({
              progress: build.progress,
            })}
          >
            {({ progress }) =>
              progress
                .slice(0)
                .reverse()
                .map((line, i) => <div key={`log${i}`}>{line}</div>)}
          </Connect>
        </pre>
      </div>
    );
  }
}

export default BuildBundler;
