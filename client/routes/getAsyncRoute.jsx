// @flow
import * as React from 'react';
//$FlowFixMe
import { lazy, unstable_Suspense as Suspense } from 'react';
import { start, end } from '../components/NavProgress';
// import { delay } from '../services/delay';

type ComponentImport = () => Promise<{ default: React.ComponentType<any> }>;
type Props = {};

class BlankPage extends React.Component<{||}> {
  componentDidMount() {
    start();
  }

  componentWillUnmount() {
    end();
  }

  render() {
    return <div style={{ padding: '5rem 0', minHeight: 'calc(100vh - 4rem)' }} />;
  }
}

export const getAsyncRoute = (loader: ComponentImport) => {
  const AsyncRoute = lazy(loader);

  // // Simulate network latency
  // const AsyncRoute = lazy(async () => {
  //   await delay(2500);
  //   return await loader();
  // });

  class Route extends React.Component<Props> {
    static preload() {
      loader();
    }

    render() {
      return (
        <Suspense maxDuration={300} fallback={<BlankPage />}>
          <AsyncRoute {...this.props} />
        </Suspense>
      );
    }
  }

  return Route;
};
