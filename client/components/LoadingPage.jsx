import React from 'react';
import LoaderSpinner from 'components/LoaderSpinner';
import type { LoadingComponentProps } from 'react-loadable';

const LoadingPage = ({ isLoading, pastDelay, error }: LoadingComponentProps) => {
  if (error) {
    return (
      <div className="text-center" style={{ padding: '5rem 0' }}>
        <h1 className="display-4 text-danger">Failed to load page</h1>
        <p>We were unable to load the page you requested. Please make sure you're online.</p>
        <p>Please, refresh the page to try again.</p>
      </div>
    );
  }

  return (
    <div className="text-center" style={{ padding: '5rem 0' }}>
      {pastDelay ? <LoaderSpinner size={128} /> : null}
    </div>
  );
};

export default LoadingPage;
