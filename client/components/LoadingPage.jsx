import * as React from 'react';
import LoaderSpinner from '~/components/LoaderSpinner';
import type { LoadingComponentProps } from 'react-loadable';

const LoadingPage = ({ isLoading, pastDelay, timedOut, error }: LoadingComponentProps) => {
  if (isLoading && !timedOut) {
    return (
      <div className="text-center" style={{ padding: '5rem 0', minHeight: 'calc(100vh - 4rem)' }}>
        {pastDelay ? <LoaderSpinner size={128} /> : null}
      </div>
    );
  } else if (error || timedOut) {
    return (
      <div className="text-center" style={{ padding: '5rem 0' }}>
        <h1 className="display-4 text-danger">Failed to load page</h1>
        <p>We were unable to load the page you requested. Please make sure you're online.</p>
        <p>Please, refresh the page to try again.</p>
      </div>
    );
  }

  return null;
};

export default LoadingPage;
