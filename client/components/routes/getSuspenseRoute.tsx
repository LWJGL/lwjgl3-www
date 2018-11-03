import * as React from 'react';
import { lazy, Suspense } from 'react';
import { PageBlank } from './PageBlank';
// import { delay } from '~/services/delay';
import { RouteComponentProps } from '@reach/router';

export function getSuspenseRoute(loader: ComponentImport) {
  const LazyRoute = lazy(loader);

  // // Simulate network latency
  // const LazyRoute = lazy(async () => {
  //   await delay(2500);
  //   return await loader();
  // });

  const SuspenseRoute = (props: RouteComponentProps) => (
    <Suspense maxDuration={200} fallback={<PageBlank />}>
      <LazyRoute {...props} />
    </Suspense>
  );

  SuspenseRoute.preload = loader;

  return SuspenseRoute;
}
