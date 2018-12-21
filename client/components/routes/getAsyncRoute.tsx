import React from 'react';
import { useState, useEffect } from 'react';
import { PageBlank } from './PageBlank';
import { PageError } from './PageError';
import { RouteComponentProps } from '@reach/router';

export function getAsyncRoute(loader: ComponentImport) {
  let RouteComponent: React.ComponentType<any> | null = null;

  const AsyncRoute = (props: RouteComponentProps) => {
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(RouteComponent === null);

    useEffect(() => {
      if (RouteComponent === null) {
        loader()
          .then(module => {
            RouteComponent = module.default;
          })
          .catch(error => {
            setError(error);
          })
          .finally(() => {
            setLoading(false);
          });
      }
    }, []);

    if (error) {
      return <PageError error={error} />;
    } else if (loading) {
      return <PageBlank delay={200} />;
    } else if (RouteComponent !== null) {
      return <RouteComponent {...props} />;
    } else {
      return null;
    }
  };

  AsyncRoute.preload = loader;

  return AsyncRoute;
}
