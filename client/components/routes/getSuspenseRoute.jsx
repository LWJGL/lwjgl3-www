// @flow
import * as React from 'react';
//$FlowFixMe
import { lazy, unstable_Suspense as Suspense } from 'react';
import { PageBlank } from './PageBlank';
// import { delay } from '~/services/delay';

export const getSuspenseRoute = (loader: ComponentImport) => {
  const LazyRoute = lazy(loader);

  // // Simulate network latency
  // const LazyRoute = lazy(async () => {
  //   await delay(2500);
  //   return await loader();
  // });

  class SuspenseRoute extends React.Component<{}> {
    static preload() {
      loader();
    }

    render() {
      return (
        <Suspense maxDuration={200} fallback={<PageBlank />}>
          <LazyRoute {...this.props} />
        </Suspense>
      );
    }
  }

  return SuspenseRoute;
};
