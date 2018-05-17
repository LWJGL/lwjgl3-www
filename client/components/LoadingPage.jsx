// @flow
import * as React from 'react';
import { LoaderSpinner } from '~/components/LoaderSpinner';
import nprogress from 'nprogress';
import type { LoadingComponentProps } from 'loadable-components';

type State = {
  pastDelay: boolean,
  // timedOut: boolean,
};

let firstRoute = true;
export const LOADING_DELAY = 300;
// export const LOADING_TIMEOUT = 1000;

// TODO: Decouple nprogress from LoadingPage
// Maybe add a top-level API that will track current running progress loaders

function start() {
  if (firstRoute) {
    firstRoute = false;
    nprogress.configure({
      showSpinner: false,
    });
  } else {
    nprogress.start();
  }
}

function stop() {
  if (nprogress.isStarted()) {
    nprogress.done();
  }
}

export class LoadingPage extends React.Component<LoadingComponentProps, State> {
  state = {
    pastDelay: false,
    // timedOut: false,
  };
  delayTimeout = setTimeout(() => this.setState({ pastDelay: true }), LOADING_DELAY);

  cleanup() {
    if (this.delayTimeout !== null) {
      clearTimeout(this.delayTimeout);
      this.delayTimeout = null;
    }
  }

  componentDidMount() {
    // Start spinner
    start();
  }

  componentWillUnmount() {
    // Make sure we stop timer & spinner
    stop();
    this.cleanup();
  }

  componentDidUpdate(prevProps: LoadingComponentProps) {
    // If re-renders (either because it's we're past delay or because it threw an error), stop timer & spinner
    if (!FLAG_PRODUCTION && prevProps.error !== this.props.error) {
      console.error(this.props.error);
    }
    stop();
    this.cleanup();
  }

  render() {
    const { error } = this.props;
    const { /*timedOut, */ pastDelay } = this.state;

    return error ? (
      <div className="text-center" style={{ padding: '5rem 0' }}>
        <h1 className="display-4 text-danger">Failed to load page</h1>
        <p>We were unable to load the page you requested. Please make sure you're online.</p>
        <p>Please, refresh the page to try again.</p>
      </div>
    ) : (
      <div className="text-center" style={{ padding: '5rem 0', minHeight: 'calc(100vh - 4rem)' }}>
        {pastDelay ? <LoaderSpinner size={128} /> : null}
      </div>
    );
  }
}
