import React, { lazy, Suspense } from 'react';
import { PageBlank } from './PageBlank';
import { RouteComponentProps } from '@reach/router';
// import { delay } from '~/services/delay';

export function getSuspenseRoute(loader: ComponentImport) {
  const LazyRoute = lazy(loader);

  // // Simulate network latency
  // const LazyRoute = lazy(async () => {
  //   await delay(1000);
  //   return await loader();
  // });

  const SuspenseRoute: React.FC<RouteComponentProps> = props => (
    <Suspense maxDuration={200} fallback={<PageBlank />}>
      <LazyRoute {...props} />
    </Suspense>
  );

  //@ts-ignore
  SuspenseRoute.preload = loader;

  return SuspenseRoute;
}
